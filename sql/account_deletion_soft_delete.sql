-- Soft Deletion and Data Restoration SQL for Knot
-- This script adds soft deletion support to existing tables and creates restoration procedures

-- Add soft deletion columns to existing tables
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE pod_members ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE pod_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE pod_members ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE pods ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE pods ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE pods ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE habits ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Create indexes for soft deletion queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_deleted ON user_profiles(is_deleted);
CREATE INDEX IF NOT EXISTS idx_user_profiles_deleted_by ON user_profiles(deleted_by);
CREATE INDEX IF NOT EXISTS idx_pod_members_is_deleted ON pod_members(is_deleted);
CREATE INDEX IF NOT EXISTS idx_pod_members_deleted_by ON pod_members(deleted_by);
CREATE INDEX IF NOT EXISTS idx_check_ins_is_deleted ON check_ins(is_deleted);
CREATE INDEX IF NOT EXISTS idx_check_ins_deleted_by ON check_ins(deleted_by);
CREATE INDEX IF NOT EXISTS idx_pods_is_deleted ON pods(is_deleted);
CREATE INDEX IF NOT EXISTS idx_habits_is_deleted ON habits(is_deleted);

-- Function to soft delete all user data
DROP FUNCTION IF EXISTS soft_delete_user_data(UUID, UUID);
CREATE OR REPLACE FUNCTION soft_delete_user_data(target_user_id UUID, deleted_by_user UUID)
RETURNS void AS $$
BEGIN
  -- Soft delete user profile
  UPDATE user_profiles
  SET is_deleted = TRUE,
      deleted_at = NOW(),
      deleted_by = deleted_by_user
  WHERE user_id = target_user_id AND is_deleted = FALSE;

  -- Soft delete pod memberships
  UPDATE pod_members
  SET is_deleted = TRUE,
      deleted_at = NOW(),
      deleted_by = deleted_by_user
  WHERE user_id = target_user_id AND is_deleted = FALSE;

  -- Soft delete check-ins
  UPDATE check_ins
  SET is_deleted = TRUE,
      deleted_at = NOW(),
      deleted_by = deleted_by_user
  WHERE user_id = target_user_id AND is_deleted = FALSE;

  -- Note: We don't delete pods or habits as those may be shared
  -- Pods are only deleted if the user was the sole member
  -- Habits are pod-specific and should remain for other members
END;
$$ LANGUAGE plpgsql;

-- Function to restore all user data
DROP FUNCTION IF EXISTS restore_user_data(UUID);
CREATE OR REPLACE FUNCTION restore_user_data(target_user_id UUID)
RETURNS TABLE(
  profiles_restored INTEGER,
  pod_members_restored INTEGER,
  check_ins_restored INTEGER
) AS $$
DECLARE
  profiles_count INTEGER;
  pod_members_count INTEGER;
  check_ins_count INTEGER;
BEGIN
  -- Restore user profile
  UPDATE user_profiles
  SET is_deleted = FALSE,
      deleted_at = NULL,
      deleted_by = NULL
  WHERE user_id = target_user_id AND is_deleted = TRUE;
  GET DIAGNOSTICS profiles_count = ROW_COUNT;

  -- Restore pod memberships
  UPDATE pod_members
  SET is_deleted = FALSE,
      deleted_at = NULL,
      deleted_by = NULL
  WHERE user_id = target_user_id AND is_deleted = TRUE;
  GET DIAGNOSTICS pod_members_count = ROW_COUNT;

  -- Restore check-ins
  UPDATE check_ins
  SET is_deleted = FALSE,
      deleted_at = NULL,
      deleted_by = NULL
  WHERE user_id = target_user_id AND is_deleted = TRUE;
  GET DIAGNOSTICS check_ins_count = ROW_COUNT;

  RETURN QUERY SELECT profiles_count, pod_members_count, check_ins_count;
END;
$$ LANGUAGE plpgsql;

-- Function to delete pods where user was sole member
DROP FUNCTION IF EXISTS delete_sole_member_pods(UUID, UUID);
CREATE OR REPLACE FUNCTION delete_sole_member_pods(target_user_id UUID, deleted_by_user UUID)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Find pods where user was the only non-deleted member
  WITH sole_member_pods AS (
    SELECT p.id
    FROM pods p
    WHERE p.is_deleted = FALSE
    AND NOT EXISTS (
      SELECT 1 FROM pod_members pm
      WHERE pm.pod_id = p.id
      AND pm.user_id != target_user_id
      AND pm.is_deleted = FALSE
    )
    AND EXISTS (
      SELECT 1 FROM pod_members pm
      WHERE pm.pod_id = p.id
      AND pm.user_id = target_user_id
      AND pm.is_deleted = FALSE
    )
  )
  UPDATE pods
  SET is_deleted = TRUE,
      deleted_at = NOW(),
      deleted_by = deleted_by_user
  WHERE id IN (SELECT id FROM sole_member_pods);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to restore pods that were deleted due to sole member
DROP FUNCTION IF EXISTS restore_sole_member_pods(UUID);
CREATE OR REPLACE FUNCTION restore_sole_member_pods(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  restored_count INTEGER;
BEGIN
  -- Restore pods that were deleted when this user was the sole member
  UPDATE pods p
  SET is_deleted = FALSE,
      deleted_at = NULL,
      deleted_by = NULL
  WHERE p.is_deleted = TRUE
  AND p.deleted_by = target_user_id
  AND EXISTS (
    SELECT 1 FROM pod_members pm
    WHERE pm.pod_id = p.id
    AND pm.user_id = target_user_id
    AND pm.is_deleted = FALSE
  );
  
  GET DIAGNOSTICS restored_count = ROW_COUNT;
  RETURN restored_count;
END;
$$ LANGUAGE plpgsql;

-- Create a comprehensive account deletion function
DROP FUNCTION IF EXISTS perform_account_deletion(UUID, UUID);
CREATE OR REPLACE FUNCTION perform_account_deletion(target_user_id UUID, deleted_by_user UUID)
RETURNS JSON AS $$
DECLARE
  pods_deleted INTEGER;
  result JSON;
BEGIN
  -- Delete pods where user was sole member
  pods_deleted := delete_sole_member_pods(target_user_id, deleted_by_user);
  
  -- Soft delete all user data
  PERFORM soft_delete_user_data(target_user_id, deleted_by_user);
  
  -- Return summary
  result := json_build_object(
    'success', true,
    'pods_deleted', pods_deleted,
    'timestamp', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a comprehensive account restoration function
DROP FUNCTION IF EXISTS perform_account_restoration(UUID);
CREATE OR REPLACE FUNCTION perform_account_restoration(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  data_restored RECORD;
  pods_restored INTEGER;
  result JSON;
BEGIN
  -- Restore user data
  SELECT * INTO data_restored FROM restore_user_data(target_user_id);
  
  -- Restore pods that were deleted due to sole member
  pods_restored := restore_sole_member_pods(target_user_id);
  
  -- Return summary
  result := json_build_object(
    'success', true,
    'profiles_restored', data_restored.profiles_restored,
    'pod_members_restored', data_restored.pod_members_restored,
    'check_ins_restored', data_restored.check_ins_restored,
    'pods_restored', pods_restored,
    'timestamp', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION soft_delete_user_data TO authenticated;
GRANT EXECUTE ON FUNCTION restore_user_data TO authenticated;
GRANT EXECUTE ON FUNCTION delete_sole_member_pods TO authenticated;
GRANT EXECUTE ON FUNCTION restore_sole_member_pods TO authenticated;
GRANT EXECUTE ON FUNCTION perform_account_deletion TO authenticated;
GRANT EXECUTE ON FUNCTION perform_account_restoration TO authenticated;

-- Update RLS policies to respect soft deletion
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own active profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own active profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service role can soft delete user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service role can restore user profiles" ON user_profiles;

-- Create new policies that respect soft deletion
CREATE POLICY "Users can view own active profiles"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Users can update own active profiles"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id AND is_deleted = FALSE);

-- Similar policies for pod_members
DROP POLICY IF EXISTS "Users can view own pod memberships" ON pod_members;
DROP POLICY IF EXISTS "Users can insert own pod memberships" ON pod_members;
DROP POLICY IF EXISTS "Users can view own active pod memberships" ON pod_members;

CREATE POLICY "Users can view own active pod memberships"
  ON pod_members FOR SELECT
  USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Users can insert own pod memberships"
  ON pod_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for check_ins
DROP POLICY IF EXISTS "Users can view own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can insert own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can view own active check-ins" ON check_ins;

CREATE POLICY "Users can view own active check-ins"
  ON check_ins FOR SELECT
  USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Users can insert own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role policies for deletion/restoration
DROP POLICY IF EXISTS "Service role can soft delete pod members" ON pod_members;
DROP POLICY IF EXISTS "Service role can restore pod members" ON pod_members;
DROP POLICY IF EXISTS "Service role can soft delete check-ins" ON check_ins;
DROP POLICY IF EXISTS "Service role can restore check-ins" ON check_ins;

CREATE POLICY "Service role can soft delete user profiles"
  ON user_profiles FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can restore user profiles"
  ON user_profiles FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can soft delete pod members"
  ON pod_members FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can restore pod members"
  ON pod_members FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can soft delete check-ins"
  ON check_ins FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can restore check-ins"
  ON check_ins FOR UPDATE
  USING (auth.role() = 'service_role');

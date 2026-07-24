-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_upgraded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Create pods table
CREATE TABLE IF NOT EXISTS pods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL DEFAULT 'daily', -- 'daily', 'weekdays', 'custom'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create pod_members table
CREATE TABLE IF NOT EXISTS pod_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(pod_id, user_id)
);

-- Create check_ins table for daily habit tracking
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'done', 'missed', 'waiting'
  check_in_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(pod_id, user_id, check_in_date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pods_invite_code ON pods(invite_code);
CREATE INDEX IF NOT EXISTS idx_pods_created_by ON pods(created_by);
CREATE INDEX IF NOT EXISTS idx_habits_pod_id ON habits(pod_id);
CREATE INDEX IF NOT EXISTS idx_pod_members_pod_id ON pod_members(pod_id);
CREATE INDEX IF NOT EXISTS idx_pod_members_user_id ON pod_members(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_pod_id ON check_ins(pod_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(check_in_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_pods_updated_at ON pods;
CREATE TRIGGER update_pods_updated_at BEFORE UPDATE ON pods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_check_ins_updated_at ON check_ins;
CREATE TRIGGER update_check_ins_updated_at BEFORE UPDATE ON check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Grant table privileges to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pod_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.check_ins TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Pods policies
DROP POLICY IF EXISTS "Users can view pods they are members of" ON pods;
CREATE POLICY "Users can view pods they are members of"
  ON pods FOR SELECT
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert pods they create" ON pods;
CREATE POLICY "Users can insert pods they create"
  ON pods FOR INSERT
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Pod admins can update pods" ON pods;
CREATE POLICY "Pod admins can update pods"
  ON pods FOR UPDATE
  USING (
    created_by = auth.uid()
  );

-- Function to check if invite code exists (for public use before signup)
CREATE OR REPLACE FUNCTION public.check_invite_code_exists(invite_code_param TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pods WHERE invite_code = invite_code_param
  );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to public (including unauthenticated users)
GRANT EXECUTE ON FUNCTION public.check_invite_code_exists TO anon;
GRANT EXECUTE ON FUNCTION public.check_invite_code_exists TO authenticated;

-- Habits policies
DROP POLICY IF EXISTS "Users can view habits for pods they are members of" ON habits;
CREATE POLICY "Users can view habits for pods they are members of"
  ON habits FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Pod admins can insert habits" ON habits;
CREATE POLICY "Pod admins can insert habits"
  ON habits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pod_members 
      WHERE pod_id = habits.pod_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Pod admins can update habits" ON habits;
CREATE POLICY "Pod admins can update habits"
  ON habits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pod_members 
      WHERE pod_id = habits.pod_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Security Definer function to check membership safely and avoid recursion
CREATE OR REPLACE FUNCTION public.check_user_in_pod(p_pod_id UUID, p_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pod_members 
    WHERE pod_id = p_pod_id AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql;

-- Pod members policies
DROP POLICY IF EXISTS "Users can view pod members for pods they are in" ON pod_members;
CREATE POLICY "Users can view pod members for pods they are in"
  ON pod_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    public.check_user_in_pod(pod_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert themselves into a pod via invite code" ON pod_members;
CREATE POLICY "Users can insert themselves into a pod via invite code"
  ON pod_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Pod admins can update member roles" ON pod_members;
CREATE POLICY "Pod admins can update member roles"
  ON pod_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pod_members pm
      WHERE pm.pod_id = pod_members.pod_id 
      AND pm.user_id = auth.uid() 
      AND pm.role = 'admin'
    )
  );

-- Check-ins policies
DROP POLICY IF EXISTS "Users can view check-ins for their pods" ON check_ins;
CREATE POLICY "Users can view check-ins for their pods"
  ON check_ins FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own check-ins" ON check_ins;
CREATE POLICY "Users can insert their own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own check-ins" ON check_ins;
CREATE POLICY "Users can update their own check-ins"
  ON check_ins FOR UPDATE
  USING (user_id = auth.uid());

-- Function to validate invite code and get pod
CREATE OR REPLACE FUNCTION get_pod_by_invite_code(invite_code_param TEXT)
RETURNS UUID AS $$
DECLARE
  pod_uuid UUID;
BEGIN
  SELECT id INTO pod_uuid FROM pods WHERE invite_code = invite_code_param;
  RETURN pod_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add user to pod via invite code
CREATE OR REPLACE FUNCTION join_pod_via_invite_code(invite_code_param TEXT)
RETURNS JSON AS $$
DECLARE
  pod_uuid UUID;
  result JSON;
  member_count INTEGER;
BEGIN
  -- Get pod by invite code with row lock to prevent concurrent modifications
  SELECT id INTO pod_uuid FROM pods WHERE invite_code = invite_code_param FOR UPDATE;
  
  IF pod_uuid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid invite code');
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM pod_members 
    WHERE pod_id = pod_uuid AND user_id = auth.uid()
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Already a member of this pod');
  END IF;
  
  -- Check if pod is full (max 5 members) with lock to prevent race conditions
  SELECT COUNT(*) INTO member_count FROM pod_members WHERE pod_id = pod_uuid FOR UPDATE;
  
  IF member_count >= 5 THEN
    RETURN json_build_object('success', false, 'error', 'Pod is full (max 5 members)');
  END IF;
  
  -- Add user to pod
  INSERT INTO pod_members (pod_id, user_id, role)
  VALUES (pod_uuid, auth.uid(), 'member');
  
  RETURN json_build_object('success', true, 'pod_id', pod_uuid);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission for join_pod_via_invite_code
GRANT EXECUTE ON FUNCTION public.join_pod_via_invite_code TO authenticated;
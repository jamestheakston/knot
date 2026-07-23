-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
CREATE TRIGGER update_pods_updated_at BEFORE UPDATE ON pods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at BEFORE UPDATE ON check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Pods policies
CREATE POLICY "Users can view pods they are members of"
  ON pods FOR SELECT
  USING (
    id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert pods they create"
  ON pods FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Pod admins can update pods"
  ON pods FOR UPDATE
  USING (
    id IN (
      SELECT pod_id FROM pod_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Habits policies
CREATE POLICY "Users can view habits for pods they are members of"
  ON habits FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pod admins can insert habits"
  ON habits FOR INSERT
  WITH CHECK (
    pod_id IN (
      SELECT pod_id FROM pod_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Pod admins can update habits"
  ON habits FOR UPDATE
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Pod members policies
CREATE POLICY "Users can view pod members for pods they are in"
  ON pod_members FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert themselves into a pod via invite code"
  ON pod_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Pod admins can update member roles"
  ON pod_members FOR UPDATE
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Check-ins policies
CREATE POLICY "Users can view check-ins for their pods"
  ON check_ins FOR SELECT
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (user_id = auth.uid());

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
BEGIN
  -- Get pod by invite code
  SELECT id INTO pod_uuid FROM pods WHERE invite_code = invite_code_param;
  
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
  
  -- Check if pod is full (max 5 members)
  IF (
    SELECT COUNT(*) FROM pod_members WHERE pod_id = pod_uuid
  ) >= 5 THEN
    RETURN json_build_object('success', false, 'error', 'Pod is full (max 5 members)');
  END IF;
  
  -- Add user to pod
  INSERT INTO pod_members (pod_id, user_id, role)
  VALUES (pod_uuid, auth.uid(), 'member');
  
  RETURN json_build_object('success', true, 'pod_id', pod_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

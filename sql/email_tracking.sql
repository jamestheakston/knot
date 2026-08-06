-- Email Tracking Table for Knot
-- Tracks which emails have been sent to which users to avoid duplicates

CREATE TABLE IF NOT EXISTS email_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL, -- 'streak_broken', 'everyone_missed', 'not_working'
  pod_id UUID REFERENCES pods(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email_type, pod_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_tracking_user_id ON email_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_email_type ON email_tracking(email_type);
CREATE INDEX IF NOT EXISTS idx_email_tracking_pod_id ON email_tracking(pod_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_sent_at ON email_tracking(sent_at);

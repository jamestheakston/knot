-- Account Deletion and Recovery Tables for Knot

-- Table to store account deletion requests
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  recovery_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, deleted, recovered
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  recovered_at TIMESTAMP WITH TIME ZONE
);

-- Table to store account recovery attempts (for audit trail)
CREATE TABLE IF NOT EXISTS account_recovery_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deletion_request_id UUID NOT NULL REFERENCES account_deletion_requests(id) ON DELETE CASCADE,
  recovery_id TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE
);

-- Index for faster lookups by recovery_id
CREATE INDEX IF NOT EXISTS idx_account_deletion_recovery_id ON account_deletion_requests(recovery_id);
CREATE INDEX IF NOT EXISTS idx_account_deletion_user_id ON account_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_account_deletion_status ON account_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_account_deletion_expires_at ON account_deletion_requests(expires_at);

-- Enable Row Level Security
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_recovery_attempts ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE account_deletion_requests TO authenticated;
GRANT ALL ON TABLE account_recovery_attempts TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE account_deletion_requests_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE account_recovery_attempts_id_seq TO authenticated;

-- RLS Policies for account_deletion_requests
-- Users can only see their own deletion requests
CREATE POLICY "Users can view own deletion requests"
  ON account_deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own deletion requests
CREATE POLICY "Users can insert own deletion requests"
  ON account_deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own deletion requests
CREATE POLICY "Users can update own deletion requests"
  ON account_deletion_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can update deletion requests (for verification/deletion)
CREATE POLICY "Service role can update deletion requests"
  ON account_deletion_requests FOR UPDATE
  USING (auth.role() = 'service_role');

-- Service role can delete deletion requests
CREATE POLICY "Service role can delete deletion requests"
  ON account_deletion_requests FOR DELETE
  USING (auth.role() = 'service_role');

-- RLS Policies for account_recovery_attempts
-- Service role can insert recovery attempts
CREATE POLICY "Service role can insert recovery attempts"
  ON account_recovery_attempts FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Service role can view recovery attempts
CREATE POLICY "Service role can view recovery attempts"
  ON account_recovery_attempts FOR SELECT
  USING (auth.role() = 'service_role');

-- Function to clean up expired deletion requests
CREATE OR REPLACE FUNCTION cleanup_expired_deletion_requests()
RETURNS void AS $$
BEGIN
  DELETE FROM account_deletion_requests
  WHERE expires_at < NOW()
    AND status IN ('pending', 'verified');
END;
$$ LANGUAGE plpgsql;

-- Schedule the cleanup function to run daily (requires pg_cron extension)
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule('cleanup-expired-deletion-requests', '0 2 * * *', 'SELECT cleanup_expired_deletion_requests()');

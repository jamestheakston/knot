-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the process-pending-deletions function to run every hour
-- This will process account deletions that have been pending for more than 24 hours
SELECT cron.schedule(
    'process-pending-deletions-hourly',
    '0 * * * *', -- Run every hour at minute 0
    $$
    SELECT net.http_post(
        url := 'https://mfjtdrqvmuwtoarkiezi.supabase.co/functions/v1/process-pending-deletions',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
    );
    $$
);

-- Verify the cron job was created
SELECT * FROM cron.job;

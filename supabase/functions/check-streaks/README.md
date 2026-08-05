# Check Streaks Edge Function

This Edge Function automatically checks for broken streaks and pod inactivity, sending appropriate emails to users without requiring them to be logged in.

## Deployment Instructions

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Link to your Supabase project
```bash
supabase link --project-ref your-project-ref
```

### 3. Set environment variables
The Edge Function requires these environment variables (set in Supabase dashboard):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (from Settings > API)

### 4. Deploy the function
```bash
supabase functions deploy check-streaks
```

### 5. Verify deployment
The function will run daily at midnight (UTC) based on the cron schedule in `deno.json`.

## How It Works

1. **Daily Execution**: Runs at midnight every day
2. **Pod Analysis**: Checks all pods for check-in activity
3. **Streak Detection**: 
   - If some users missed but not all → sends "You broke the streak" email to those who missed
   - If all users missed → sends "Everyone missed" email to all pod members
4. **Email Sending**: Uses EmailJS to send emails with your existing templates

## Testing

You can test the function manually:
```bash
supabase functions invoke check-streaks
```

## Monitoring

Check function logs in Supabase dashboard:
- Go to Edge Functions > check-streaks > Logs

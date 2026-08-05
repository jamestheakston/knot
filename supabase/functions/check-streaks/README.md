# Check Streaks Edge Function

This Edge Function automatically checks for broken streaks and pod inactivity, sending appropriate emails to users without requiring them to be logged in.

## Deployment Instructions (Web Dashboard)

### 1. Go to Supabase Dashboard
- Navigate to your Supabase project dashboard
- Go to "Edge Functions" in the left sidebar

### 2. Create New Function
- Click "New Function"
- Name it: `check-streaks`
- Click "Create"

### 3. Paste the Function Code
- Copy the contents of `index.ts` 
- Paste it into the code editor
- Click "Save"

### 4. Configure Environment Variables
- Click on the function settings (gear icon)
- Add environment variables:
  - `SUPABASE_URL`: Your Supabase project URL (from Settings > API)
  - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (from Settings > API)
- Click "Save"

### 5. Set Cron Schedule
- In the function settings, find "Cron Schedule"
- Enter: `0 0 * * *` (runs daily at midnight UTC)
- Click "Save"

### 6. Deploy
- Click "Deploy" button
- Wait for deployment to complete

### 7. Test
- Click "Invoke" button to test the function manually
- Check logs to see execution results

## Alternative: CLI Deployment

If you prefer using the CLI:

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Link to your Supabase project
```bash
supabase link --project-ref your-project-ref
```

### 3. Deploy the function
```bash
supabase functions deploy check-streaks
```

## How It Works

1. **Daily Execution**: Runs at midnight every day (UTC)
2. **Pod Analysis**: Checks all pods for check-in activity
3. **Streak Detection**: 
   - If some users missed but not all → sends "You broke the streak" email to those who missed
   - If all users missed → sends "Everyone missed" email to all pod members
4. **Email Sending**: Uses EmailJS to send emails with your existing templates

## Testing

You can test the function manually from the dashboard:
- Go to Edge Functions > check-streaks
- Click "Invoke" button
- Check logs for results

## Monitoring

Check function logs in Supabase dashboard:
- Go to Edge Functions > check-streaks > Logs

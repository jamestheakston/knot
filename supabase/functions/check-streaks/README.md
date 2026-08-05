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

### 5. Deploy
- Click "Deploy" button
- Wait for deployment to complete

### 6. Test
- Click "Invoke" button to test the function manually
- Check logs to see execution results

### 7. Set Up Automatic Scheduling with GitHub Actions (Recommended)
**Note**: Supabase web dashboard doesn't have built-in cron scheduling. Use GitHub Actions for first-party scheduling.

**Setup Steps:**
1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add a new secret named `SUPABASE_ANON_KEY`
4. Paste your Supabase anon key (from Settings > API in Supabase dashboard)
5. The workflow file is already included at `.github/workflows/check-streaks.yml`
6. The workflow runs daily at midnight UTC and can be triggered manually

**To trigger manually:**
- Go to Actions tab in GitHub
- Select "Check Streaks" workflow
- Click "Run workflow" button

**Alternative Options:**

**Option B: External Cron Service**
- Use a free service like cron-job.org or EasyCron
- Set URL to: `https://mfjtdrqvmuwtoarkiezi.supabase.co/functions/v1/check-streaks`
- Set schedule to run daily at your preferred time

**Option C: Manual Invocation**
- Run the function manually from the Supabase dashboard when needed
- Or call the URL directly: `https://mfjtdrqvmuwtoarkiezi.supabase.co/functions/v1/check-streaks`

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

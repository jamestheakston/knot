import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'uF5gBRgWvS-o3wTjZ'
const EMAILJS_SERVICE_ID = 'service_3e0s0ad'
const EMAILJS_TEMPLATE_ID = 'template_7xm80oj'
const EMAILJS_PRIVATE_KEY = Deno.env.get('EMAILJS_PRIVATE_KEY') || ''

serve(async (req) => {
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all users
    const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers()
    
    if (authUsersError) throw authUsersError
    if (!authUsers || !authUsers.users) {
      return new Response(JSON.stringify({ message: 'No users found' }), { status: 200 })
    }

    const results = []
    let sentCount = 0
    let skippedCount = 0
    const bccEmails: string[] = []

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    for (const user of authUsers.users) {
      // Check if user has opted out of marketing
      const marketingOptOut = user.user_metadata?.marketing_opt_out === true
      
      if (marketingOptOut) {
        skippedCount++
        continue
      }

      const email = user.email
      if (!email) {
        skippedCount++
        continue
      }

      // Check if user has any check-ins in the last 7 days
      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .select('user_id')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .limit(1)

      if (checkInsError) {
        console.error(`Error checking check-ins for ${email}:`, checkInsError)
        continue
      }

      // If user has check-ins in the last 7 days, skip them
      if (checkIns && checkIns.length > 0) {
        skippedCount++
        continue
      }

      // Check if we've already sent a not_working email to this user
      const { data: existingEmail } = await supabase
        .from('email_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('email_type', 'not_working')
        .maybeSingle()

      if (existingEmail) {
        skippedCount++
        continue
      }

      bccEmails.push(email)
    }

    // Send single "this isn't working" email with BCC list
    if (bccEmails.length > 0) {
      const emailContent = generateNotWorkingEmailHTML()
      
      const requestBody: any = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          toemail: 'noreply.jamestheakston@gmail.com',
          bcc: bccEmails.join(','),
          fromname: 'Knot',
          subject: 'Is Knot working for you?',
          email_content: emailContent
        }
      }

      // Add private key if available for server-side authentication
      if (EMAILJS_PRIVATE_KEY) {
        requestBody.accessToken = EMAILJS_PRIVATE_KEY
      }
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        sentCount = bccEmails.length
        
        // Track all users who received the email
        for (const user of authUsers.users) {
          if (bccEmails.includes(user.email || '')) {
            await supabase
              .from('email_tracking')
              .insert({
                user_id: user.id,
                email_type: 'not_working'
              })
          }
        }
        
        bccEmails.forEach(email => {
          results.push({
            email: email,
            status: 'sent'
          })
        })
      } else {
        bccEmails.forEach(email => {
          results.push({
            email: email,
            status: 'failed',
            error: response.statusText
          })
        })
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Inactive user check completed',
      totalUsers: authUsers.users.length,
      sent: sentCount,
      skipped: skippedCount,
      results: results 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in check-inactive-users function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function generateNotWorkingEmailHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Is Knot working for you?</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background-color: #F7F8FB; color: #151922; font-family: 'Work Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  table { border-collapse: collapse; width: 100%; }
  .email-wrapper { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 20px; overflow: hidden; }
  .header { padding: 28px 36px; text-align: left; border-bottom: 1px solid rgba(21, 25, 34, 0.10); }
  .logo { font-family: 'Instrument Serif', serif; font-size: 24px; color: #151922; text-decoration: none; display: inline-flex; align-items: center; font-weight: 400; }
  .content { padding: 44px 36px; }
  h1 { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 5vw, 44px); line-height: 1.1; margin: 0 0 16px 0; font-weight: 400; letter-spacing: -0.01em; }
  h1 em { font-style: italic; color: #2A4BD7; }
  p { color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 28px 0; }
  .btn-primary { display: inline-flex; align-items: center; justify-content: center; background: #2A4BD7; color: #FFFFFF; padding: 13px 24px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; font-family: 'Work Sans', sans-serif; }
  .btn-secondary { display: inline-flex; align-items: center; justify-content: center; background: #F7F8FB; color: #151922; padding: 13px 24px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; font-family: 'Work Sans', sans-serif; border: 1px solid rgba(21, 25, 34, 0.10); }
  .footer { border-top: 1px solid rgba(21, 25, 34, 0.10); padding: 28px 36px; background-color: #F7F8FB; text-align: left; }
  .footer p { color: #8890A0; font-size: 13px; margin: 0; }
  .footer a { color: #2A4BD7; text-decoration: underline; }
</style>
</head>
<body>
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="email-wrapper">
          <div class="header">
            <a href="https://knotapp.pages.dev" class="logo">Knot</a>
          </div>
          <div class="content">
            <h1>Is Knot <em>working</em> for you?</h1>
            <p>We noticed you haven't checked in with your pod in over a week. If Knot isn't fitting into your routine right now, that's completely okay.</p>
            <p>However, we have limited database space and want to keep our community active and engaged. If you're not using Knot, we'd appreciate it if you could delete your account to free up resources for others who are ready to commit.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://knotapp.pages.dev/account/deletion/deleteaccount.html" class="btn-primary" style="margin-right: 12px;">Delete Account</a>
              <a href="https://knotapp.pages.dev/dashboard.html" class="btn-secondary">Keep Using Knot</a>
            </div>
            <p style="font-size: 14px; color: #8890A0;">If you'd like to keep trying, just check in with your pod to continue your streak. We're here whenever you're ready.</p>
          </div>
          <div class="footer">
            <p>You received this email because you're a member of Knot.</p>
            <p style="margin-top: 8px;">© 2026 Knot.</p>
            <p style="margin-top: 8px; font-size: 12px;">Don't like these emails? <a href="https://knotapp.pages.dev/account/email/manage.html">Unsubscribe from them</a></p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

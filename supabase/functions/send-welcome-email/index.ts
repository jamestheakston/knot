import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'uF5gBRgWvS-o3wTjZ'
const EMAILJS_SERVICE_ID = 'service_yn3gq3m'
const EMAILJS_TEMPLATE_ID = 'template_7xm80oj'

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

      // Send welcome email
      const emailContent = generateWelcomeEmailHTML()
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            toemail: email,
            fromname: 'Knot',
            subject: 'Welcome to Knot',
            email_content: emailContent
          }
        })
      })

      if (response.ok) {
        sentCount++
        results.push({
          email: email,
          status: 'sent'
        })
      } else {
        results.push({
          email: email,
          status: 'failed',
          error: response.statusText
        })
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Welcome email campaign completed',
      totalUsers: authUsers.users.length,
      sent: sentCount,
      skipped: skippedCount,
      results: results 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in send-welcome-email function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function generateWelcomeEmailHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Knot</title>
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
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #2A4BD7; background: rgba(42, 75, 215, 0.08); border: 1px solid rgba(42, 75, 215, 0.2); padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #2A4BD7; display: inline-block; }
  h1 { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 5vw, 44px); line-height: 1.1; margin: 0 0 16px 0; font-weight: 400; letter-spacing: -0.01em; }
  h1 em { font-style: italic; color: #2A4BD7; }
  p { color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 28px 0; }
  .btn-primary { display: inline-flex; align-items: center; justify-content: center; background: #2A4BD7; color: #FFFFFF; padding: 13px 24px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; font-family: 'Work Sans', sans-serif; }
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
            <h1>Welcome to <em>Knot</em>.</h1>
            <p>A habit is easier to keep than a promise, when both are shared. Thank you for joining Knot — we're excited to have you as part of our community.</p>
            <p>Whether you're starting a new pod or joining an existing one, you're now part of a network of people committed to showing up for each other, every single day.</p>
            <div style="text-align: center;">
              <a href="https://knotapp.pages.dev/dashboard.html" class="btn-primary">Go to Dashboard</a>
            </div>
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

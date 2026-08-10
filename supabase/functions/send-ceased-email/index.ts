import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'uF5gBRgWvS-o3wTjZ'
const EMAILJS_SERVICE_ID = 'service_yn3gq3m'
const EMAILJS_TEMPLATE_ID = 'template_7xm80oj'
const EMAILJS_PRIVATE_KEY = Deno.env.get('EMAILJS_PRIVATE_KEY') || ''

serve(async (req) => {
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all users from Supabase auth
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers()

    if (fetchError) {
      console.error('Error fetching users:', fetchError)
      return new Response(JSON.stringify({ error: 'Failed to fetch users', details: fetchError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      })
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    }

    console.log(`Found ${users.length} users to send emails to`)

    const emailContent = generateCeasedEmailHTML()
    const results = []
    let successCount = 0
    let failureCount = 0

    // Send emails with rate limiting (1 per second to respect EmailJS limits)
    for (const user of users) {
      try {
        const email = user.email
        if (!email) {
          console.log(`User ${user.id} has no email, skipping`)
          continue
        }
        const requestBody: any = {
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            toemail: email,
            fromname: 'Knot',
            subject: 'Knot has ceased operations',
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
          results.push({ email: user.email, status: 'sent' })
          successCount++
          console.log(`Email sent to ${user.email}`)
        } else {
          results.push({ email: user.email, status: 'failed', error: response.statusText })
          failureCount++
          console.error(`Failed to send email to ${user.email}: ${response.statusText}`)
        }

        // Wait 1 second between emails to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        results.push({ email: user.email, status: 'failed', error: error.message })
        failureCount++
        console.error(`Error sending email to ${user.email}:`, error)
      }
    }

    return new Response(JSON.stringify({
      total: users.length,
      success: successCount,
      failure: failureCount,
      results
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in send-ceased-email function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function generateCeasedEmailHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Knot has ceased operations</title>
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
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #C4432A; background: rgba(196, 67, 42, 0.08); border: 1px solid rgba(196, 67, 42, 0.2); padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #C4432A; display: inline-block; }
  h1 { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 5vw, 44px); line-height: 1.1; margin: 0 0 16px 0; font-weight: 400; letter-spacing: -0.01em; }
  h1 em { font-style: italic; color: #C4432A; }
  p { color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 28px 0; }
  .info-box { background: #F7F8FB; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 12px; padding: 20px; margin: 24px 0; }
  .info-box ul { margin: 0; padding-left: 20px; color: #5B6472; font-size: 14px; line-height: 1.7; }
  .info-box li { margin-bottom: 8px; }
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
            <div class="eyebrow"><span class="dot"></span>Important Notice</div>
            <h1><em>Knot</em> has ceased operations</h1>
            <p>We regret to inform you that Knot has permanently ceased operations. Thank you for being part of our community.</p>
            
            <div class="info-box">
              <ul>
                <li>All user data has been permanently deleted in accordance with our privacy policy</li>
                <li>No new accounts can be created</li>
                <li>Existing accounts cannot be accessed or recovered</li>
                <li>All features and services have been discontinued</li>
              </ul>
            </div>
            
            <p>If you have any questions or concerns, please contact us at <a href="mailto:jamestheakston2@gmail.com">jamestheakston2@gmail.com</a></p>
          </div>
          <div class="footer">
            <p>You received this email because you were a member of Knot.</p>
            <p style="margin-top: 8px;">© 2026 Knot.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

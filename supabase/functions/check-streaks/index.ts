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

    // Get all habits with their pod information
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, pod_id, frequency, pods(id, name)')

    if (habitsError) throw habitsError
    if (!habits || habits.length === 0) {
      return new Response(JSON.stringify({ message: 'No habits found' }), { status: 200 })
    }

    const results = []

    for (const habit of habits) {
      const pod = habit.pods
      if (!pod) continue
      
      const podId = pod.id
      const podName = pod.name
      const frequency = habit.frequency
      // Get all members of this pod
      const { data: members, error: membersError } = await supabase
        .from('pod_members')
        .select('user_id, role')
        .eq('pod_id', podId)

      if (membersError) continue
      if (!members || members.length === 0) continue

      const userIds = members.map(m => m.user_id)

      // Get user emails and their auth metadata
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('user_id, email, display_name')
        .in('user_id', userIds)

      if (usersError) continue
      if (!users || users.length === 0) continue

      // Get user auth metadata to check email preferences
      const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers()
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError)
        continue
      }

      // Create a map of user_id to their auth metadata
      const userMetadataMap = new Map()
      if (authUsers && authUsers.users) {
        for (const authUser of authUsers.users) {
          userMetadataMap.set(authUser.id, authUser.user_metadata || {})
        }
      }

      // Calculate the date range to check based on habit frequency
      const today = new Date()
      const daysToCheck = getDaysToCheck(frequency)
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - daysToCheck)

      // Check for check-ins in the date range
      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .select('user_id, date')
        .eq('pod_id', podId)
        .gte('date', checkDate.toISOString().split('T')[0])

      if (checkInsError) continue

      // Determine which users have checked in
      const usersWhoCheckedIn = new Set(checkIns?.map(ci => ci.user_id) || [])

      // Find users who missed
      const usersWhoMissed = users.filter(u => !usersWhoCheckedIn.has(u.user_id))

      // Calculate how many days the pod has been missing
      const podDayMissCount = await calculatePodMissCount(supabase, podId, frequency)

      // Send emails based on conditions
      if (usersWhoMissed.length > 0 && usersWhoMissed.length < users.length) {
        // Some users missed, but not all - send streak broken email to those who missed
        for (const user of usersWhoMissed) {
          // Check if user has opted out of pod activity emails
          const userMetadata = userMetadataMap.get(user.user_id) || {}
          if (userMetadata.pod_activity_opt_out === true) {
            console.log(`Skipping email to ${user.email} - user opted out of pod activity emails`)
            continue
          }
          
          await sendStreakBrokenEmail(user.email, podName, podDayMissCount)
          results.push({
            type: 'streak_broken',
            pod: podName,
            user: user.email,
            daysMissed: podDayMissCount
          })
        }
      } else if (usersWhoMissed.length === users.length && usersWhoMissed.length > 0) {
        // Everyone missed - send everyone missed email to all users
        for (const user of users) {
          // Check if user has opted out of pod activity emails
          const userMetadata = userMetadataMap.get(user.user_id) || {}
          if (userMetadata.pod_activity_opt_out === true) {
            console.log(`Skipping email to ${user.email} - user opted out of pod activity emails`)
            continue
          }
          
          await sendEveryoneMissedEmail(user.email, podName, podDayMissCount)
          results.push({
            type: 'everyone_missed',
            pod: podName,
            user: user.email,
            daysMissed: podDayMissCount
          })
        }
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Streak check completed',
      results: results 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in check-streaks function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function getDaysToCheck(frequency: string): number {
  switch (frequency) {
    case 'daily': return 1
    case 'weekly': return 7
    case 'biweekly': return 14
    default: return 1
  }
}

async function calculatePodMissCount(supabase: any, podId: string, frequency: string): Promise<number> {
  const daysToCheck = getDaysToCheck(frequency)
  const today = new Date()
  const checkDate = new Date(today)
  checkDate.setDate(checkDate.getDate() - daysToCheck * 30) // Check up to 30 periods back

  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('date')
    .eq('pod_id', podId)
    .gte('date', checkDate.toISOString().split('T')[0])

  if (!checkIns || checkIns.length === 0) {
    return daysToCheck * 30 // Max count
  }

  // Calculate actual miss count based on frequency
  const uniqueDates = new Set(checkIns.map(ci => ci.date))
  const expectedCheckIns = daysToCheck * 30
  return Math.max(0, expectedCheckIns - uniqueDates.size)
}

async function sendStreakBrokenEmail(email: string, podName: string, podDayMissCount: number): Promise<void> {
  const emailContent = generateStreakBrokenEmailHTML(podName, podDayMissCount)
  
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
        subject: 'You broke the streak',
        email_content: emailContent
      }
    })
  })

  if (!response.ok) {
    console.error('Failed to send streak broken email to', email)
  }
}

async function sendEveryoneMissedEmail(email: string, podName: string, podDayMissCount: number): Promise<void> {
  const emailContent = generateEveryoneMissedEmailHTML(podName, podDayMissCount)
  
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
        subject: 'Pod inactivity notice',
        email_content: emailContent
      }
    })
  })

  if (!response.ok) {
    console.error('Failed to send everyone missed email to', email)
  }
}

function generateStreakBrokenEmailHTML(podName: string, podDayMissCount: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Knot — Pod Check-In Reminder</title>
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
  .pod-card { background: #EEF1F6; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 16px; padding: 20px; margin-bottom: 32px; }
  .member-row { display: flex; align-items: center; gap: 12px; background: #FFFFFF; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 10px; padding: 12px 14px; }
  .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; flex-shrink: 0; }
  .name { font-size: 14px; flex: 1; font-weight: 500; color: #151922; }
  .status { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 3px 9px; border-radius: 100px; }
  .status.missed { background: rgba(196, 67, 42, 0.12); color: #C4432A; }
  .btn-primary { display: inline-flex; align-items: center; justify-content: center; background: #2A4BD7; color: #FFFFFF; padding: 13px 24px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; font-family: 'Work Sans', sans-serif; }
  .footer { border-top: 1px solid rgba(21, 25, 34, 0.10); padding: 28px 36px; background-color: #F7F8FB; text-align: left; }
  .footer p { color: #8890A0; font-size: 13px; margin: 0; }
  .footer a { color: #5B6472; text-decoration: none; }
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
            <span class="eyebrow"><span class="dot"></span>Streak destroyed</span>
            <h1>You broke the <em>streak</em>.</h1>
            <p>Everyone else in "${podName}" showed up and did their part. You are the sole reason the pod's hard-earned record is shattered. They are looking at the board right now, waiting on your silence.</p>
            <div class="pod-card">
              <div class="member-row">
                <div class="avatar" style="background:#C4432A;color:#fff;">Y</div>
                <div class="name">You</div>
                <div class="status missed">missed ${podDayMissCount} days</div>
              </div>
            </div>
            <div style="text-align: center;">
              <a href="https://knotapp.pages.dev/dashboard.html" class="btn-primary">Face your pod</a>
            </div>
          </div>
          <div class="footer">
            <p>You received this email because you're part of a pod on Knot.</p>
            <p style="margin-top: 8px;">© 2026 Knot.</p>
            <p style="margin-top: 8px; font-size: 12px;">Don't like these emails? <a href="https://knotapp.pages.dev/account/email/manage.html" style="color: #2A4BD7; text-decoration: underline;">Unsubscribe from them</a></p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

function generateEveryoneMissedEmailHTML(podName: string, podDayMissCount: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Knot — Pod Inactivity Notice</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background-color: #F7F8FB; color: #151922; font-family: 'Work Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  table { border-collapse: collapse; width: 100%; }
  .email-wrapper { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 20px; overflow: hidden; }
  .header { padding: 28px 36px; text-align: left; border-bottom: 1px solid rgba(21, 25, 34, 0.10); }
  .logo { font-family: 'Instrument Serif', serif; font-size: 24px; color: #151922; font-weight: 400; }
  .content { padding: 44px 36px; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #8890A0; background: rgba(21, 25, 34, 0.06); border: 1px solid rgba(21, 25, 34, 0.12); padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #8890A0; display: inline-block; }
  h1 { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 5vw, 44px); line-height: 1.1; margin: 0 0 16px 0; font-weight: 400; letter-spacing: -0.01em; }
  h1 em { font-style: italic; color: #5B6472; }
  p { color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 28px 0; }
  .pod-card { background: #EEF1F6; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 16px; padding: 20px; margin-bottom: 32px; }
  .member-row { display: flex; align-items: center; gap: 12px; background: #FFFFFF; border: 1px solid rgba(21, 25, 34, 0.10); border-radius: 10px; padding: 12px 14px; }
  .name { font-size: 14px; flex: 1; font-weight: 500; color: #151922; }
  .status { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 3px 9px; border-radius: 100px; background: rgba(21, 25, 34, 0.06); color: #5B6472; }
  .footer { border-top: 1px solid rgba(21, 25, 34, 0.10); padding: 28px 36px; background-color: #F7F8FB; text-align: left; }
  .footer p { color: #8890A0; font-size: 13px; margin: 0; }
</style>
</head>
<body>
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="email-wrapper">
          <div class="header">
            <div class="logo">Knot</div>
          </div>
          <div class="content">
            <span class="eyebrow"><span class="dot"></span>Silence across the board</span>
            <h1>Everybody gave up <em>together</em>.</h1>
            <p>Not a single person in "${podName}" has checked in for ${podDayMissCount} days. The entire pod went completely dark. Is anyone actually going to break the silence, or are you all just waiting for someone else to care?</p>
            <div class="pod-card">
              <div class="member-row">
                <div class="name">Entire Pod</div>
                <div class="status">silent for ${podDayMissCount} days</div>
              </div>
            </div>
            <p style="font-weight: 500; color: #151922; margin-top: 12px;">You need to log back into Knot to check on your pod.</p>
          </div>
          <div class="footer">
            <p>You received this email because you're part of a pod on Knot.</p>
            <p style="margin-top: 8px;">© 2026 Knot.</p>
            <p style="margin-top: 8px; font-size: 12px;">Don't like these emails? <a href="https://knotapp.pages.dev/account/email/manage.html" style="color: #2A4BD7; text-decoration: underline;">Unsubscribe from them</a></p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { toEmail, podName, inviteCode, inviterName } = await request.json();

    if (!toEmail || !toEmail.includes('@') || !podName || !inviteCode) {
      return new Response(JSON.stringify({ error: 'Invalid input fields' }), { status: 400 });
    }

    const EMAILJS_SERVICE_ID = env.EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = env.EMAILJS_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY = env.EMAILJS_PUBLIC_KEY;

    // Generate invite email HTML
    const inviteHTML = `
      <div style="background: #F7F8FB; padding: 40px 20px; font-family: 'Work Sans', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="background: #2A4BD7; padding: 32px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-family: 'Instrument Serif', serif; font-size: 32px;">Knot</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">You're invited to join a pod</p>
          </div>
          <div style="padding: 40px 32px;">
            <p style="color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              ${inviterName ? `${inviterName} has invited you to join` : 'You\'ve been invited to join'} the pod <strong style="color: #151922;">${podName}</strong>.
            </p>
            <p style="color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
              Knot is about social accountability — small groups of people who notice when you're not there. Your pod will have up to 5 members, and you'll all track a shared streak together.
            </p>
            <div style="background: #EEF1F6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <p style="color: #8890A0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Your invite code</p>
              <p style="color: #151922; font-size: 32px; font-weight: 600; margin: 0; letter-spacing: 0.1em;">${inviteCode}</p>
            </div>
            <a href="https://jamestheakston.pages.dev/knot/" style="display: inline-block; background: #2A4BD7; color: #FFFFFF; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Join the pod
            </a>
          </div>
          <div style="background: #EEF1F6; padding: 24px 32px; text-align: center;">
            <p style="color: #8890A0; font-size: 13px; margin: 0;">
              A habit is easier to keep than a promise, when both are shared.
            </p>
          </div>
        </div>
      </div>
    `;

    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: toEmail,
          email_content: inviteHTML
        }
      })
    });

    if (!emailjsResponse.ok) {
      const errorText = await emailjsResponse.text();
      return new Response(JSON.stringify({ error: 'Failed to send invite email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

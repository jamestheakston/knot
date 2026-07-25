// Email Templates and Functions for Knot

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'uF5gBRgWvS-o3wTjZ';
const EMAILJS_SERVICE_ID = 'service_yn3gq3m';
const EMAILJS_TEMPLATE_ID = 'template_7xm80oj';

// Initialize EmailJS
function initEmailJS(){
  if(typeof emailjs !== 'undefined'){
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
}

// Generate invite email HTML
function generateInviteEmailHTML(podName, inviteCode, inviterName){
  return `
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
}

// Generate login notification email HTML
function generateLoginEmailHTML(email, loginTime){
  var timeStr = loginTime.toLocaleString();
  return `
  <div style="background: #F7F8FB; padding: 40px 20px; font-family: 'Work Sans', sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div style="background: #2A4BD7; padding: 32px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-family: 'Instrument Serif', serif; font-size: 32px;">Knot</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">New login detected</p>
      </div>
      <div style="padding: 40px 32px;">
        <p style="color: #5B6472; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
          We detected a new login to your Knot account.
        </p>
        <div style="background: #EEF1F6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <p style="color: #8890A0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Email</p>
          <p style="color: #151922; font-size: 16px; font-weight: 500; margin: 0 0 16px;">${email}</p>
          <p style="color: #8890A0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Time</p>
          <p style="color: #151922; font-size: 16px; font-weight: 500; margin: 0;">${timeStr}</p>
        </div>
        <p style="color: #5B6472; font-size: 14px; line-height: 1.6; margin: 0;">
          If this was you, no action is needed. If you didn't sign in to Knot, please secure your account immediately.
        </p>
      </div>
      <div style="background: #EEF1F6; padding: 24px 32px; text-align: center;">
        <p style="color: #8890A0; font-size: 13px; margin: 0;">
          A habit is easier to keep than a promise, when both are shared.
        </p>
      </div>
    </div>
  </div>
  `;
}

// Send invite email
async function sendInviteEmail(toEmail, podName, inviteCode, inviterName){
  try{
    initEmailJS();
    
    var emailContent = generateInviteEmailHTML(podName, inviteCode, inviterName);
    
    var templateParams = {
      to_email: toEmail,
      from_name: 'Knot Invitations',
      subject: "You're invited to join a Knot pod",
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    return { success: true };
  }catch(err){
    console.error('Error sending invite email:', err);
    return { success: false, error: err.message };
  }
}

// Send login notification email
async function sendLoginNotification(email){
  try{
    initEmailJS();
    
    var loginTime = new Date();
    var emailContent = generateLoginEmailHTML(email, loginTime);
    
    var templateParams = {
      to_email: email,
      from_name: 'Knot Security',
      subject: 'New login to your Knot account',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  }catch(err){
    console.error('Error sending login notification:', err);
    // Don't alert user for login notifications - silently fail
  }
}

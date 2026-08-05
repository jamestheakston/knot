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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You're invited to join a Knot pod</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F7F8FB; font-family: 'Work Sans', Helvetica, Arial, sans-serif; color: #151922; }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(21, 25, 34, 0.08);
      box-shadow: 0 10px 30px rgba(21, 25, 34, 0.03);
    }
    .header {
      padding: 40px 40px 28px;
      text-align: center;
      border-bottom: 1px solid rgba(21, 25, 34, 0.06);
      background: linear-gradient(135deg, #2A4BD7 0%, #1B37AE 100%);
    }
    .logo-text {
      font-family: Georgia, serif;
      font-size: 32px;
      color: #FFFFFF;
      font-weight: normal;
      text-decoration: none;
      letter-spacing: -0.01em;
    }
    .header-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.9);
      margin-top: 8px;
    }
    .content {
      padding: 48px 40px;
    }
    .eyebrow {
      font-family: monospace;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #1B37AE;
      background: #EAEFFF;
      border: 1px solid rgba(42, 75, 215, 0.15);
      padding: 6px 14px;
      border-radius: 100px;
      display: inline-block;
      margin-bottom: 24px;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 34px;
      font-weight: normal;
      line-height: 1.15;
      margin: 0 0 18px 0;
      color: #151922;
    }
    h1 em {
      font-style: italic;
      color: #2A4BD7;
    }
    p {
      font-size: 16px;
      line-height: 1.65;
      color: #5B6472;
      margin: 0 0 24px 0;
    }
    .instruction-box {
      background: #F7F8FB;
      border: 1px solid rgba(21, 25, 34, 0.06);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .code-box {
      background: linear-gradient(135deg, #EEF1F6 0%, #E6EAF2 100%);
      border: 1px dashed rgba(42, 75, 215, 0.3);
      border-radius: 14px;
      padding: 28px;
      text-align: center;
      margin: 32px 0;
    }
    .code-label {
      font-size: 12.5px;
      font-weight: 500;
      color: #5B6472;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }
    .code-value {
      font-family: monospace;
      font-size: 32px;
      letter-spacing: 0.18em;
      color: #2A4BD7;
      font-weight: bold;
    }
    .btn-primary {
      background-color: #2A4BD7;
      border-radius: 10px;
      color: #FFFFFF;
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      text-decoration: none;
      padding: 16px 32px;
      -webkit-text-size-adjust: none;
      box-shadow: 0 4px 14px rgba(42, 75, 215, 0.25);
    }
    .btn-primary:hover {
      background-color: #1B37AE;
    }
    .footer {
      padding: 28px 40px 36px;
      text-align: center;
      background-color: #F7F8FB;
      border-top: 1px solid rgba(21, 25, 34, 0.06);
    }
    .footer p {
      font-size: 13px;
      color: #8890A0;
      margin: 0;
    }

    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0 !important;
        border: none !important;
      }
      .content {
        padding: 32px 20px !important;
      }
      .header {
        padding: 32px 20px 20px !important;
      }
      .footer {
        padding: 24px 20px 28px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #F7F8FB;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F8FB;">
    <tr>
      <td align="center" style="padding: 0 16px;">
        
        <!-- Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" width="600" style="background-color: #FFFFFF; border-radius: 20px;">
          
          <!-- Header -->
          <tr>
            <td class="header" style="padding: 40px 40px 28px; text-align: center; border-bottom: 1px solid rgba(21, 25, 34, 0.06); background: linear-gradient(135deg, #2A4BD7 0%, #1B37AE 100%);">
              <div class="logo-text" style="font-family: Georgia, serif; font-size: 32px; color: #FFFFFF; font-weight: normal; text-decoration: none;">Knot</div>
              <div class="header-subtitle" style="font-size: 15px; color: rgba(255,255,255,0.9); margin-top: 8px;">You're invited to join a pod</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 48px 40px;">
              <span class="eyebrow" style="font-family: monospace; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #1B37AE; background: #EAEFFF; padding: 6px 14px; border-radius: 100px; display: inline-block; margin-bottom: 24px;">Pod Invitation</span>
              
              <h1 style="font-family: Georgia, serif; font-size: 34px; font-weight: normal; line-height: 1.15; margin: 0 0 18px 0; color: #151922;">
                You've been invited to hold a <em>habit together.</em>
              </h1>
              
              <p style="font-size: 16px; line-height: 1.65; color: #5B6472; margin: 0 0 24px 0;">
                ${inviterName ? inviterName + ' has' : 'Someone'} invited you to join the pod <strong style="color: #151922;">${podName}</strong> on Knot. A habit holds when someone else is watching—and your pod is waiting to get started.
              </p>

              <!-- Instructions on how to join -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="instruction-box" style="background: #F7F8FB; border: 1px solid rgba(21, 25, 34, 0.06); border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.65; color: #5B6472;">
                    <strong>How to join:</strong> Go to the website, click <strong style="color: #151922;">"Start a pod — free"</strong>, and then select <strong style="color: #151922;">"Join a pod"</strong> to enter your invite code below.
                  </td>
                </tr>
              </table>

              <!-- Invite Code Display Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="code-box" style="background: #EEF1F6; border: 1px dashed rgba(42, 75, 215, 0.3); border-radius: 14px; padding: 28px; text-align: center;">
                    <div class="code-label" style="font-size: 12.5px; font-weight: 500; color: #5B6472; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Your invite code</div>
                    <div class="code-value" style="font-family: monospace; font-size: 32px; letter-spacing: 0.18em; color: #2A4BD7; font-weight: bold;">${inviteCode}</div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 16px; line-height: 1.65; color: #5B6472; margin: 24px 0 32px 0; text-align: center;">
                Click below to drop into Knot and join the streak.
              </p>

              <!-- Button CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#2A4BD7" style="border-radius: 10px;">
                          <a href="https://jamestheakston.pages.dev/knot/" class="btn-primary" target="_blank" style="background-color: #2A4BD7; border-radius: 10px; color: #FFFFFF; display: inline-block; font-size: 16px; font-weight: 500; text-align: center; text-decoration: none; padding: 16px 32px;">Join the pod</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="padding: 28px 40px 36px; text-align: center; background-color: #F7F8FB; border-top: 1px solid rgba(21, 25, 34, 0.06);">
              <p style="font-size: 13px; color: #8890A0; margin: 0;">
                © 2026 Knot. A habit is easier to keep than a promise, when both are shared.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

// Generate login notification email HTML
function generateLoginEmailHTML(email, loginTime){
  var timeStr = loginTime.toLocaleString();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New login to your Knot account</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F7F8FB; font-family: 'Work Sans', Helvetica, Arial, sans-serif; color: #151922; }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(21, 25, 34, 0.08);
      box-shadow: 0 10px 30px rgba(21, 25, 34, 0.03);
    }
    .header {
      padding: 40px 40px 28px;
      text-align: center;
      border-bottom: 1px solid rgba(21, 25, 34, 0.06);
      background: linear-gradient(135deg, #C4432A 0%, #A33822 100%);
    }
    .logo-text {
      font-family: Georgia, serif;
      font-size: 32px;
      color: #FFFFFF;
      font-weight: normal;
      text-decoration: none;
      letter-spacing: -0.01em;
    }
    .header-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.9);
      margin-top: 8px;
    }
    .content {
      padding: 48px 40px;
    }
    .eyebrow {
      font-family: monospace;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #C4432A;
      background: #FFF0ED;
      border: 1px solid rgba(196, 67, 42, 0.15);
      padding: 6px 14px;
      border-radius: 100px;
      display: inline-block;
      margin-bottom: 24px;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 34px;
      font-weight: normal;
      line-height: 1.15;
      margin: 0 0 18px 0;
      color: #151922;
    }
    p {
      font-size: 16px;
      line-height: 1.65;
      color: #5B6472;
      margin: 0 0 24px 0;
    }
    .info-box {
      background: #F7F8FB;
      border: 1px solid rgba(21, 25, 34, 0.06);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .info-row {
      margin-bottom: 16px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-size: 12.5px;
      font-weight: 500;
      color: #8890A0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .info-value {
      font-size: 16px;
      color: #151922;
      font-weight: 500;
    }
    .alert-box {
      background: #FFF0ED;
      border: 1px solid rgba(196, 67, 42, 0.2);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
    }
    .alert-box p {
      font-size: 15px;
      color: #C4432A;
      margin: 0;
    }
    .footer {
      padding: 28px 40px 36px;
      text-align: center;
      background-color: #F7F8FB;
      border-top: 1px solid rgba(21, 25, 34, 0.06);
    }
    .footer p {
      font-size: 13px;
      color: #8890A0;
      margin: 0;
    }

    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0 !important;
        border: none !important;
      }
      .content {
        padding: 32px 20px !important;
      }
      .header {
        padding: 32px 20px 20px !important;
      }
      .footer {
        padding: 24px 20px 28px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #F7F8FB;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F8FB;">
    <tr>
      <td align="center" style="padding: 0 16px;">
        
        <!-- Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" width="600" style="background-color: #FFFFFF; border-radius: 20px;">
          
          <!-- Header -->
          <tr>
            <td class="header" style="padding: 40px 40px 28px; text-align: center; border-bottom: 1px solid rgba(21, 25, 34, 0.06); background: linear-gradient(135deg, #C4432A 0%, #A33822 100%);">
              <div class="logo-text" style="font-family: Georgia, serif; font-size: 32px; color: #FFFFFF; font-weight: normal; text-decoration: none;">Knot</div>
              <div class="header-subtitle" style="font-size: 15px; color: rgba(255,255,255,0.9); margin-top: 8px;">New login detected</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 48px 40px;">
              <span class="eyebrow" style="font-family: monospace; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #C4432A; background: #FFF0ED; padding: 6px 14px; border-radius: 100px; display: inline-block; margin-bottom: 24px;">Security Alert</span>
              
              <h1 style="font-family: Georgia, serif; font-size: 34px; font-weight: normal; line-height: 1.15; margin: 0 0 18px 0; color: #151922;">
                We detected a new login to your account
              </h1>
              
              <p style="font-size: 16px; line-height: 1.65; color: #5B6472; margin: 0 0 24px 0;">
                We're letting you know about this login for your security. If this was you, no action is needed.
              </p>

              <!-- Login Details Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="info-box" style="background: #F7F8FB; border: 1px solid rgba(21, 25, 34, 0.06); border-radius: 12px; padding: 24px;">
                    <div class="info-row" style="margin-bottom: 16px;">
                      <div class="info-label" style="font-size: 12.5px; font-weight: 500; color: #8890A0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Email</div>
                      <div class="info-value" style="font-size: 16px; color: #151922; font-weight: 500;">${email}</div>
                    </div>
                    <div class="info-row" style="margin-bottom: 0;">
                      <div class="info-label" style="font-size: 12.5px; font-weight: 500; color: #8890A0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Time</div>
                      <div class="info-value" style="font-size: 16px; color: #151922; font-weight: 500;">${timeStr}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Alert Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="alert-box" style="background: #FFF0ED; border: 1px solid rgba(196, 67, 42, 0.2); border-radius: 12px; padding: 20px;">
                    <p style="font-size: 15px; line-height: 1.65; color: #C4432A; margin: 0;">
                      <strong>If you didn't sign in to Knot</strong>, please secure your account immediately by changing your password.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="padding: 28px 40px 36px; text-align: center; background-color: #F7F8FB; border-top: 1px solid rgba(21, 25, 34, 0.06);">
              <p style="font-size: 13px; color: #8890A0; margin: 0;">
                © 2026 Knot. A habit is easier to keep than a promise, when both are shared.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

// Generate pod deletion email HTML
function generatePodDeletionEmailHTML(podName, deletedBy, deletionTime){
  var timeStr = deletionTime.toLocaleString();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Pod deleted on Knot</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F7F8FB; font-family: 'Work Sans', Helvetica, Arial, sans-serif; color: #151922; }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(21, 25, 34, 0.08);
      box-shadow: 0 10px 30px rgba(21, 25, 34, 0.03);
    }
    .header {
      padding: 40px 40px 28px;
      text-align: center;
      border-bottom: 1px solid rgba(21, 25, 34, 0.06);
      background: linear-gradient(135deg, #8890A0 0%, #5B6472 100%);
    }
    .logo-text {
      font-family: Georgia, serif;
      font-size: 32px;
      color: #FFFFFF;
      font-weight: normal;
      text-decoration: none;
      letter-spacing: -0.01em;
    }
    .header-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.9);
      margin-top: 8px;
    }
    .content {
      padding: 48px 40px;
    }
    .eyebrow {
      font-family: monospace;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #5B6472;
      background: #EEF1F6;
      border: 1px solid rgba(91, 100, 114, 0.15);
      padding: 6px 14px;
      border-radius: 100px;
      display: inline-block;
      margin-bottom: 24px;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 34px;
      font-weight: normal;
      line-height: 1.15;
      margin: 0 0 18px 0;
      color: #151922;
    }
    p {
      font-size: 16px;
      line-height: 1.65;
      color: #5B6472;
      margin: 0 0 24px 0;
    }
    .info-box {
      background: #F7F8FB;
      border: 1px solid rgba(21, 25, 34, 0.06);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .info-row {
      margin-bottom: 16px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-size: 12.5px;
      font-weight: 500;
      color: #8890A0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .info-value {
      font-size: 16px;
      color: #151922;
      font-weight: 500;
    }
    .footer {
      padding: 28px 40px 36px;
      text-align: center;
      background-color: #F7F8FB;
      border-top: 1px solid rgba(21, 25, 34, 0.06);
    }
    .footer p {
      font-size: 13px;
      color: #8890A0;
      margin: 0;
    }

    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0 !important;
        border: none !important;
      }
      .content {
        padding: 32px 20px !important;
      }
      .header {
        padding: 32px 20px 20px !important;
      }
      .footer {
        padding: 24px 20px 28px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #F7F8FB;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F8FB;">
    <tr>
      <td align="center" style="padding: 0 16px;">
        
        <!-- Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" width="600" style="background-color: #FFFFFF; border-radius: 20px;">
          
          <!-- Header -->
          <tr>
            <td class="header" style="padding: 40px 40px 28px; text-align: center; border-bottom: 1px solid rgba(21, 25, 34, 0.06); background: linear-gradient(135deg, #8890A0 0%, #5B6472 100%);">
              <div class="logo-text" style="font-family: Georgia, serif; font-size: 32px; color: #FFFFFF; font-weight: normal; text-decoration: none;">Knot</div>
              <div class="header-subtitle" style="font-size: 15px; color: rgba(255,255,255,0.9); margin-top: 8px;">Pod deleted</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 48px 40px;">
              <span class="eyebrow" style="font-family: monospace; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B6472; background: #EEF1F6; padding: 6px 14px; border-radius: 100px; display: inline-block; margin-bottom: 24px;">Pod Notification</span>
              
              <h1 style="font-family: Georgia, serif; font-size: 34px; font-weight: normal; line-height: 1.15; margin: 0 0 18px 0; color: #151922;">
                Your pod <em>"${podName}"</em> has been deleted
              </h1>
              
              <p style="font-size: 16px; line-height: 1.65; color: #5B6472; margin: 0 0 24px 0;">
                This pod has been removed from Knot. All associated data, including check-ins and streaks, has been permanently deleted.
              </p>

              <!-- Deletion Details Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="info-box" style="background: #F7F8FB; border: 1px solid rgba(21, 25, 34, 0.06); border-radius: 12px; padding: 24px;">
                    <div class="info-row" style="margin-bottom: 16px;">
                      <div class="info-label" style="font-size: 12.5px; font-weight: 500; color: #8890A0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Pod Name</div>
                      <div class="info-value" style="font-size: 16px; color: #151922; font-weight: 500;">${podName}</div>
                    </div>
                    <div class="info-row" style="margin-bottom: 16px;">
                      <div class="info-label" style="font-size: 12.5px; font-weight: 500; color: #8890A0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Deleted by</div>
                      <div class="info-value" style="font-size: 16px; color: #151922; font-weight: 500;">${deletedBy}</div>
                    </div>
                    <div class="info-row" style="margin-bottom: 0;">
                      <div class="info-label" style="font-size: 12.5px; font-weight: 500; color: #8890A0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Time</div>
                      <div class="info-value" style="font-size: 16px; color: #151922; font-weight: 500;">${timeStr}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 16px; line-height: 1.65; color: #5B6472; margin: 0;">
                If you have any questions about this deletion, please contact the pod administrator.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="padding: 28px 40px 36px; text-align: center; background-color: #F7F8FB; border-top: 1px solid rgba(21, 25, 34, 0.06);">
              <p style="font-size: 13px; color: #8890A0; margin: 0;">
                © 2026 Knot. A habit is easier to keep than a promise, when both are shared.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

// Send pod deletion notification email
async function sendPodDeletionEmail(toEmail, podName, deletedBy, userId){
  try{
    initEmailJS();
    
    var deletionTime = new Date();
    var emailContent = generatePodDeletionEmailHTML(podName, deletedBy, deletionTime);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot',
      subject: 'Pod deleted on Knot',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification
    if(userId){
      await createNotification(userId, 'pod', 'Pod Deleted', 'The pod "' + podName + '" has been deleted by ' + deletedBy, { podName: podName, deletedBy: deletedBy }, 'Knot');
    }
  }catch(err){
    console.error('Error sending pod deletion notification:', err);
    // Don't alert user for deletion notifications - silently fail
  }
}
async function sendInviteEmail(toEmail, podName, inviteCode, inviterName, senderUserId){
  try{
    initEmailJS();
    
    var emailContent = generateInviteEmailHTML(podName, inviteCode, inviterName);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot',
      subject: "You're invited to join a Knot pod",
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification for the sender
    if(senderUserId){
      await createNotification(senderUserId, 'invite', 'Invite Sent', 'You have invited ' + toEmail + ' to join the pod "' + podName + '"', { podName: podName, inviteCode: inviteCode, toEmail: toEmail }, 'Knot');
    }
    
    return { success: true };
  }catch(err){
    console.error('Error sending invite email:', err);
    return { success: false, error: err.message };
  }
}

// Send login notification email
async function sendLoginNotification(email, userId){
  try{
    // Check if we should send email based on 15-minute cooldown
    var cooldownKey = 'login_notification_' + email;
    var lastSentTime = localStorage.getItem(cooldownKey);
    var cooldownPeriod = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    var now = Date.now();
    
    if (lastSentTime) {
      var timeSinceLastSend = now - parseInt(lastSentTime);
      if (timeSinceLastSend < cooldownPeriod) {
        console.log('Login notification skipped - cooldown period not elapsed');
        return; // Skip sending email
      }
    }
    
    initEmailJS();
    
    var loginTime = new Date();
    var emailContent = generateLoginEmailHTML(email, loginTime);
    
    var templateParams = {
      toemail: email,
      fromname: 'Knot Security',
      subject: 'New login to your Knot account',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Store the timestamp of this email send
    localStorage.setItem(cooldownKey, now.toString());
    
    // Create notification
    if(userId){
      await createNotification(userId, 'account', 'New Login', 'A new login was detected for your account at ' + loginTime.toLocaleString(), { loginTime: loginTime }, 'Knot');
    }
  }catch(err){
    console.error('Error sending login notification:', err);
    // Don't alert user for login notifications - silently fail
  }
}

// Generate account deletion verification email
function generateAccountDeletionVerificationHTML(name, code, email){
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knot Account Deletion</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #1c1e21;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .logo-container {
            margin-bottom: 24px;
        }
        .logo-text {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #000000;
        }
        hr {
            border: none;
            border-top: 1px solid #e4e6eb;
            margin: 20px 0;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            margin: 16px 0;
            color: #1c1e21;
        }
        .code-label {
            font-size: 16px;
            color: #1c1e21;
            margin-top: 24px;
            margin-bottom: 8px;
        }
        .code-box {
            background-color: #f0f2f5;
            border: 1px solid #ced0d4;
            border-radius: 6px;
            padding: 14px 16px;
            font-size: 26px;
            font-weight: 400;
            letter-spacing: 6px;
            color: #1c1e21;
            display: inline-block;
            margin-bottom: 16px;
        }
        .footer-text {
            font-size: 12px;
            color: #65676b;
            line-height: 1.4;
            margin-top: 32px;
        }
        .footer-text a {
            color: #0064e0;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo-container">
            <span class="logo-text">Knot</span>
        </div>
        
        <hr>

        <p>Hi ${name},</p>

        <p>We're sorry to see you go.</p>

        <p>You can delete your Knot account by entering the following code.</p>

        <div class="code-label">Deletion code</div>
        <div class="code-box">${code}</div>

        <p>This code expires in 10 minutes. Once your account is deleted, it is recoverable for up to 24 hours, and you will receive an email with a unique recovery link.</p>

        <p>If you did not request to delete your account, you can disregard this message.</p>

        <hr>

        <div class="footer-text">
            This message was sent to <a href="mailto:${email}">${email}</a> at your request.
        </div>
    </div>
</body>
</html>
  `;
}

// Generate account recovery email
function generateAccountRecoveryEmail(email, recoveryLink, expiryDate){
  return `
Hi there,

Your Knot account has been deleted. If you change your mind, you can recover it until ${expiryDate}.

Here's your recovery link: ${recoveryLink}

This link expires in 24 hours.

Knot
  `;
}

// Generate streak broken email (when user breaks the group streak)
function generateStreakBrokenEmailHTML(podName, podDayMissCount){
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
  body {
    margin: 0;
    padding: 0;
    background-color: #F7F8FB;
    color: #151922;
    font-family: 'Work Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 40px auto;
    background-color: #FFFFFF;
    border: 1px solid rgba(21, 25, 34, 0.10);
    border-radius: 20px;
    overflow: hidden;
  }
  .header {
    padding: 28px 36px;
    text-align: left;
    border-bottom: 1px solid rgba(21, 25, 34, 0.10);
  }
  .logo {
    font-family: 'Instrument Serif', serif;
    font-size: 24px;
    color: #151922;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    font-weight: 400;
  }
  .content {
    padding: 44px 36px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #C4432A;
    background: rgba(196, 67, 42, 0.08);
    border: 1px solid rgba(196, 67, 42, 0.2);
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 24px;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #C4432A;
    display: inline-block;
  }
  h1 {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(36px, 5vw, 44px);
    line-height: 1.1;
    margin: 0 0 16px 0;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  h1 em {
    font-style: italic;
    color: #C4432A;
  }
  p {
    color: #5B6472;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 28px 0;
  }
  .pod-card {
    background: #EEF1F6;
    border: 1px solid rgba(21, 25, 34, 0.10);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 32px;
  }
  .member-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FFFFFF;
    border: 1px solid rgba(21, 25, 34, 0.10);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
  }
  .name {
    font-size: 14px;
    flex: 1;
    font-weight: 500;
    color: #151922;
  }
  .status {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    padding: 3px 9px;
    border-radius: 100px;
  }
  .status.missed {
    background: rgba(196, 67, 42, 0.12);
    color: #C4432A;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #2A4BD7;
    color: #FFFFFF;
    padding: 13px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    font-family: 'Work Sans', sans-serif;
  }
  .footer {
    border-top: 1px solid rgba(21, 25, 34, 0.10);
    padding: 28px 36px;
    background-color: #F7F8FB;
    text-align: left;
  }
  .footer p {
    color: #8890A0;
    font-size: 13px;
    margin: 0;
  }
  .footer a {
    color: #5B6472;
    text-decoration: none;
  }
  .footer a:hover {
    color: #2A4BD7;
  }
</style>
</head>
<body>
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="email-wrapper">
          
          <div class="header">
            <a href="https://knotapp.pages.dev" class="logo">
              Knot
            </a>
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
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Generate everyone missed email (when entire pod misses)
function generateEveryoneMissedEmailHTML(podName, podDayMissCount){
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
  body {
    margin: 0;
    padding: 0;
    background-color: #F7F8FB;
    color: #151922;
    font-family: 'Work Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 40px auto;
    background-color: #FFFFFF;
    border: 1px solid rgba(21, 25, 34, 0.10);
    border-radius: 20px;
    overflow: hidden;
  }
  .header {
    padding: 28px 36px;
    text-align: left;
    border-bottom: 1px solid rgba(21, 25, 34, 0.10);
  }
  .logo {
    font-family: 'Instrument Serif', serif;
    font-size: 24px;
    color: #151922;
    font-weight: 400;
  }
  .content {
    padding: 44px 36px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8890A0;
    background: rgba(21, 25, 34, 0.06);
    border: 1px solid rgba(21, 25, 34, 0.12);
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 24px;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #8890A0;
    display: inline-block;
  }
  h1 {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(36px, 5vw, 44px);
    line-height: 1.1;
    margin: 0 0 16px 0;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  h1 em {
    font-style: italic;
    color: #5B6472;
  }
  p {
    color: #5B6472;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 28px 0;
  }
  .pod-card {
    background: #EEF1F6;
    border: 1px solid rgba(21, 25, 34, 0.10);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 32px;
  }
  .member-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FFFFFF;
    border: 1px solid rgba(21, 25, 34, 0.10);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .name {
    font-size: 14px;
    flex: 1;
    font-weight: 500;
    color: #151922;
  }
  .status {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    padding: 3px 9px;
    border-radius: 100px;
    background: rgba(21, 25, 34, 0.06);
    color: #5B6472;
  }
  .footer {
    border-top: 1px solid rgba(21, 25, 34, 0.10);
    padding: 28px 36px;
    background-color: #F7F8FB;
    text-align: left;
  }
  .footer p {
    color: #8890A0;
    font-size: 13px;
    margin: 0;
  }
</style>
</head>
<body>
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="email-wrapper">
          
          <div class="header">
            <div class="logo">
              Knot
            </div>
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
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send account deletion verification email
async function sendAccountDeletionVerificationEmail(toEmail, name, verificationCode, userId){
  try{
    initEmailJS();
    
    var emailContent = generateAccountDeletionVerificationHTML(name, verificationCode, toEmail);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot',
      subject: 'Delete your Knot account',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification
    if(userId){
      await createNotification(userId, 'account', 'Account Deletion Requested', 'You requested to delete your Knot account. Please enter the verification code sent to your email.', { email: toEmail }, 'Knot');
    }
    
    return { success: true };
  }catch(err){
    console.error('Error sending account deletion verification email:', err);
    return { success: false, error: err.message };
  }
}

// Send account recovery email
async function sendAccountRecoveryEmail(toEmail, recoveryId, expiryDate, userId){
  try{
    initEmailJS();
    
    // Create recovery link
    var recoveryLink = 'https://knotapp.pages.dev/account/deletion/recover.html?type=account&id=' + recoveryId;
    
    var emailContent = generateAccountRecoveryEmail(toEmail, recoveryLink, expiryDate);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot Security',
      subject: 'Your account has been deleted - Recovery link included',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification
    if(userId){
      await createNotification(userId, 'account', 'Account Deleted', 'Your account has been deleted. You can recover it until ' + expiryDate, { recoveryId: recoveryId, expiryDate: expiryDate }, 'Knot');
    }
    
    return { success: true };
  }catch(err){
    console.error('Error sending account recovery email:', err);
    return { success: false, error: err.message };
  }
}

// Generate account recovery confirmation email
function generateAccountRecoveryConfirmationEmail(email){
  return `
Hi there,

Great news! Your Knot account has been successfully recovered and restored.

All your data, pods, and settings have been restored to their previous state. You can now log in to your account using your existing credentials.

If you did not request this recovery, please contact our support team immediately.

Best wishes,

The Knot team.
  `;
}

// Send account recovery confirmation email
async function sendAccountRecoveryConfirmationEmail(toEmail, userId){
  try{
    initEmailJS();
    
    var emailContent = generateAccountRecoveryConfirmationEmail(toEmail);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot Security',
      subject: 'Your account has been successfully recovered',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification
    if(userId){
      await createNotification(userId, 'account', 'Account Recovered', 'Your account has been successfully recovered and restored.', {}, 'Knot');
    }
    
    return { success: true };
  }catch(err){
    console.error('Error sending account recovery confirmation email:', err);
    return { success: false, error: err.message };
  }
}

// Send streak broken email (when user breaks the group streak)
async function sendStreakBrokenEmail(toEmail, podName, podDayMissCount, userId){
  try{
    initEmailJS();
    
    var emailContent = generateStreakBrokenEmailHTML(podName, podDayMissCount);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot',
      subject: 'You broke the streak',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification
    if(userId){
      await createNotification(userId, 'streak', 'Streak Broken', 'You broke the pod streak in "' + podName + '"', { podName: podName, podDayMissCount: podDayMissCount }, 'Knot');
    }
    
    return { success: true };
  }catch(err){
    console.error('Error sending streak broken email:', err);
    return { success: false, error: err.message };
  }
}

// Send everyone missed email (when entire pod misses)
async function sendEveryoneMissedEmail(toEmail, podName, podDayMissCount, userId){
  try{
    initEmailJS();
    
    var emailContent = generateEveryoneMissedEmailHTML(podName, podDayMissCount);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot',
      subject: 'Pod inactivity notice',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    // Create notification
    if(userId){
      await createNotification(userId, 'streak', 'Pod Inactivity', 'No one in "' + podName + '" has checked in for ' + podDayMissCount + ' days', { podName: podName, podDayMissCount: podDayMissCount }, 'Knot');
    }
    
    return { success: true };
  }catch(err){
    console.error('Error sending everyone missed email:', err);
    return { success: false, error: err.message };
  }
}

// Create notification in database
async function createNotification(userId, type, title, message, metadata, fromName){
  try{
    var supabase = window.supabase.createClient(
      'https://mfjtdrqvmuwtoarkiezi.supabase.co',
      'sb_publishable_SPhsUI31nYbrrLjPBAaRBw_OkWQ2_Xn'
    );
    
    var { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: type,
        title: title,
        message: message,
        metadata: metadata || {},
        from_name: fromName || 'Knot'
      });
    
    if(error) throw error;
    return { success: true };
  }catch(err){
    console.error('Error creating notification:', err);
    return { success: false, error: err.message };
  }
}

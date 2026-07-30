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
async function sendPodDeletionEmail(toEmail, podName, deletedBy){
  try{
    initEmailJS();
    
    var deletionTime = new Date();
    var emailContent = generatePodDeletionEmailHTML(podName, deletedBy, deletionTime);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot Notifications',
      subject: 'Pod deleted on Knot',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  }catch(err){
    console.error('Error sending pod deletion notification:', err);
    // Don't alert user for deletion notifications - silently fail
  }
}
async function sendInviteEmail(toEmail, podName, inviteCode, inviterName){
  try{
    initEmailJS();
    
    var emailContent = generateInviteEmailHTML(podName, inviteCode, inviterName);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot Invitations',
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
      toemail: email,
      fromname: 'Knot Security',
      subject: 'New login to your Knot account',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  }catch(err){
    console.error('Error sending login notification:', err);
    // Don't alert user for login notifications - silently fail
  }
}

// Generate account deletion verification email (plain text)
function generateAccountDeletionVerificationHTML(email, verificationCode, verificationLink){
  return `
Verify your account deletion - Knot

You requested to delete your Knot account. To complete this action, please verify your identity using the code below.

Your verification code: ${verificationCode}

Or visit this link to verify and delete your account:
${verificationLink}

WARNING: This action cannot be undone. All your data will be permanently deleted.

© 2026 Knot. A habit is easier to keep than a promise, when both are shared.
  `;
}

// Generate account recovery email (plain text)
function generateAccountRecoveryEmail(email, recoveryLink){
  return `
Account recovery - Knot

Your account has been deleted

Your Knot account has been successfully deleted. All your data has been permanently removed from our servers.

Good news: Your account can be recovered! We have generated a unique recovery link for you that will allow you to restore your account and all your data.

Visit the recovery page below to restore your account. This link will expire in 24 hours.
${recoveryLink}

© 2026 Knot. A habit is easier to keep than a promise, when both are shared.
  `;
}

// Send account deletion verification email
async function sendAccountDeletionVerificationEmail(toEmail, verificationCode, verificationLink){
  try{
    initEmailJS();
    
    var emailContent = generateAccountDeletionVerificationHTML(toEmail, verificationCode, verificationLink);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot Security',
      subject: 'Verify your account deletion',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    return { success: true };
  }catch(err){
    console.error('Error sending account deletion verification email:', err);
    return { success: false, error: err.message };
  }
}

// Send account recovery email
async function sendAccountRecoveryEmail(toEmail, recoveryId){
  try{
    initEmailJS();
    
    // Create recovery link
    var recoveryLink = 'https://knotapp.pages.dev/account/deletion/recover.html?type=account&id=' + recoveryId;
    
    var emailContent = generateAccountRecoveryEmail(toEmail, recoveryLink);
    
    var templateParams = {
      toemail: toEmail,
      fromname: 'Knot Security',
      subject: 'Your account has been deleted - Recovery link included',
      email_content: emailContent
    };
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    return { success: true };
  }catch(err){
    console.error('Error sending account recovery email:', err);
    return { success: false, error: err.message };
  }
}

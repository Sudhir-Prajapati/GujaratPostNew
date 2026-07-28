import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Gujarat Post <onboarding@resend.dev>';

// Initialize Resend client if API key is present
const resendClient = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Dispatches an email containing login credentials to the newly created user.
 * Falls back to printing to the console if Resend is not configured or fails.
 */
export const sendCredentialsEmail = async (
  toEmail: string,
  plainPassword: string,
  role: string
): Promise<boolean> => {
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Gujarat Post</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f9;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e1e8ed;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            padding: 30px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
          }
          .welcome-text {
            font-size: 16px;
            margin-bottom: 25px;
          }
          .credentials-box {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
          }
          .credential-row {
            margin-bottom: 10px;
            font-size: 15px;
          }
          .credential-row:last-child {
            margin-bottom: 0;
          }
          .label {
            font-weight: 600;
            color: #475569;
            display: inline-block;
            width: 90px;
          }
          .value {
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
            color: #0f172a;
          }
          .cta-container {
            text-align: center;
            margin-top: 35px;
          }
          .cta-button {
            background-color: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to Gujarat Post</h1>
          </div>
          <div class="content">
            <p class="welcome-text">Hello,</p>
            <p>An administrator has created an account for you on the <strong>Gujarat Post</strong> Portal. You have been assigned the role of <strong>${role}</strong>.</p>
            
            <p>Below are your account login credentials:</p>
            
            <div class="credentials-box">
              <div class="credential-row">
                <span class="label">Email:</span>
                <span class="value">${toEmail}</span>
              </div>
              <div class="credential-row">
                <span class="label">Password:</span>
                <span class="value">${plainPassword}</span>
              </div>
              <div class="credential-row">
                <span class="label">Role:</span>
                <span class="value">${role}</span>
              </div>
            </div>
            
            <p>Please secure your password and do not share it with others. You will be prompted to log in at the link below:</p>
            
            <div class="cta-container">
              <a href="${loginUrl}" class="cta-button" target="_blank">Go to Admin Portal</a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated system email. Please do not reply directly to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Gujarat Post. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Try sending via Resend client
  if (resendClient) {
    try {
      const response = await resendClient.emails.send({
        from: EMAIL_FROM,
        to: toEmail,
        subject: 'Gujarat Post Admin - Credentials Generated',
        html: htmlContent,
      });

      if (response.error) {
        console.error('Resend API returned error:', response.error);
        logEmailFallback(toEmail, plainPassword, role, htmlContent);
        return false;
      }

      console.log(`Successfully dispatched credentials email to: ${toEmail} (ID: ${response.data?.id})`);
      return true;
    } catch (err) {
      console.error('Failed to dispatch email via Resend:', err);
      logEmailFallback(toEmail, plainPassword, role, htmlContent);
      return false;
    }
  } else {
    // 2. Fallback to console print if Resend is unconfigured
    logEmailFallback(toEmail, plainPassword, role, htmlContent);
    return true;
  }
};

/**
 * Logs the email details to the console as a fallback in development.
 */
function logEmailFallback(
  toEmail: string,
  plainPassword: string,
  role: string,
  htmlContent: string
) {
  console.log('\n------------------------------------------------------------');
  console.warn('⚠️  EMAIL DEGRADATION FALLBACK (RESEND NOT CONFIGURED/OFFLINE)');
  console.log(`Onboarding credentials for user:`);
  console.log(`- Recipient Email:  ${toEmail}`);
  console.log(`- Plain Password:   ${plainPassword}`);
  console.log(`- Designated Role:  ${role}`);
  console.log('\nHTML Email Preview:');
  console.log(htmlContent.replace(/\s+/g, ' ').trim().substring(0, 500) + '... [truncated]');
  console.log('------------------------------------------------------------\n');
}

const otpMailExistedUser = (username, otp, supportEmail = "support@resumeai.com") => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Login - RESUME.AI</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #060e20; /* Deep Navy Background */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #dee5ff;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #060e20;
        padding-bottom: 40px;
      }
      .main {
        background-color: #0f1930; /* Surface Color */
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        border: 1px solid #40485d;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 50px;
      }
      .header {
        padding: 30px;
        text-align: center;
        border-bottom: 1px solid #40485d;
      }
      .logo {
        font-size: 26px;
        font-weight: 900;
        color: #ffffff;
        text-decoration: none;
        letter-spacing: -1px;
      }
      .logo-accent {
        color: #a3a6ff; /* Primary Purple */
      }
      .content {
        padding: 40px 30px;
        text-align: center;
      }
      .greeting {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 15px;
      }
      .text {
        color: #a3aac4;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 30px;
      }
      .otp-container {
        background: rgba(163, 166, 255, 0.05);
        border: 2px dashed #a3a6ff;
        border-radius: 10px;
        padding: 25px;
        display: inline-block;
        min-width: 250px;
      }
      .otp-code {
        font-size: 42px;
        font-weight: 800;
        color: #9bffce; /* Neon Accent */
        letter-spacing: 8px;
        margin: 0;
      }
      .validity {
        font-size: 12px;
        color: #6c757d;
        margin-top: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .footer {
        padding: 30px;
        background-color: #060e20;
        text-align: center;
      }
      .footer-text {
        color: #40485d;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .footer-link {
        color: #a3a6ff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table class="main">
        <tr>
          <td class="header">
            <div class="logo">RESUME<span class="logo-accent">.AI</span></div>
          </td>
        </tr>
        <tr>
          <td class="content">
            <div class="greeting">Hello,</div>
            <p class="text">
              We received a request to access your account. <br/>
              Use the verification code below to sign in:
            </p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
              <div class="validity">Expires in 10 Minutes</div>
            </div>

            <p class="text" style="margin-top: 30px; font-size: 14px;">
              If you did not request this, please secure your account or contact support.
            </p>
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p class="footer-text">© 2026 RESUME.AI | Next-Gen AI Career Tools</p>
            <p class="footer-text">
              Questions? <a href="mailto:${supportEmail}" class="footer-link">Contact Support</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
};



const otpMailNewUser = (username, otp, supportEmail = "support@resumeai.com") => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Login - RESUME.AI</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #060e20; /* Deep Navy Background */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #dee5ff;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #060e20;
        padding-bottom: 40px;
      }
      .main {
        background-color: #0f1930; /* Surface Color */
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        border: 1px solid #40485d;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 50px;
      }
      .header {
        padding: 30px;
        text-align: center;
        border-bottom: 1px solid #40485d;
      }
      .logo {
        font-size: 26px;
        font-weight: 900;
        color: #ffffff;
        text-decoration: none;
        letter-spacing: -1px;
      }
      .logo-accent {
        color: #a3a6ff; /* Primary Purple */
      }
      .content {
        padding: 40px 30px;
        text-align: center;
      }
      .greeting {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 15px;
      }
      .text {
        color: #a3aac4;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 30px;
      }
      .otp-container {
        background: rgba(163, 166, 255, 0.05);
        border: 2px dashed #a3a6ff;
        border-radius: 10px;
        padding: 25px;
        display: inline-block;
        min-width: 250px;
      }
      .otp-code {
        font-size: 42px;
        font-weight: 800;
        color: #9bffce; /* Neon Accent */
        letter-spacing: 8px;
        margin: 0;
      }
      .validity {
        font-size: 12px;
        color: #6c757d;
        margin-top: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .footer {
        padding: 30px;
        background-color: #060e20;
        text-align: center;
      }
      .footer-text {
        color: #40485d;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .footer-link {
        color: #a3a6ff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table class="main">
        <tr>
          <td class="header">
            <div class="logo">RESUME<span class="logo-accent">.AI</span></div>
          </td>
        </tr>
        <tr>
          <td class="content">
            <div class="greeting">Hello,</div>
            <p class="text">
              We received a request to create your account. <br/>
              Use the verification code below to sign in:
            </p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
              <div class="validity">Expires in 10 Minutes</div>
            </div>

            <p class="text" style="margin-top: 30px; font-size: 14px;">
              If you did not request this, please secure your account or contact support.
            </p>
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p class="footer-text">© 2026 RESUME.AI | Next-Gen AI Career Tools</p>
            <p class="footer-text">
              Questions? <a href="mailto:${supportEmail}" class="footer-link">Contact Support</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
};

export { otpMailExistedUser, otpMailNewUser }
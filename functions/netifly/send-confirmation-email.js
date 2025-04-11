const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, token } = JSON.parse(event.body);

    if (!email || !token) {
      return { statusCode: 400, body: 'Missing email or token' };
    }

    const frontendUrl = process.env.FRONTEND_URL;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!frontendUrl || !smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('Missing environment variables');
      return { statusCode: 500, body: 'Missing environment variables' };
    }

    const confirmationUrl = `${frontendUrl}/confirm-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for others like 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Founder Tracker" <${smtpUser}>`,
      to: email,
      subject: 'Please confirm your registration',
      text: `Hi there,\n\nPlease confirm your registration by visiting the following link:\n${confirmationUrl}`,
      html: `
        <p>Hi there,</p>
        <p>Please confirm your registration by clicking the link below:</p>
        <a href="${confirmationUrl}">${confirmationUrl}</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' }),
    };
  } catch (err) {
    console.error('Error sending email:', err.message, err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};

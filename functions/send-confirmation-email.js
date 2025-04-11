const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, token } = JSON.parse(event.body);

    if (!email || !token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or token' }),
      };
    }

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Founder Tracker" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Please confirm your registration',
      text: `Hi there,\n\nPlease confirm your registration by clicking the link below:\n${confirmationUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' }),
    };
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email', details: err.message }),
    };
  }
};

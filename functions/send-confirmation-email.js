const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, token } = JSON.parse(event.body);

    // Debug: log what's coming in
    console.log("Incoming email:", email);
    console.log("Incoming token:", token);

    if (!email || !token) {
      return { statusCode: 400, body: 'Missing email or token' };
    }

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
    console.log("Confirmation URL:", confirmationUrl);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Founder Tracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Please confirm your registration',
      text: `Hi there,\n\nPlease confirm your registration:\n${confirmationUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' }),
    };
  } catch (err) {
    console.error('🔥 ERROR SENDING EMAIL:', err); // This will show in Netlify logs
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};

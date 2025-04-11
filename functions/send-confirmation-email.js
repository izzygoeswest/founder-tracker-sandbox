const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  console.log("📩 Function started");

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Log environment variable visibility
  console.log("🧪 Environment Check", {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    FRONTEND_URL: process.env.FRONTEND_URL,
  });

  try {
    const { email, token } = JSON.parse(event.body);

    if (!email || !token) {
      console.log("🚫 Missing email or token");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or token' }),
      };
    }

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
    console.log("📨 Sending to:", email);
    console.log("🔗 Confirmation URL:", confirmationUrl);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // set to true if using port 465
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
    console.log('✅ Email sent:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' }),
    };
  } catch (err) {
    console.error('💥 ERROR SENDING EMAIL:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};

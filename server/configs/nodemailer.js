import nodemailer from "nodemailer";

// Validate environment variables
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('SMTP credentials are missing. Please check your environment variables:');
  console.error('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Missing');
  console.error('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Missing');
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

export default transporter;
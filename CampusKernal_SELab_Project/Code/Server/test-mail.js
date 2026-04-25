import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log("Using Host:", process.env.SMTP_HOST);
console.log("Using Port:", process.env.SMTP_PORT);
console.log("Using User:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify()
  .then(() => {
    console.log('✅ Server is ready to take our messages');
    
    // Try sending a test email to the user
    return transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // send to themselves
      subject: "Test Email from Campus Kernel",
      text: "If you get this, mailer is working!"
    });
  })
  .then((info) => {
    console.log("✅ Message sent: %s", info.messageId);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error occurred:");
    console.error(error);
    process.exit(1);
  });

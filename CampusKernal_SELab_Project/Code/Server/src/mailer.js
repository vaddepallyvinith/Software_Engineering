import nodemailer from 'nodemailer';
import { config } from './config.js';

const hasMailConfig = () => (
  Boolean(config.mail.host) &&
  Boolean(config.mail.port) &&
  Boolean(config.mail.user) &&
  Boolean(config.mail.pass) &&
  Boolean(config.mail.from)
);

export const canSendMail = () => hasMailConfig();

export const sendPasswordResetMail = async ({ to, name, resetUrl, expiresAt }) => {
  if (!hasMailConfig()) {
    throw new Error('SMTP is not configured on the server.');
  }

  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  await transporter.sendMail({
    from: config.mail.from,
    to,
    subject: 'Campus Kernel password reset',
    text: `Hello ${name || 'there'},\n\nUse this link to reset your Campus Kernel password:\n${resetUrl}\n\nThis link expires at ${expiresAt}.\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">Campus Kernel password reset</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Use the button below to reset your password.</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Password</a>
        </p>
        <p>If the button does not work, use this link:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires at ${expiresAt}.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
};

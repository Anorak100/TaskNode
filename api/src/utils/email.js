import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSendlibertyConfig() {
  const apiKey = process.env.SENDLIBERTY_API_KEY;
  const from = process.env.SENDLIBERTY_FROM;

  if (!apiKey) {
    throw new Error('SENDLIBERTY_API_KEY is not configured.');
  }

  if (!from) {
    throw new Error('SENDLIBERTY_FROM is not configured.');
  }

  return { apiKey, from };
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadOtpTemplate() {
  const templatePath = path.resolve(__dirname, '../templates/password-reset-otp.html');
  return readFile(templatePath, 'utf8');
}

async function sendTransactionalEmail({ to, subject, html }) {
  const { apiKey, from } = getSendlibertyConfig();

  const response = await fetch('https://sendliberty.com/api/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sendliberty email request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function sendPasswordResetOtp({ email, code, expiresInMinutes }) {
  const template = await loadOtpTemplate();
  const html = template
    .replace(/\{\{OTP_CODE\}\}/g, escapeHtml(code))
    .replace(/\{\{EXPIRY_MINUTES\}\}/g, String(expiresInMinutes))
    .replace(/\{\{EMAIL\}\}/g, escapeHtml(email));

  return sendTransactionalEmail({
    to: email,
    subject: 'Your password reset code',
    html,
  });
}

export { sendPasswordResetOtp, sendTransactionalEmail };

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  return { apiKey };
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

async function sendPasswordResetOtp({ email, code, expiresInMinutes }) {
  const { apiKey } = getResendClient();

  const template = await loadOtpTemplate();
  const html = template
    .replace(/\{\{OTP_CODE\}\}/g, escapeHtml(code))
    .replace(/\{\{EXPIRY_MINUTES\}\}/g, String(expiresInMinutes))
    .replace(/\{\{EMAIL\}\}/g, escapeHtml(email));

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Your password reset code',
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

export { sendPasswordResetOtp };

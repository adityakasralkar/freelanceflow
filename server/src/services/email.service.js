/**
 * Email service wrapper.
 * Uses Resend when RESEND_API_KEY is set, otherwise logs emails to console.
 * Designed so we can swap providers (SendGrid, Postmark, SES) by editing only this file.
 */

const FROM_EMAIL = process.env.EMAIL_FROM || 'FreelanceFlow <onboarding@resend.dev>';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resendClient = null;
if (RESEND_API_KEY) {
  // Lazy require so we don't crash if env is missing during dev
  // eslint-disable-next-line global-require
  const { Resend } = require('resend');
  resendClient = new Resend(RESEND_API_KEY);
}

/**
 * Low-level sender. Falls back to console.log when no API key is configured.
 */
async function send({ to, subject, html, text }) {
  if (!resendClient) {
    console.log('\n────────── EMAIL (dev console fallback) ──────────');
    console.log('To:      ', to);
    console.log('From:    ', FROM_EMAIL);
    console.log('Subject: ', subject);
    console.log('Text:    ', text || '(html only)');
    if (html) console.log('HTML:    ', html.replace(/\s+/g, ' ').slice(0, 200) + '…');
    console.log('───────────────────────────────────────────────────\n');
    return { id: 'dev-console', mock: true };
  }

  try {
    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });
    return result;
  } catch (err) {
    console.error('Email send failed:', err.message);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Templates — keep simple HTML, inline styles for compatibility.
// ---------------------------------------------------------------------------

function wrapTemplate(title, contentHtml, ctaUrl, ctaLabel) {
  return `
<!doctype html>
<html><body style="margin:0;padding:24px;background:#F6F7F9;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E5E9F0;border-radius:12px;padding:32px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
      <div style="width:28px;height:28px;background:#0F9F72;border-radius:8px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">F</div>
      <span style="font-weight:600;font-size:15px;">FreelanceFlow</span>
    </div>
    <h1 style="font-size:22px;font-weight:600;margin:0 0 12px;">${title}</h1>
    <div style="font-size:14px;line-height:1.6;color:#667085;">${contentHtml}</div>
    ${ctaUrl ? `
    <a href="${ctaUrl}" style="display:inline-block;margin-top:24px;background:#0F9F72;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">${ctaLabel}</a>
    <p style="margin-top:18px;font-size:12px;color:#98A2B3;">Or copy this link into your browser:<br/><span style="word-break:break-all;color:#667085;">${ctaUrl}</span></p>
    ` : ''}
    <hr style="border:none;border-top:1px solid #E5E9F0;margin:28px 0;" />
    <p style="font-size:12px;color:#98A2B3;margin:0;">If you didn't expect this email, you can safely ignore it.</p>
  </div>
</body></html>`;
}

async function sendVerificationEmail(to, token, name = '') {
  const url = `${APP_URL}/verify-email/${token}`;
  return send({
    to,
    subject: 'Verify your FreelanceFlow email',
    html: wrapTemplate(
      'Verify your email',
      `Hi ${name || 'there'},<br/><br/>Welcome to FreelanceFlow. Click the button below to verify your email and activate your account. This link expires in 24 hours.`,
      url,
      'Verify email'
    ),
    text: `Verify your FreelanceFlow email: ${url}`,
  });
}

async function sendPasswordResetEmail(to, token, name = '') {
  const url = `${APP_URL}/reset-password/${token}`;
  return send({
    to,
    subject: 'Reset your FreelanceFlow password',
    html: wrapTemplate(
      'Reset your password',
      `Hi ${name || 'there'},<br/><br/>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.<br/><br/>If you didn't request this, you can ignore this email.`,
      url,
      'Reset password'
    ),
    text: `Reset your FreelanceFlow password: ${url}`,
  });
}

async function sendInvitationEmail(to, token, freelancerName, clientName) {
  const url = `${APP_URL}/accept-invite/${token}`;
  return send({
    to,
    subject: `${freelancerName} invited you to FreelanceFlow`,
    html: wrapTemplate(
      `You're invited`,
      `Hi ${clientName || 'there'},<br/><br/><strong>${freelancerName}</strong> has invited you to view your projects and invoices on FreelanceFlow. Click the button below to set up your account. This link expires in 7 days.`,
      url,
      'Accept invitation'
    ),
    text: `${freelancerName} invited you to FreelanceFlow: ${url}`,
  });
}

module.exports = {
  send,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendInvitationEmail,
};

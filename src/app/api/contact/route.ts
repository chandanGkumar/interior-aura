import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const TO_EMAIL = 'soumaysinghal11@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const projectType = String(body.projectType ?? '').trim();
    const budget = String(body.budget ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Name, email and message are required.' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    const subject = `New enquiry from ${name} — Interior Aura website`;
    const text = [
      `New enquiry received via interioraura.com contact form`,
      ``,
      `Name:           ${name}`,
      `Email:          ${email}`,
      `Project type:   ${projectType || '—'}`,
      `Budget:         ${budget || '—'}`,
      ``,
      `Message:`,
      message,
      ``,
      `—`,
      `Sent at ${new Date().toISOString()}`,
    ].join('\n');

    const html = `
      <div style="font-family: -apple-system, system-ui, sans-serif; color: #3A2C24; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 16px; font-size: 18px; letter-spacing: 0.04em; text-transform: uppercase; color: #C67640;">New enquiry · Interior Aura</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b5a4d; width: 110px;">Name</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5a4d;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeAttr(email)}" style="color: #C67640;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b5a4d;">Project type</td><td style="padding: 6px 0;">${escapeHtml(projectType) || '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5a4d;">Budget</td><td style="padding: 6px 0;">${escapeHtml(budget) || '—'}</td></tr>
        </table>
        <h3 style="margin: 20px 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em; color: #6b5a4d;">Message</h3>
        <p style="margin: 0; padding: 14px 16px; background: #FAF7F0; border-left: 3px solid #C67640; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${escapeHtml(message)}</p>
        <p style="margin: 24px 0 0; font-size: 11px; color: #a89684; letter-spacing: 0.08em; text-transform: uppercase;">Sent at ${new Date().toISOString()}</p>
      </div>
    `;

    // === Try SMTP if credentials are configured ============================
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT ?? 465);
    const fromEmail = process.env.SMTP_FROM || smtpUser || 'no-reply@interioraura.com';

    if (smtpHost && smtpUser && smtpPass) {
      // Production: send real email
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Interior Aura website" <${fromEmail}>`,
        to: TO_EMAIL,
        replyTo: email,
        subject,
        text,
        html,
      });

      return NextResponse.json({ ok: true, channel: 'smtp' });
    }

    // === Fallback: persist submission locally so nothing is lost =========
    const submissionsDir = path.join(process.cwd(), '.contact-submissions');
    await fs.mkdir(submissionsDir, { recursive: true });
    const file = path.join(submissionsDir, `${Date.now()}-${slugify(name)}.json`);
    await fs.writeFile(
      file,
      JSON.stringify({ name, email, projectType, budget, message, at: new Date().toISOString() }, null, 2),
      'utf-8',
    );

    console.log('[contact] SMTP not configured — saved submission to', file);
    console.log('[contact] Would send to:', TO_EMAIL);
    console.log('[contact] Subject:', subject);
    console.log('[contact] Body:\n', text);

    return NextResponse.json({ ok: true, channel: 'local-file', saved: file });
  } catch (err) {
    console.error('[contact] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not send your message. Please try again later.' },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'anon';
}

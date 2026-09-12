import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

/** Recipient comes from env so it is never hardcoded in source again. */
const TO_EMAIL =
  process.env.CONTACT_TO_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  'soumaysinghal11@gmail.com';

/** Field caps - unbounded input is an email-bomb and disk-fill vector. */
const LIMITS = {
  name: 120,
  email: 200,
  projectType: 80,
  budget: 80,
  message: 4000,
} as const;

/**
 * Per-IP sliding-window rate limit. In-memory, so it resets on redeploy and is
 * per-instance - fine for a single-server studio site. Move to Redis/Upstash
 * if this ever runs behind more than one instance.
 */
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return (fwd.split(',')[0] ?? 'unknown').trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Strip CR/LF so user input can never inject extra mail headers. */
function singleLine(value: string, max: number): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many enquiries from this device. Please try again in a little while.' },
        { status: 429, headers: { 'Retry-After': String(RATE_LIMIT.windowMs / 1000) } },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const raw = body as Record<string, unknown>;

    // Honeypot: a field hidden from humans. Anything that fills it is a bot.
    // Return 200 so the bot believes it succeeded and does not retry.
    if (String(raw.company ?? '').trim() !== '') {
      return NextResponse.json({ ok: true, channel: 'discarded' });
    }

    const name = singleLine(String(raw.name ?? ''), LIMITS.name);
    const email = singleLine(String(raw.email ?? ''), LIMITS.email);
    const projectType = singleLine(String(raw.projectType ?? ''), LIMITS.projectType);
    const budget = singleLine(String(raw.budget ?? ''), LIMITS.budget);
    const message = String(raw.message ?? '').trim().slice(0, LIMITS.message);

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
    // Persist so the enquiry is not lost, but report the channel honestly so
    // the UI can tell the visitor their message was NOT emailed.
    // Under output:'standalone' the server may run with cwd inside .next.
    const submissionsDir =
      process.env.CONTACT_STORE_DIR?.trim() ||
      path.join(process.cwd(), '.contact-submissions');
    let stored = false;
    try {
      await fs.mkdir(submissionsDir, { recursive: true });
      await fs.writeFile(
        path.join(submissionsDir, `${Date.now()}-${slugify(name)}.json`),
        JSON.stringify({ name, email, projectType, budget, message, at: new Date().toISOString() }, null, 2),
        'utf-8',
      );
      stored = true;
    } catch (writeErr) {
      // Read-only filesystems are normal on containerised hosts.
      console.error('[contact] SMTP unset and could not persist submission:', writeErr);
    }

    // Log that it happened, never the contents - the message body is customer PII.
    console.warn(
      `[contact] SMTP is not configured. Enquiry ${stored ? 'saved to disk' : 'NOT saved'}. ` +
        'Set SMTP_HOST / SMTP_USER / SMTP_PASS to deliver enquiries by email.',
    );

    // No absolute server paths in the response - that leaks the filesystem layout.
    return NextResponse.json({ ok: true, channel: 'local-file', stored });
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

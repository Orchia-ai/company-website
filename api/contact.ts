import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

/** Subjects are chosen here, never sent by the client — a caller-supplied
 *  subject is a header-injection hole. `source` only selects from this map. */
const SUBJECTS: Record<string, string> = {
  'workspace-request': 'Orchia Studio workspace request',
  'alpha-access': 'Orchia Studio private alpha access request',
}

/** `hasOwn` so a `source` of "constructor" or "toString" cannot reach through
 *  to Object.prototype and hand us a non-string subject. */
const subjectFor = (source: unknown, name: string) =>
  typeof source === 'string' && Object.hasOwn(SUBJECTS, source)
    ? SUBJECTS[source]
    : `New message from ${name}`

/** Coerces first: request bodies are untyped, and a non-string here would
 *  throw on `.replace` and 500 the whole submission. */
const escapeHtml = (value: unknown) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, message, source } = req.body
  const smtpUser = process.env.SMTP_USER
  const emailPass = process.env.EMAIL_PASS
  const contactEmail = process.env.CONTACT_EMAIL

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!smtpUser || !emailPass || !contactEmail) {
    console.error('Email configuration is incomplete', {
      hasSmtpUser: Boolean(smtpUser),
      hasEmailPass: Boolean(emailPass),
      hasContactEmail: Boolean(contactEmail),
    })
    return res.status(500).json({ error: 'Email service is not configured' })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: emailPass,
    },
  })

  try {
    await transporter.sendMail({
      from: `"Orchia Website" <${smtpUser}>`,
      replyTo: email,
      to: contactEmail,
      subject: subjectFor(source, String(name)),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('SMTP error:', err)
    res.status(500).json({ error: String(err) })
  }
}

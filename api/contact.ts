import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, message } = req.body
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
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('SMTP error:', err)
    res.status(500).json({ error: String(err) })
  }
}

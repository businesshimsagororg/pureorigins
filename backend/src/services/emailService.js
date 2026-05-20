import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) {
    console.log("[EMAIL MOCK]", to, subject);
    return { ok: false, provider: "mock" };
  }
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html });
  return { ok: true };
}
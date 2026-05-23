import ContactMessage from "../models/ContactMessage.js";
import { sendEmail } from "../services/emailService.js";

function clean(value = "", max = 1000) {
  return String(value || "").trim().slice(0, max);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidBangladeshPhone(phone) {
  return !phone || /^01[3-9]\d{8}$/.test(phone);
}

export async function createContactMessage(req, res) {
  const name = clean(req.body.name, 80);
  const phone = clean(req.body.phone, 20).replace(/\s+/g, "");
  const email = clean(req.body.email, 120).toLowerCase();
  const subject = clean(req.body.subject, 140);
  const message = clean(req.body.message, 2000);

  if (name.length < 2) return res.status(400).json({ message: "Name is required." });
  if (!isValidBangladeshPhone(phone)) return res.status(400).json({ message: "Valid Bangladesh phone number is required." });
  if (!phone && !email) return res.status(400).json({ message: "Phone or email is required." });
  if (subject.length < 2) return res.status(400).json({ message: "Subject is required." });
  if (message.length < 8) return res.status(400).json({ message: "Message is too short." });

  const contact = await ContactMessage.create({
    name,
    phone,
    email,
    subject,
    message,
    ipAddress: req.ip,
    userAgent: req.get("user-agent") || ""
  });

  if (process.env.ADMIN_EMAIL) {
    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || "-")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;
    await sendEmail({ to: process.env.ADMIN_EMAIL, subject: `PureOrigins contact: ${subject}`, html }).catch(error => {
      console.warn("Contact email notification failed", error.message);
    });
  }

  res.status(201).json({
    message: "Contact message received.",
    contactId: contact._id
  });
}

export async function adminListContactMessages(req, res) {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(200);
  res.json({ messages });
}

export async function adminUpdateContactMessage(req, res) {
  const status = clean(req.body.status, 20);
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!message) return res.status(404).json({ message: "Contact message not found" });
  res.json({ message });
}

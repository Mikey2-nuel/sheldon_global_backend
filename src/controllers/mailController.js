// controllers/mailController.js
import { db } from "../config/db.js";
import { sendMail } from "../utils/mailService.js";

// Send to all active users
export async function sendMailToAll(req, res) {
  const { subject, title, message } = req.body;

  try {
    const [users] = await db.query("SELECT email FROM users WHERE status = 'active'");
    const emails = users.map((u) => u.email);

    await Promise.all(
      emails.map((email) =>
        sendMail({ to: email, subject, title, message })
      )
    );

    res.json({ message: "Mail sent to all active users." });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ error: "Failed to send mail." });
  }
}

// Send to one user
export async function sendMailToUser(req, res) {
  const { email, subject, title, message } = req.body;

  try {
    await sendMail({ to: email, subject, title, message });
    res.json({ message: `Mail sent to ${email}` });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ error: "Failed to send mail." });
  }
}

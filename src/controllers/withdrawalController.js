import { db } from "../config/db.js";
import { transporter } from "../utils/mailService.js";

// Create withdrawal
export const createWithdrawal = async ({
  user_id,
  currency,
  amount,
  wallet,
}) => {
  console.log({ user_id, currency, amount, wallet }); // ✅ Log for debugging

  const [result] = await db.execute(
    "INSERT INTO withdrawals (user_id, currency, amount, wallet, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, currency, amount, wallet, "pending"] // ✅ Correct argument array
  );

    // Fetch admin info
  const [adminRows] = await db.execute("SELECT * FROM users WHERE role = ?", [
    "admin",
  ]);
  const admin = adminRows[0];

  // Fetch user info
  const [userRows] = await db.execute("SELECT * FROM users WHERE id = ?", [
    user_id,
  ]);
  const user = userRows[0];

  // Compose email
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: admin.email, // Admin receives it
    subject: `New Withdrawal Request from ${user.first_name} ${user.last_name}`,
    html: `
      <h3>Withdrawal Request Details</h3>
      <p><strong>User:</strong> ${user.first_name} ${user.last_name} (${
      user.email
    })</p>
      <p><strong>Currency:</strong> ${currency}</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Wallet:</strong> ${wallet}</p>
      <p><strong>Status:</strong> pending</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Failed to send admin notification:", err);
    } else {
      console.log("Admin notified:", info.response);
    }
  });

  // Compose user notification email
  const userMailOptions = {
    from: process.env.MAIL_USER,
    to: user.email,
    subject: "Withdrawal Request Received – Sheldon Global",
    html: `
    <p>Dear ${user.first_name} ${user.last_name},</p>

    <p>We have received your withdrawal request of <strong>${currency} ${amount}</strong> to the wallet address <strong>${wallet}</strong>.</p>

    <p>Your request is currently being reviewed by our finance team. Kindly exercise patience while we complete the necessary verification and approval process.</p>

    <p><strong>Status:</strong> Pending<br/>
    <strong>Request Date:</strong> ${new Date().toLocaleString()}</p>

    <p>We will notify you once your withdrawal has been approved or if any further action is required on your part.</p>

    <p>Thank you for choosing Sheldon Global.<br/>
    Best regards,<br/>
    <strong>Finance Operations Team</strong><br/>
    Sheldon Global</p>
  `,
  };

  // Send email to user
  transporter.sendMail(userMailOptions, (err, info) => {
    if (err) {
      console.error("Failed to send user notification:", err);
    } else {
      console.log("User notified:", info.response);
    }
  });

  return result;
};

// Get all withdrawals (admin)
export const getAllWithdrawals = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM withdrawals ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
};

// Approve withdrawal
export const approveWithdrawal = async (req, res) => {
  const { id } = req.params;

  try {
    // Update withdrawal status
    await db.execute("UPDATE withdrawals SET status = ? WHERE id = ?", ["confirmed", id]);

    // Fetch withdrawal and user info
    const [rows] = await db.execute(
      "SELECT w.*, u.first_name, u.last_name, u.email FROM withdrawals w JOIN users u ON w.user_id = u.id WHERE w.id = ?",
      [id]
    );
    const withdrawal = rows[0];

    // Compose approval email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: withdrawal.email,
      subject: "Withdrawal Request Approved – Sheldon Global",
      html: `
        <p>Dear ${withdrawal.first_name} ${withdrawal.last_name},</p>
        <p>Your withdrawal request of <strong>${withdrawal.currency} ${withdrawal.amount}</strong> to wallet <strong>${withdrawal.wallet}</strong> has been <strong>approved</strong>.</p>
        <p>The transaction is now being processed and you will receive your funds shortly.</p>
        <p><strong>Status:</strong> Confirmed<br/>
        <strong>Approval Date:</strong> ${new Date().toLocaleString()}</p>
        <p>Thank you for choosing Sheldon Global.<br/>
        Best regards,<br/>
        Finance Operations Team</p>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email failed:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ message: "Withdrawal approved" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Failed to approve withdrawal" });
  }
};

// Reject withdrawal
export const rejectWithdrawal = async (req, res) => {
  const { id } = req.params;

  try {
    // Update withdrawal status
    await db.execute("UPDATE withdrawals SET status = ? WHERE id = ?", ["rejected", id]);

    // Fetch withdrawal and user info
    const [rows] = await db.execute(
      "SELECT w.*, u.first_name, u.last_name, u.email FROM withdrawals w JOIN users u ON w.user_id = u.id WHERE w.id = ?",
      [id]
    );
    const withdrawal = rows[0];

    // Compose rejection email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: withdrawal.email,
      subject: "Withdrawal Request Rejected – Sheldon Global",
      html: `
        <p>Dear ${withdrawal.first_name} ${withdrawal.last_name},</p>
        <p>We regret to inform you that your withdrawal request of <strong>${withdrawal.currency} ${withdrawal.amount}</strong> to wallet <strong>${withdrawal.wallet}</strong> has been <strong>rejected</strong>.</p>
        <p>This may be due to verification issues or other compliance concerns.</p>
        <p><strong>Status:</strong> Rejected<br/>
        <strong>Review Date:</strong> ${new Date().toLocaleString()}</p>
        <p>If you have questions, please contact our support team.</p>
        <p>Thank you for your understanding.<br/>
        Best regards,<br/>
        Finance Operations Team</p>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email failed:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ message: "Withdrawal rejected" });
  } catch (err) {
    console.error("Rejection error:", err);
    res.status(500).json({ error: "Failed to reject withdrawal" });
  }
};

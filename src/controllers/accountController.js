import { db } from "../config/db.js";
import bcrypt from "bcrypt";

// GET /api/account
export async function getAccount(req, res) {
  try {
    const { userId } = req.user;

    const [rows] = await db.query(
      `SELECT 
        first_name, last_name, email, phone_number, 
        home_address, city, state, country
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// PUT /api/account/update
export async function updateAccount(req, res) {
  try {
    const { userId } = req.user;
    const {
      first_name,
      last_name,
      email,
      phone_number,
      home_address,
      city,
      state,
      country,
    } = req.body;

    await db.query(
      `UPDATE users SET 
        first_name = ?, last_name = ?, email = ?, 
        phone_number = ?, home_address = ?, city = ?, state = ?, country = ?
       WHERE id = ?`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        home_address,
        city,
        state,
        country,
        userId,
      ]
    );

    res.json({ message: "Account updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// PUT /api/account/change-password
export async function changePassword(req, res) {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// src/routes/api/investment.js
import express from "express";
import { db } from "../../config/db.js";

const router = express.Router();

router.post("/record", async (req, res) => {
  const { userId, planSlug, planType, amount, currency, paymentId, orderId } = req.body;

  try {
    await db.query(
      "INSERT INTO investments (user_id, plan_slug, plan_type, amount, currency, payment_id, order_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, planSlug, planType, amount, currency, paymentId, orderId, "pending"]
    );

    res.status(200).json({ message: "Investment recorded." });
  } catch (err) {
    console.error("Error recording investment:", err);
    res.status(500).json({ error: "Failed to record investment." });
  }
});

export default router;

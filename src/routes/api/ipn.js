import express from "express";
import crypto from "crypto";
import { db } from "../../config/db.js";

const router = express.Router();

router.post("/ipn", async (req, res) => {
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";
  const signature = req.headers["x-nowpayments-sig"];
  const rawBody = JSON.stringify(req.body);

  const expectedSig = crypto
    .createHmac("sha512", ipnSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSig) {
    console.warn("Invalid IPN signature");
    return res.status(403).end();
  }

  const { payment_status, payment_id, order_id } = req.body;

  if (payment_status === "finished") {
    console.log(`✅ Payment ${payment_id} for ${order_id} confirmed`);
    await db.query("UPDATE investments SET status = ? WHERE order_id = ?", [
      "confirmed",
      order_id,
    ]);
  } else if (payment_status === "failed") {
    console.log(`❌ Payment ${payment_id} failed`);
    await db.query("UPDATE investments SET status = ? WHERE order_id = ?", [
      "failed",
      order_id,
    ]);
  }

  res.status(200).end();
});

export default router;

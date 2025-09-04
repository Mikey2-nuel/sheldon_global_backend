import express from "express";
import fetch from "node-fetch";


const router = express.Router();

router.post("/create-payment", async (req, res) => {
  const { amount, currency, slug, planType } = req.body;

  try {
    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        pay_currency: currency.toLowerCase(),
        order_id: `user123-${slug}`,
        order_description: `${planType} investment`,
        ipn_callback_url: "https://yourdomain.com/api/ipn", // Replace with ngrok or live URL
        is_fixed_rate: true,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Payment creation failed:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

export default router;

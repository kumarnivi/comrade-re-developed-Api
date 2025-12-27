// routes/payment.routes.ts
import { Router } from "express";
import stripe from "../config/stripe";

const router = Router();

router.get("/success", async (req:any, res:any) => {
  const sessionId = req.query.session_id as string;

  if (!sessionId) {
    return res.status(400).send("Session ID missing");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    return res.send("✅ Payment successful!");
  }

  res.send("❌ Payment not completed");
});

router.get("/cancel", (req, res) => {
  res.send("❌ Payment cancelled");
});



router.get("/payment-status/:sessionId", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

  res.json({
    paid: session.payment_status === "paid",
    amount: session.amount_total,
    currency: session.currency,
  });
});

export default router;

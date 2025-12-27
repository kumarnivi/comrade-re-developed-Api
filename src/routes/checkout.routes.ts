// routes/checkout.routes.ts
import express from "express";
import { createCheckoutSession } from "../controllers/checkout.controller";
import { stripeWebhook } from "../controllers/webhook.controller";
import {verifyToken} from "../middlewares/isAdmin";

const router = express.Router();

// Webhook must use RAW body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.post("/checkout", verifyToken, createCheckoutSession);



export default router;

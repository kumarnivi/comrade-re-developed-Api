// controllers/checkout.controller.ts
import { Request, Response } from "express";
import stripe from "../config/stripe";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

export const createCheckoutSession = async (req: any, res: any) => {
  try {
    const { userId } = req.body;

    // Get all cart items for the user
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, as: "product" }],
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Prepare line items for Stripe
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "lkr",
        product_data: {
          name: item.product?.name ?? "Product",
        },
        unit_amount: Math.round((item.product?.price || 0) * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5000/cancel",
      metadata: { userId: userId.toString() },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Stripe checkout session" });
  }
};

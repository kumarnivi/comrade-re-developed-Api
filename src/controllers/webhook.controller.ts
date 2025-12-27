// controllers/webhook.controller.ts
import stripe from "../config/stripe";
import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

export const stripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // RAW body
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    const userId = Number(session.metadata.userId);

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, as: "product" }],
    });

    if (!cartItems.length) {
      return res.status(200).json({ received: true });
    }

    let totalAmount = 0;

    for (const item of cartItems) {
      const product = item.get("product") as Product | null;
      if (!product) continue;

      totalAmount += item.quantity * product.price;
    }

    const order = await Order.create({
      userId,
      totalAmount,
      paymentStatus: "paid",
      paymentIntentId: session.payment_intent,
    });

    for (const item of cartItems) {
      const product = item.get("product") as Product | null;
      if (!product) continue;

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    await Cart.destroy({ where: { userId } });
  }

  res.json({ received: true });
};

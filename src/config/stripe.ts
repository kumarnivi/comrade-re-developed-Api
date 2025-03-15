import Stripe from "stripe";

const stripe = new Stripe("your_stripe_secret_key", {
  apiVersion: '2025-02-24.acacia',
});

export default stripe;

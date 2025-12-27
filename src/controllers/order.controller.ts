// controllers/order.controller.ts
import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";
import Product from "../models/product.model";

export const getLatestOrder = async (req: any, res: any) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const order = await Order.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

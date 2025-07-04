import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

// Add to Cart
// Add to Cart
export const addToCart = async (req: any, res: any) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if there is enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Reduce the stock
    product.stock -= quantity;
    await product.save(); // update product stock

    // Add to cart
    const cartItem = await Cart.create({ userId, productId, quantity });

    res.json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding to cart" });
  }
};


// Get Cart Items
export const getCartItems = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, as: "product" }],
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
};

// Remove from Cart
export const removeFromCart = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await Cart.destroy({ where: { id } });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
};

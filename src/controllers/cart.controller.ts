import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

// Add to Cart
// Add to Cart
// export const addToCart = async (req: any, res: any) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     const product = await Product.findByPk(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });

//     }
//     console.log("FOUND PRODUCT:", product);

//     // Check if there is enough stock
//     if (product.stock < quantity) {
//       return res.status(400).json({ error: "Not enough stock available" });
//     }

//     // Reduce the stock
//     product.stock -= quantity;
//     await product.save(); // update product stock

//     // Add to cart
//     const cartItem = await Cart.create({ userId, productId, quantity });

//     res.json({ message: "Product added to cart", cartItem });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error adding to cart" });
//   }
// };

export const addToCart = async (req: any, res: any) => {
  const t = await Cart.sequelize!.transaction();

  try {
    const userId = Number(req.body.userId);
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity) || 1;

    if (!userId || !productId) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid userId or productId" });
    }

    const product = await Product.findByPk(productId, { transaction: t });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      await t.rollback();
      return res.status(400).json({ error: "Not enough stock available" });
    }

    product.stock -= quantity;
    await product.save({ transaction: t });

    const cartItem = await Cart.create(
      { userId, productId, quantity },
      { transaction: t }
    );

    await t.commit();

    res.json({ message: "Product added to cart", cartItem });

  } catch (error) {
    await t.rollback();
    console.error("Add to cart error:", error);
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

// Get All Cart Items for a User
export const getAllCartItems = async (req: any, res: any) => {
  try {
    // If using auth middleware, get userId from token
    const userId = Number(req.user?.id || req.params.userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "images", "stock"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      count: cartItems.length,
      cartItems,
    });
  } catch (error) {
    console.error("Get cart items error:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

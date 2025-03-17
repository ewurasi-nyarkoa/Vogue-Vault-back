import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Add item to cart
router.post("/:userId", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    console.log("📌 Received request - User ID:", req.params.userId);
    console.log("📌 Product ID:", productId);
    console.log("📌 Quantity:", quantity);

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      console.log("🛒 No cart found for this user, creating a new cart...");
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    console.log("🔍 Checking if product exists in DB...");
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found:", productId);
      return res.status(404).json({ message: "Product not found." });
    }

    console.log("✅ Product found! Adding to cart...");

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    console.log("✅ Item added to cart successfully!");
    res.status(200).json({ message: "Item added to cart", cart });

  } catch (err) {
    console.error("❌ ERROR ADDING TO CART:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get cart for a user
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ msg: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update quantity of a cart item
router.put("/:userId", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    }
    res.status(404).json({ msg: "Product not in cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Clear entire cart
router.delete("/:userId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.status(200).json({ msg: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

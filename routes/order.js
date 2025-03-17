import express from "express";
import Order from "../models/Order.js"; 
import { verifyToken, verifyAdmin } from "../middleware/auth.js"; 

const router = express.Router();

// 1. Create an Order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    
    const newOrder = new Order({
      userId: req.user._id, // Assuming req.user is set in middleware
      items,
      totalAmount,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// 2. Get All Orders for a User
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// 3. Get a Single Order
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// 4. Get All Orders (Admin only) 🚀 NEW
router.get("/all", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error });
  }
});

// 5. Update Order Status (Admin only)
router.put("/:id/status", verifyAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
});

// 6. Cancel an Order (User can cancel if still pending)
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.orderStatus !== "pending") {
      return res.status(400).json({ message: "Order cannot be canceled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error canceling order", error });
  }
});

export default router;

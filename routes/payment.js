import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();
const HUBTEL_API_KEY = process.env.HUBTEL_API_KEY;
const HUBTEL_API_SECRET = process.env.HUBTEL_API_SECRET;
const HUBTEL_MERCHANT_ACCOUNT = process.env.HUBTEL_MERCHANT_ACCOUNT;

// ✅ Process Payment with Hubtel
router.post("/:orderId", verifyToken, async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;

    // Check if the order exists
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Ensure amount is valid
    if (!order.totalAmount || isNaN(order.totalAmount)) {
      return res.status(400).json({ msg: "Invalid order amount" });
    }

    // Hubtel payment request body
    const paymentData = {
      totalAmount: order.totalAmount,
      description: "Thrift Store Payment",
      callbackUrl: "https://your-website.com/payment-callback",
      returnUrl: "https://your-website.com/payment-success",
      cancellationUrl: "https://your-website.com/payment-cancelled",
      clientReference: `ORDER-${order._id}`,
      merchantAccountNumber: HUBTEL_MERCHANT_ACCOUNT,
      customerMsisdn: phoneNumber,
      customerEmail: email,
      channel: "momo",
    };

    // Send request to Hubtel API
    const response = await axios.post(
      "https://api.hubtel.com/v1/merchant-account/onlinecheckout/invoice/create",
      paymentData,
      {
        auth: {
          username: HUBTEL_API_KEY,
          password: HUBTEL_API_SECRET,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check Hubtel response
    if (response.data.status === "Success") {
      return res.status(200).json({
        msg: "Payment link generated",
        url: response.data.data.checkoutUrl,
      });
    } else {
      return res.status(400).json({ msg: "Payment initialization failed" });
    }
  } catch (err) {
    console.error("Payment Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Internal server error",
      details: err.response?.data || err.message,
    });
  }
});

export default router;

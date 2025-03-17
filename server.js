import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/order.js";  
import cartRoutes from "./routes/carts.js";
import paymentRoutes from "./routes/payment.js"  

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/thrift/auth", authRoutes);
app.use("/thrift/products", productRoutes);
app.use("/thrift/orders", orderRoutes);  
app.use("/thrift/cart", cartRoutes);
app.use("/thrift/payment", paymentRoutes);
app.use("/uploads", express.static("uploads"));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

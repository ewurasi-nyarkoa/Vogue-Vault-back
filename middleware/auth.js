import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure correct path to User model
import dotenv from "dotenv";

dotenv.config();

// ✅ Middleware to verify token (for logged-in users)
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded Token:", decoded); // Debugging log

    // Extract user ID correctly
    const userId = decoded.id; // Your token payload contains `id`, not `user.id`
    console.log("🛠 Extracted User ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Invalid token structure." });
    }

    // Fetch the user from the database
    const user = await User.findById(userId).select("_id role");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
// ✅ Middleware to verify admin access
export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied! Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Authorization error.", error });
  }
};

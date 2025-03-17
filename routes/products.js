import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js"; // For handling file uploads

const router = express.Router();

// ✅ CREATE a new product (already implemented)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.path : null; // Get the uploaded file path

    if (!image) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      image, // Save image path in DB
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ FETCH all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ UPDATE a product by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let updatedProduct = { name, description, price, category, stock };

    if (req.file) {
      updatedProduct.image = req.file.path; // Update image if a new one is uploaded
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;

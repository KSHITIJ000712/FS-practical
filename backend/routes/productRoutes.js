const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

// =====================================================
// 1. CREATE PRODUCT
// POST /api/products
// JWT REQUIRED
// =====================================================

router.post("/", protect, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// =====================================================
// 2. GET ALL PRODUCTS
// GET /api/products
// PUBLIC
// =====================================================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// =====================================================
// 3. GET SINGLE PRODUCT
// GET /api/products/:id
// PUBLIC
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// =====================================================
// 4. UPDATE PRODUCT
// PUT /api/products/:id
// JWT REQUIRED
// =====================================================

router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// =====================================================
// 5. DELETE PRODUCT
// DELETE /api/products/:id
// JWT REQUIRED
// =====================================================

router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
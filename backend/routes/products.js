const express = require("express");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET /api/products?search=&category=&status=&stockState=
router.get("/", async (req, res) => {
  try {
    const { search, category, status, stockState } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { sku: new RegExp(search, "i") },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    let products = await Product.find(filter).sort({ createdAt: -1 }).lean();

    products = products.map((p) => ({
      ...p,
      stockState: p.stock <= 0 ? "out" : p.stock <= p.lowStockThreshold ? "low" : "ok",
    }));

    if (stockState) {
      products = products.filter((p) => p.stockState === stockState);
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/products/:id/stock  { delta: number }  — quick +/- adjustment
router.patch("/:id/stock", requireAdmin, async (req, res) => {
  try {
    const { delta } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    product.stock = Math.max(0, product.stock + Number(delta));
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

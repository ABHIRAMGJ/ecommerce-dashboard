const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `ORD-${stamp}-${rand}`;
}

// GET /api/orders?status=&search=
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: new RegExp(search, "i") },
        { customerName: new RegExp(search, "i") },
        { customerEmail: new RegExp(search, "i") },
      ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/orders  { customerName, customerEmail, items: [{ product, qty }] }
// Looks up live product price/name/sku and decrements stock.
router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, items } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: "Order needs at least one item" });
    }

    const resolvedItems = [];
    let total = 0;

    for (const line of items) {
      const product = await Product.findById(line.product);
      if (!product) return res.status(400).json({ error: `Unknown product: ${line.product}` });
      if (product.stock < line.qty) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }
      resolvedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        qty: line.qty,
        price: product.price,
      });
      total += product.price * line.qty;
      product.stock -= line.qty;
      await product.save();
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerName,
      customerEmail,
      items: resolvedItems,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id/payment", requireAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

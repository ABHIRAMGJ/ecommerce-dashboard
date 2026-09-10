const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/summary", requireAdmin, async (_req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [todayOrders, allOrders, products] = await Promise.all([
      Order.find({ createdAt: { $gte: startOfToday } }),
      Order.find({ status: { $ne: "cancelled" } }),
      Product.find(),
    ]);

    const revenueToday = todayOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const revenueAllTime = allOrders.reduce((sum, o) => sum + o.total, 0);

    const statusCounts = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    for (const o of await Order.find()) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    }

    const lowStock = products
      .filter((p) => p.stock <= p.lowStockThreshold)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 8)
      .map((p) => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
      }));

    const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0);

    // 14-day revenue trend
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const trend = days.map((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const dayTotal = allOrders
        .filter((o) => o.createdAt >= d && o.createdAt < next)
        .reduce((sum, o) => sum + o.total, 0);
      return { date: d.toISOString().slice(0, 10), revenue: dayTotal };
    });

    // Top products by units sold (from all non-cancelled orders)
    const unitsBySku = {};
    for (const o of allOrders) {
      for (const item of o.items) {
        unitsBySku[item.sku] = unitsBySku[item.sku] || { name: item.name, sku: item.sku, units: 0, revenue: 0 };
        unitsBySku[item.sku].units += item.qty;
        unitsBySku[item.sku].revenue += item.qty * item.price;
      }
    }
    const topProducts = Object.values(unitsBySku)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    res.json({
      revenueToday,
      revenueAllTime,
      ordersToday: todayOrders.length,
      pendingOrders: statusCounts.pending,
      statusCounts,
      lowStock,
      lowStockCount: products.filter((p) => p.stock <= p.lowStockThreshold).length,
      inventoryValue,
      productCount: products.length,
      trend,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

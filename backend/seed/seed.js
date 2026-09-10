require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const Order = require("../models/Order");

const categories = ["Kitchen", "Outdoor", "Lighting", "Storage", "Textiles"];

const productSeeds = [
  { name: "Ceramic Pour-Over Kettle", sku: "KIT-1001", category: "Kitchen", imageUrl: "/images/e12.png", price: 42.0, cost: 18.5, stock: 84, lowStockThreshold: 15 },

  { name: "Cast Iron Skillet 10in", sku: "KIT-1002", category: "Kitchen", imageUrl: "/images/e9.png", price: 35.0, cost: 14.0, stock: 6, lowStockThreshold: 10 },

  { name: "Bamboo Cutting Board", sku: "KIT-1003", category: "Kitchen", imageUrl: "/images/e10.png", price: 24.5, cost: 9.0, stock: 130, lowStockThreshold: 20 },

  { name: "Folding Camp Chair", sku: "OUT-2001", category: "Outdoor", imageUrl: "/images/e11.png", price: 58.0, cost: 26.0, stock: 42, lowStockThreshold: 12 },

  { name: "Insulated Growler 64oz", sku: "OUT-2002", category: "Outdoor", imageUrl: "/images/e1.png", price: 39.0, cost: 16.0, stock: 3, lowStockThreshold: 10 },

  { name: "Packable Rain Shell", sku: "OUT-2003", category: "Outdoor", imageUrl: "/images/e2.png", price: 89.0, cost: 40.0, stock: 27, lowStockThreshold: 8 },

  { name: "Rattan Pendant Lamp", sku: "LGT-3001", category: "Lighting", imageUrl: "/images/e3.png", price: 76.0, cost: 32.0, stock: 19, lowStockThreshold: 8 },

  { name: "Brass Desk Lamp", sku: "LGT-3002", category: "Lighting", imageUrl: "/images/e4.png", price: 64.0, cost: 27.0, stock: 0, lowStockThreshold: 6 },

  { name: "Woven Storage Basket L", sku: "STG-4001", category: "Storage", imageUrl: "/images/e5.png", price: 31.0, cost: 12.5, stock: 55, lowStockThreshold: 15 },

  { name: "Stackable Bin Set (3)", sku: "STG-4002", category: "Storage", imageUrl: "/images/e6.png", price: 22.0, cost: 8.0, stock: 8, lowStockThreshold: 12 },

  { name: "Linen Throw Blanket", sku: "TXT-5001", category: "Textiles", imageUrl: "/images/e7.png", price: 48.0, cost: 21.0, stock: 63, lowStockThreshold: 15 },

  { name: "Waffle Knit Towel Set", sku: "TXT-5002", category: "Textiles", imageUrl: "/images/e8.png", price: 29.0, cost: 11.0, stock: 4, lowStockThreshold: 10 },

  {
    name: "Ceramic Pour-Over Kettle",
    sku: "KIT-1001",
    category: "Kitchen",
    imageUrl: "/images/e12.png",
    price: 42.0,
    cost: 18.5,
    stock: 84,
    lowStockThreshold: 15,
  },
  {
    name: "Cast Iron Skillet 10in",
    sku: "KIT-1002",
    category: "Kitchen",
    imageUrl: "/images/e9.png",
    price: 35.0,
    cost: 14.0,
    stock: 6,
    lowStockThreshold: 10,
  },
  {
    name: "Bamboo Cutting Board",
    sku: "KIT-1003",
    category: "Kitchen",
    imageUrl: "/images/e10.png",
    price: 24.5,
    cost: 9.0,
    stock: 130,
    lowStockThreshold: 20,
  },
  {
    name: "Wooden Spice Rack",
    sku: "KIT-1004",
    category: "Kitchen",
    imageUrl: "/images/e13.png",
    price: 34.0,
    cost: 15.0,
    stock: 40,
    lowStockThreshold: 10,
  },
  {
    name: "Glass Food Storage Set",
    sku: "KIT-1005",
    category: "Kitchen",
    imageUrl: "/images/e14.png",
    price: 29.0,
    cost: 11.0,
    stock: 55,
    lowStockThreshold: 10,
  },

  {
    name: "Folding Camp Chair",
    sku: "OUT-2001",
    category: "Outdoor",
    imageUrl: "/images/e11.png",
    price: 58.0,
    cost: 26.0,
    stock: 42,
    lowStockThreshold: 12,
  },
  {
    name: "Insulated Growler 64oz",
    sku: "OUT-2002",
    category: "Outdoor",
    imageUrl: "/images/e1.png",
    price: 39.0,
    cost: 16.0,
    stock: 3,
    lowStockThreshold: 10,
  },
  {
    name: "Packable Rain Shell",
    sku: "OUT-2003",
    category: "Outdoor",
    imageUrl: "/images/e2.png",
    price: 89.0,
    cost: 40.0,
    stock: 27,
    lowStockThreshold: 8,
  },
  {
    name: "Stainless Steel Water Bottle",
    sku: "OUT-2004",
    category: "Outdoor",
    imageUrl: "/images/e15.png",
    price: 28.0,
    cost: 12.0,
    stock: 48,
    lowStockThreshold: 10,
  },
  {
    name: "Camping Backpack",
    sku: "OUT-2005",
    category: "Outdoor",
    imageUrl: "/images/e16.png",
    price: 79.0,
    cost: 35.0,
    stock: 22,
    lowStockThreshold: 8,
  },
  {
    name: "Outdoor Picnic Blanket",
    sku: "OUT-2006",
    category: "Outdoor",
    imageUrl: "/images/e17.png",
    price: 32.0,
    cost: 13.0,
    stock: 37,
    lowStockThreshold: 8,
  },

  {
    name: "Rattan Pendant Lamp",
    sku: "LGT-3001",
    category: "Lighting",
    imageUrl: "/images/e3.png",
    price: 76.0,
    cost: 32.0,
    stock: 19,
    lowStockThreshold: 8,
  },
  {
    name: "Brass Desk Lamp",
    sku: "LGT-3002",
    category: "Lighting",
    imageUrl: "/images/e4.png",
    price: 64.0,
    cost: 27.0,
    stock: 0,
    lowStockThreshold: 6,
  },
  {
    name: "Modern Floor Lamp",
    sku: "LGT-3003",
    category: "Lighting",
    imageUrl: "/images/e18.png",
    price: 99.0,
    cost: 45.0,
    stock: 16,
    lowStockThreshold: 5,
  },
  {
    name: "LED Table Lamp",
    sku: "LGT-3004",
    category: "Lighting",
    imageUrl: "/images/e19.png",
    price: 54.0,
    cost: 20.0,
    stock: 26,
    lowStockThreshold: 6,
  },

  {
    name: "Woven Storage Basket L",
    sku: "STG-4001",
    category: "Storage",
    imageUrl: "/images/e5.png",
    price: 31.0,
    cost: 12.5,
    stock: 55,
    lowStockThreshold: 15,
  },
  {
    name: "Stackable Bin Set (3)",
    sku: "STG-4002",
    category: "Storage",
    imageUrl: "/images/e6.png",
    price: 22.0,
    cost: 8.0,
    stock: 8,
    lowStockThreshold: 12,
  },
  {
    name: "Fabric Storage Cube",
    sku: "STG-4003",
    category: "Storage",
    imageUrl: "/images/e20.png",
    price: 19.0,
    cost: 7.0,
    stock: 70,
    lowStockThreshold: 15,
  },
  {
    name: "Bamboo Laundry Basket",
    sku: "STG-4004",
    category: "Storage",
    imageUrl: "/images/e21.png",
    price: 45.0,
    cost: 18.0,
    stock: 28,
    lowStockThreshold: 10,
  },

  {
    name: "Linen Throw Blanket",
    sku: "TXT-5001",
    category: "Textiles",
    imageUrl: "/images/e7.png",
    price: 48.0,
    cost: 21.0,
    stock: 63,
    lowStockThreshold: 15,
  },
  {
    name: "Waffle Knit Towel Set",
    sku: "TXT-5002",
    category: "Textiles",
    imageUrl: "/images/e8.png",
    price: 29.0,
    cost: 11.0,
    stock: 4,
    lowStockThreshold: 10,
  },
  {
    name: "Cotton Cushion Cover",
    sku: "TXT-5003",
    category: "Textiles",
    imageUrl: "/images/e22.png",
    price: 18.0,
    cost: 6.0,
    stock: 80,
    lowStockThreshold: 15,
  },
  {
    name: "Wool Area Rug",
    sku: "TXT-5004",
    category: "Textiles",
    imageUrl: "/images/e23.png",
    price: 120.0,
    cost: 55.0,
    stock: 14,
    lowStockThreshold: 5,
  },
  {
    name: "Decorative Table Runner",
    sku: "TXT-5005",
    category: "Textiles",
    imageUrl: "/images/e24.png",
    price: 26.0,
    cost: 9.0,
    stock: 34,
    lowStockThreshold: 8,
  },
];

const firstNames = ["Asha", "Ravi", "Meera", "Kabir", "Diya", "Arjun", "Sana", "Vikram", "Nora", "Leo"];
const lastNames = ["Rao", "Iyer", "Patel", "Nair", "Menon", "Kapoor", "Sharma", "D'Souza", "Reddy", "Verma"];
const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomDateWithinDays(days) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));
  return d;
}

async function run() {
  await connectDB();
  await Product.deleteMany({});
  await Order.deleteMany({});

  const products = await Product.insertMany(productSeeds);
  console.log(`[seed] inserted ${products.length} products`);

  const orders = [];
  for (let i = 0; i < 60; i++) {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const chosen = new Set();
    while (chosen.size < itemCount) chosen.add(randomOf(products));
    const items = Array.from(chosen).map((p) => {
      const qty = Math.floor(Math.random() * 3) + 1;
      return { product: p._id, name: p.name, sku: p.sku, qty, price: p.price };
    });
    const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
    const createdAt = randomDateWithinDays(14);

    orders.push({
      orderNumber: `ORD-${createdAt.getTime().toString(36).toUpperCase()}-${100 + i}`,
      customerName: `${randomOf(firstNames)} ${randomOf(lastNames)}`,
      customerEmail: `customer${i}@example.com`,
      items,
      total,
      status: randomOf(statuses),
      paymentStatus: randomOf(["paid", "paid", "paid", "unpaid", "refunded"]),
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Order.insertMany(orders);
  console.log(`[seed] inserted ${orders.length} orders`);

  await mongoose.disconnect();
  console.log("[seed] done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },

    category: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },

    cost: { type: Number, required: true, min: 0, default: 0 },

    stock: { type: Number, required: true, min: 0, default: 0 },

    lowStockThreshold: { type: Number, required: true, min: 0, default: 10 },

    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },

    imageUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

productSchema.virtual("stockState").get(function () {
  if (this.stock <= 0) return "out";
  if (this.stock <= this.lowStockThreshold) return "low";
  return "ok";
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
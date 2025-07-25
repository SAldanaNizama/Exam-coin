const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    type: { type: String, enum: ["físico", "beneficio"], default: "físico" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

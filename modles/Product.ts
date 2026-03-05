import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    mensCategory: { type: String },
    womensCategory: { type: String },
    color: { type: String },
    sizes: { type: [String], default: [] },
    description: { type: String },
    status: { type: String, enum: ["active", "draft", "out_of_stock"], default: "active" },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isNew: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Product = models.Product || mongoose.model("Product", ProductSchema);
export default Product;


import mongoose, { Schema, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    id: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    size: { type: String },
    color: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model("Order", OrderSchema);
export { Order };
export default Order;

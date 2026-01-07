import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  from: { type: String, enum: ["customer", "admin"], required: true },
  message: { type: String, required: true },
  read: {
      type: Boolean,
      default: false // 👈 important
    },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);

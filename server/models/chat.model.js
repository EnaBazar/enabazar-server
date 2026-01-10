import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: String,
      mobile: {
      type: String,
      trim: true,
      default: "",
    },

    from: { type: String, enum: ["admin", "customer"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);

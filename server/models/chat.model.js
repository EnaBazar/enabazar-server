import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: String,
    mobile: String,

    from: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "audio"],
      default: "text",
    },

    message: {
      type: String,
      default: "",
    },

    audio: {
      type: String, // base64 or audio URL
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);

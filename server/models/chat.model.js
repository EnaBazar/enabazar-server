import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    customerName: String,
    mobile: String,
    image: String,
      
     
    from: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "audio","image"],
      default: "text",
    },

    message: String,
    audio: String,

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);

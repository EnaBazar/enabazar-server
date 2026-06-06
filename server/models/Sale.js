import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  mokam: { type: mongoose.Schema.Types.ObjectId, ref: "Mokam", required: true },
  lotNo: { type: String, required: true, trim: true },
  kg: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  receivedAmount: { type: Number, default: 0, min: 0 },
  dueAmount: { type: Number, default: 0, min: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);

import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  lotNo: { type: String, required: true, trim: true },
  kg: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  dueAmount: { type: Number, default: 0, min: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);

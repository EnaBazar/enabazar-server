import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, default: "" },
  address: { type: String, default: "" },
  openingDue: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);

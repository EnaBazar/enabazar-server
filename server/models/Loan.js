import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  personName: { type: String, required: true, trim: true },
  mobile: { type: String, default: "" },
  address: { type: String, default: "" },
  type: { type: String, enum: ["receive", "payment"], required: true },
  amount: { type: Number, required: true, min: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Loan", loanSchema);

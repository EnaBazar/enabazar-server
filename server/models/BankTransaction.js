import mongoose from "mongoose";

const bankTransactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["deposit", "withdraw"], required: true },
  bankName: { type: String, default: "" },
  accountNo: { type: String, default: "" },
  amount: { type: Number, required: true, min: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("BankTransaction", bankTransactionSchema);

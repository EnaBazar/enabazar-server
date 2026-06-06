import mongoose from "mongoose";

const cashTransactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["in", "out"], required: true },
  source: {
    type: String,
    enum: [
      "opening",
      "purchase",
      "sale",
      "collection",
      "expense",
      "loan_receive",
      "loan_payment",
      "bank_deposit",
      "bank_withdraw",
      "other"
    ],
    required: true
  },
  amount: { type: Number, required: true, min: 0 },
  referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("CashTransaction", cashTransactionSchema);

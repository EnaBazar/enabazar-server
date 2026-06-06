import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  lotNo: { type: String, required: true, trim: true },
  expenseParty: { type: String, default: "" },
  type: {
    type: String,
    enum: ["transport", "loading", "unloading", "labour", "commission", "rent", "market_cost", "other"],
    required: true
  },
  amount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  dueAmount: { type: Number, default: 0, min: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);

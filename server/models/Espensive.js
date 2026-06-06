import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  lotNo: { type: String, required: true },
  type: {
    type: String,
    enum: ["transport", "loading", "unloading", "labour", "commission", "rent", "other"],
    required: true
  },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
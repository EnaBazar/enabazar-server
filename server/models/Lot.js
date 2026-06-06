import mongoose from "mongoose";

const lotSchema = new mongoose.Schema({
  lotNo: { type: String, required: true, unique: true, trim: true },
  purchaseKg: { type: Number, default: 0 },
  soldKg: { type: Number, default: 0 },
  purchaseAmount: { type: Number, default: 0 },
  expenseAmount: { type: Number, default: 0 },
  salesAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, { timestamps: true });

lotSchema.virtual("stockKg").get(function () {
  return this.purchaseKg - this.soldKg;
});

lotSchema.virtual("profitLoss").get(function () {
  return this.salesAmount - this.purchaseAmount - this.expenseAmount;
});

lotSchema.set("toJSON", { virtuals: true });
lotSchema.set("toObject", { virtuals: true });

export default mongoose.model("Lot", lotSchema);

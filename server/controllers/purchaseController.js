import Purchase from "../models/Purchase.js";
import Lot from "../models/Lot.js";
import CashTransaction from "../models/CashTransaction.js";

export const createPurchase = async (req, res) => {
  try {
    const { supplier, lotNo, kg, rate, paidAmount = 0, date, note = "" } = req.body;
    const totalAmount = Number(kg) * Number(rate);
    const dueAmount = totalAmount - Number(paidAmount);

    const purchase = await Purchase.create({ supplier, lotNo, kg, rate, totalAmount, paidAmount, dueAmount, date, note });

    await Lot.findOneAndUpdate(
      { lotNo },
      { $inc: { purchaseKg: Number(kg), purchaseAmount: totalAmount } },
      { upsert: true, new: true, runValidators: true }
    );

    if (Number(paidAmount) > 0) {
      await CashTransaction.create({ date, type: "out", source: "purchase", amount: paidAmount, referenceId: purchase._id, note: `Purchase paid for lot ${lotNo}` });
    }

    res.status(201).json({ success: true, error: false, message: "Purchase created", data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("supplier", "name mobile").sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate("supplier", "name mobile");
    if (!purchase) return res.status(404).json({ success: false, error: true, message: "Purchase not found" });
    res.status(200).json({ success: true, error: false, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

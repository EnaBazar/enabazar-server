import Sale from "../models/Sale.js";
import Lot from "../models/Lot.js";
import CashTransaction from "../models/CashTransaction.js";

export const createSale = async (req, res) => {
  try {
    const { mokam, lotNo, kg, rate, receivedAmount = 0, date, note = "" } = req.body;
    const lot = await Lot.findOne({ lotNo });

    if (!lot) return res.status(404).json({ success: false, error: true, message: "Lot not found" });

    const stockKg = lot.purchaseKg - lot.soldKg;
    if (Number(kg) > stockKg) {
      return res.status(400).json({ success: false, error: true, message: `Only ${stockKg} kg stock available in this lot` });
    }

    const totalAmount = Number(kg) * Number(rate);
    const dueAmount = totalAmount - Number(receivedAmount);
    const sale = await Sale.create({ mokam, lotNo, kg, rate, totalAmount, receivedAmount, dueAmount, date, note });

    lot.soldKg += Number(kg);
    lot.salesAmount += totalAmount;
    await lot.save();

    if (Number(receivedAmount) > 0) {
      await CashTransaction.create({ date, type: "in", source: "sale", amount: receivedAmount, referenceId: sale._id, note: `Sale received for lot ${lotNo}` });
    }

    res.status(201).json({ success: true, error: false, message: "Sale created", data: sale });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("mokam", "name mobile").sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

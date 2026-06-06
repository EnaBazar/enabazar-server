import Expense from "../models/Expense.js";
import Lot from "../models/Lot.js";
import CashTransaction from "../models/CashTransaction.js";

export const createExpense = async (req, res) => {
  try {
    const { date, lotNo, expenseParty = "", type, amount, paidAmount = 0, note = "" } = req.body;
    const dueAmount = Number(amount) - Number(paidAmount);
    const expense = await Expense.create({ date, lotNo, expenseParty, type, amount, paidAmount, dueAmount, note });

    await Lot.findOneAndUpdate({ lotNo }, { $inc: { expenseAmount: Number(amount) } }, { upsert: true, new: true, runValidators: true });

    if (Number(paidAmount) > 0) {
      await CashTransaction.create({ date, type: "out", source: "expense", amount: paidAmount, referenceId: expense._id, note: `Expense paid for lot ${lotNo}` });
    }

    res.status(201).json({ success: true, error: false, message: "Expense created", data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

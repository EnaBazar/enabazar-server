import CashTransaction from "../models/CashTransaction.js";
import BankTransaction from "../models/BankTransaction.js";

export const createCashTransaction = async (req, res) => {
  try {
    const transaction = await CashTransaction.create(req.body);
    res.status(201).json({ success: true, error: false, message: "Cash transaction created", data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getCashTransactions = async (req, res) => {
  try {
    const transactions = await CashTransaction.find().sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const createBankTransaction = async (req, res) => {
  try {
    const { date, type, bankName, accountNo, amount, note = "" } = req.body;
    const bank = await BankTransaction.create({ date, type, bankName, accountNo, amount, note });

    await CashTransaction.create({
      date,
      type: type === "deposit" ? "out" : "in",
      source: type === "deposit" ? "bank_deposit" : "bank_withdraw",
      amount,
      referenceId: bank._id,
      note: note || `Bank ${type}`
    });

    res.status(201).json({ success: true, error: false, message: "Bank transaction created", data: bank });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getBankTransactions = async (req, res) => {
  try {
    const transactions = await BankTransaction.find().sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

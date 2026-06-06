import Loan from "../models/Loan.js";
import CashTransaction from "../models/CashTransaction.js";

export const createLoan = async (req, res) => {
  try {
    const { date, personName, mobile = "", address = "", type, amount, note = "" } = req.body;
    const loan = await Loan.create({ date, personName, mobile, address, type, amount, note });

    await CashTransaction.create({
      date,
      type: type === "receive" ? "in" : "out",
      source: type === "receive" ? "loan_receive" : "loan_payment",
      amount,
      referenceId: loan._id,
      note: note || `Loan ${type}`
    });

    res.status(201).json({ success: true, error: false, message: "Loan entry created", data: loan });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ date: -1 });
    res.status(200).json({ success: true, error: false, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

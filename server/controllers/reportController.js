import Supplier from "../models/Supplier.js";
import Mokam from "../models/Mokam.js";
import Purchase from "../models/Purchase.js";
import Sale from "../models/Sale.js";
import Expense from "../models/Expense.js";
import Collection from "../models/Collection.js";
import Loan from "../models/Loan.js";
import Lot from "../models/Lot.js";
import CashTransaction from "../models/CashTransaction.js";
import BankTransaction from "../models/BankTransaction.js";

const sum = (items, field) => items.reduce((total, item) => total + Number(item[field] || 0), 0);

export const getDashboard = async (req, res) => {
  try {
    const [suppliers, mokams, purchases, sales, expenses, collections, loans, lots, cashTransactions, bankTransactions] = await Promise.all([
      Supplier.find(), Mokam.find(), Purchase.find(), Sale.find(), Expense.find(), Collection.find(), Loan.find(), Lot.find(), CashTransaction.find(), BankTransaction.find()
    ]);

    const totalPurchase = sum(purchases, "totalAmount");
    const purchasePaid = sum(purchases, "paidAmount");
    const supplierOpeningDue = sum(suppliers, "openingDue");
    const totalSales = sum(sales, "totalAmount");
    const salesReceived = sum(sales, "receivedAmount");
    const mokamOpeningDue = sum(mokams, "openingDue");
    const totalExpense = sum(expenses, "amount");
    const expensePaid = sum(expenses, "paidAmount");
    const totalCollection = sum(collections, "amount");

    const loanReceive = loans.filter((item) => item.type === "receive").reduce((total, item) => total + Number(item.amount || 0), 0);
    const loanPayment = loans.filter((item) => item.type === "payment").reduce((total, item) => total + Number(item.amount || 0), 0);
    const cashIn = cashTransactions.filter((item) => item.type === "in").reduce((total, item) => total + Number(item.amount || 0), 0);
    const cashOut = cashTransactions.filter((item) => item.type === "out").reduce((total, item) => total + Number(item.amount || 0), 0);
    const bankDeposit = bankTransactions.filter((item) => item.type === "deposit").reduce((total, item) => total + Number(item.amount || 0), 0);
    const bankWithdraw = bankTransactions.filter((item) => item.type === "withdraw").reduce((total, item) => total + Number(item.amount || 0), 0);

    res.status(200).json({
      success: true,
      error: false,
      data: {
        currentStock: lots.reduce((total, lot) => total + Number(lot.purchaseKg - lot.soldKg), 0),
        totalPurchase,
        totalSales,
        totalExpense,
        totalCollection,
        supplierDue: supplierOpeningDue + totalPurchase - purchasePaid,
        mokamDue: mokamOpeningDue + totalSales - salesReceived - totalCollection,
        expenseDue: totalExpense - expensePaid,
        loanDue: loanReceive - loanPayment,
        cashBalance: cashIn - cashOut,
        bankBalance: bankDeposit - bankWithdraw,
        profit: totalSales - totalPurchase - totalExpense
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getStockReport = async (req, res) => {
  try {
    const lots = await Lot.find().sort({ createdAt: -1 });
    const data = lots.map((lot) => ({ lotNo: lot.lotNo, purchaseKg: lot.purchaseKg, soldKg: lot.soldKg, stockKg: lot.purchaseKg - lot.soldKg, status: lot.status }));
    res.status(200).json({ success: true, error: false, data });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getLotProfitReport = async (req, res) => {
  try {
    const lots = await Lot.find().sort({ createdAt: -1 });
    const data = lots.map((lot) => ({
      lotNo: lot.lotNo,
      purchaseKg: lot.purchaseKg,
      soldKg: lot.soldKg,
      stockKg: lot.purchaseKg - lot.soldKg,
      purchaseAmount: lot.purchaseAmount,
      expenseAmount: lot.expenseAmount,
      salesAmount: lot.salesAmount,
      profitLoss: lot.salesAmount - lot.purchaseAmount - lot.expenseAmount
    }));
    res.status(200).json({ success: true, error: false, data });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getSupplierDueReport = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    const purchases = await Purchase.find();
    const data = suppliers.map((supplier) => {
      const supplierPurchases = purchases.filter((item) => String(item.supplier) === String(supplier._id));
      const totalPurchase = sum(supplierPurchases, "totalAmount");
      const paid = sum(supplierPurchases, "paidAmount");
      return { supplierId: supplier._id, name: supplier.name, mobile: supplier.mobile, openingDue: supplier.openingDue, totalPurchase, paid, due: Number(supplier.openingDue || 0) + totalPurchase - paid };
    });
    res.status(200).json({ success: true, error: false, data });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

export const getMokamDueReport = async (req, res) => {
  try {
    const mokams = await Mokam.find().sort({ name: 1 });
    const sales = await Sale.find();
    const collections = await Collection.find();
    const data = mokams.map((mokam) => {
      const mokamSales = sales.filter((item) => String(item.mokam) === String(mokam._id));
      const mokamCollections = collections.filter((item) => String(item.mokam) === String(mokam._id));
      const totalSales = sum(mokamSales, "totalAmount");
      const received = sum(mokamSales, "receivedAmount") + sum(mokamCollections, "amount");
      return { mokamId: mokam._id, name: mokam.name, mobile: mokam.mobile, openingDue: mokam.openingDue, totalSales, received, due: Number(mokam.openingDue || 0) + totalSales - received };
    });
    res.status(200).json({ success: true, error: false, data });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};

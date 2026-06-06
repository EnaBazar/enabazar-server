import express from "express";
import { createBankTransaction, createCashTransaction, getBankTransactions, getCashTransactions } from "../controllers/cashController.js";

const router = express.Router();
router.route("/cash").post(createCashTransaction).get(getCashTransactions);
router.route("/bank").post(createBankTransaction).get(getBankTransactions);
export default router;

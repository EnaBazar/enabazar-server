import express from "express";
import { getDashboard, getLotProfitReport, getMokamDueReport, getStockReport, getSupplierDueReport } from "../controllers/reportController.js";

const router = express.Router();
router.get("/dashboard", getDashboard);
router.get("/stock", getStockReport);
router.get("/lot-profit", getLotProfitReport);
router.get("/supplier-due", getSupplierDueReport);
router.get("/mokam-due", getMokamDueReport);
export default router;

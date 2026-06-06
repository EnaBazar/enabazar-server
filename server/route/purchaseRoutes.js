import express from "express";
import { createPurchase, getPurchase, getPurchases } from "../controllers/purchaseController.js";

const router = express.Router();
router.route("/").post(createPurchase).get(getPurchases);
router.route("/:id").get(getPurchase);
export default router;

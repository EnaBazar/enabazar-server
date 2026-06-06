import express from "express";
import { createLoan, getLoans } from "../controllers/loanController.js";

const router = express.Router();
router.route("/").post(createLoan).get(getLoans);
export default router;

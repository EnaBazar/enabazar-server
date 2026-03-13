import express from "express";
import { getReport } from "../controllers/reportController.js";
;


const reportrouter = express.Router();

reportrouter.get("/report", getReport);

export default reportrouter;
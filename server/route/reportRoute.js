import express from "express";
import { getAnalytics, getSalesList} from "../controllers/reportController.js";
;


const reportrouter = express.Router();

reportrouter.get("/report", getAnalytics);

reportrouter.get("/saleslist", getSalesList);
export default reportrouter;
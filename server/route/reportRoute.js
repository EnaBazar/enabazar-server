import express from "express";
import { getAnalytics} from "../controllers/reportController.js";
;


const reportrouter = express.Router();

reportrouter.get("/report", getAnalytics);

export default reportrouter;
import express from "express";
import { createCollection, getCollections } from "../controllers/collectionController.js";

const router = express.Router();
router.route("/").post(createCollection).get(getCollections);
export default router;

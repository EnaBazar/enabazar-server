import express from "express";
import {
  sendMessage,
  getAllChats,
  getCustomerChats,
  markChatsAsRead,
} from "../controllers/chat.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Customer routes (protected)
router.post("/send", auth, sendMessage);
router.get("/customer/:customerId", auth, getCustomerChats);
router.post("/read/:customerId", auth, markChatsAsRead);

// Admin routes (optional: protected by admin auth)
router.get("/admin/all", auth, getAllChats);

export default router;

import express from "express";
import {
  sendMessage,
  getAllChats,
  getCustomerChats,
  markChatsAsRead,
  audioUploadMiddleware, // ✅ ADD
} from "../controllers/chat.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ================= TEXT MESSAGE =================
router.post("/send", auth, sendMessage);

// ================= AUDIO MESSAGE =================


// ================= CUSTOMER =================
router.get("/customer/:customerId", auth, getCustomerChats);
router.post("/read/:customerId", auth, markChatsAsRead);

// ================= ADMIN =================
router.get("/admin/all", auth, getAllChats);

export default router;

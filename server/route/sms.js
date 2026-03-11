
import express from "express";
import sendSMSorder from "../utils/sendSMSorder.js";

const smsRoutes = express.Router();

// Customer Order SMS
smsRoutes.post("/order-confirm", async (req, res) => {

  const { mobile, name, orderId, total } = req.body;

  const message = `হ্যালো ${name}, আপনার অর্ডার #${orderId} সফলভাবে গ্রহণ করা হয়েছে। মোট টাকা: ৳${total}। ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য।`;

  const result = await sendSMSorder(mobile, message);

  res.json(result);

});

// Admin Notification
smsRoutes.post("/admin-order", async (req, res) => {

  const { orderId, total } = req.body;

  const adminNumber = "8801674847446";

  const message = `নতুন অর্ডার এসেছে! Order ID: ${orderId}, Amount: ৳${total}`;

  const result = await sendSMSorder(adminNumber, message);

  res.json(result);

});

export default smsRoutes;
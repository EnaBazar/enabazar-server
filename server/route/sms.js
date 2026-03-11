import express from "express";
import dotenv from "dotenv";
dotenv.config();
import sendSMSorder from "../utils/sendSMSorder.js";

const smsRoutes = express.Router();

smsRoutes.post("/order-confirm", async (req, res) => {

  const { mobile, name, orderId, total, products, address } = req.body;

  const productList = products
    .map(p => `${p.productTitle}(${p.quantity})`)
    .join(", ");

  // ✅ Customer SMS
  const customerMessage = `হ্যালো ${name},
অর্ডার#${orderId}
পণ্য: ${productList}
ডেলিভারি: ${address}
মোট: ৳${total}
ধন্যবাদ।`;


  await sendSMSorder(mobile, customerMessage);


  // ✅ Admin SMS
  const adminMessage = `নতুন অর্ডার এসেছে!

অর্ডার#: ${orderId}
Customer: ${name}
পণ্য: ${productList}
মোট: ৳${total}
ডেলিভারি: ${address}`;

  await sendSMSorder(process.env.ADMIN_MOBILE, adminMessage);

  res.json({
    success: true,
    message: "SMS Sent"
  });

});

export default smsRoutes;
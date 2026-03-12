const express = require("express");
const router = express.Router();
const axios = require("axios");


const customerSmSrouter = express.Router();
customerSmSrouter.post("/customerSmSsend", async (req, res) => {
  const { mobile, message } = req.body;
  if (!mobile || !message) {
    return res.status(400).json({ success: false, message: "Mobile & message required" });
  }

  let phone = mobile.replace("+", "");
  if (phone.startsWith("01")) phone = "88" + phone;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://bulksmsdhaka.net/api/sendtext?apikey=b65bf467f3282df00975768237e81ce765830322&callerID=1234&number=${phone}&message=${encodedMessage}`;

  try {
    const response = await axios.get(url);
    console.log("BulkSMS API Response:", response.data);

   
    if (response.data?.status === "success") {
      res.json({ success: true, message: response.data.message });
    } else {
      res.json({ success: false, message: response.data?.message || "SMS Send failed" });
    }
  } catch (err) {
    console.log("SMS sending failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default customerSmSrouter;
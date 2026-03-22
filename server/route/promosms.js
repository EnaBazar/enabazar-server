// backend/routes/sms.js
import express from "express";
import fetch from "node-fetch";

const smsRouter = express.Router();

// POST /api/sendBulkSMS
smsRouter.post("/sendBulkSMS", async (req, res) => {
  try {
    const { mobiles, message } = req.body;

    if (!mobiles || mobiles.length === 0) {
      return res.status(400).json({ success: false, message: "No mobile numbers provided." });
    }
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is empty." });
    }

    const apiKey = "b65bf467f3282df00975768237e81ce765830322";
    const callerID = "1234";

    // Loop through mobiles and send SMS
    const results = [];
    for (let mobile of mobiles) {
      const formattedNumber = mobile.startsWith("0") ? "+88" + mobile : mobile;
      const url = `https://bulksmsdhaka.net/api/sendtext?apikey=${apiKey}&callerID=${callerID}&number=${formattedNumber}&message=${encodeURIComponent(message)}`;

      try {
        const response = await fetch(url);
        const data = await response.json(); // API JSON response
        results.push({ mobile, success: data.success || false, response: data });
      } catch (err) {
        results.push({ mobile, success: false, response: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `SMS send complete. Success: ${successCount}/${mobiles.length}`,
      details: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while sending SMS." });
  }
});

export default smsRouter;
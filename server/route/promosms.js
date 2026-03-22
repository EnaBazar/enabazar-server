// backend/routes/promosms.js
import express from "express";

const smsRouter = express.Router();

// POST /api/sendBulkSMS
// body: { mobiles: [Array of numbers], message: "Custom message" }
smsRouter.post("/sendBulkSMS", async (req, res) => {
  try {
    const { mobiles, message } = req.body;

    if (!mobiles || !Array.isArray(mobiles) || mobiles.length === 0) {
      return res.status(400).json({ success: false, message: "No mobile numbers provided." });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message is empty." });
    }

    const apiKey = "b65bf467f3282df00975768237e81ce765830322"; // আপনার API key
    const callerID = "1234";

    const results = [];

    for (let mobile of mobiles) {
      // Format number for Bangladesh (+88)
      const formattedNumber = mobile.startsWith("0") ? "+88" + mobile : mobile;
      const url = `https://bulksmsdhaka.net/api/sendtext?apikey=${apiKey}&callerID=${callerID}&number=${formattedNumber}&message=${encodeURIComponent(message)}`;

      try {
        const response = await fetch(url);
        const data = await response.json(); // API returns JSON
        results.push({ mobile, success: data.success || false, response: data });
      } catch (err) {
        results.push({ mobile, success: false, response: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return res.json({
      success: true,
      message: `SMS sending complete. Success: ${successCount}/${mobiles.length}`,
      details: results
    });

  } catch (error) {
    console.error("SMS sending error:", error);
    return res.status(500).json({ success: false, message: "Server error while sending SMS." });
  }
});


export default smsRouter;
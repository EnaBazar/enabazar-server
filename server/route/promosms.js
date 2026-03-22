// backend/routes/promosms.js
import express from "express";
import fetch from "node-fetch";

const smsRouter = express.Router();

// POST /promosms/sendBulkSMS
// body: { mobiles: [Array of numbers], message: "Custom message" }
smsRouter.post("/sendBulkSMS", async (req, res) => {
  try {
    const { mobiles, message } = req.body;

    // Validation
    if (!mobiles || !Array.isArray(mobiles) || mobiles.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No mobile numbers provided." });
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

      const url = `https://bulksmsdhaka.net/api/sendtext?apikey=${apiKey}&callerID=${callerID}&number=${formattedNumber}&message=${encodeURIComponent(
        message
      )}`;

      try {
        const response = await fetch(url);

        // Try to parse JSON; fallback to raw text
        let data;
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { success: text.toLowerCase().includes("success"), raw: text };
        }

        const success = data.success === true || data.success === "true";
        results.push({ mobile, success, response: data });

        console.log(`SMS to ${mobile}:`, success ? "Success" : "Failed", data);
      } catch (err) {
        results.push({ mobile, success: false, response: err.message });
        console.error(`Error sending SMS to ${mobile}:`, err.message);
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return res.json({
      success: true,
      message: `SMS sending complete. Success: ${successCount}/${mobiles.length}`,
      details: results,
    });
  } catch (error) {
    console.error("SMS sending server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while sending SMS." });
  }
});

export default smsRouter;
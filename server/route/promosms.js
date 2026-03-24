// backend/routes/promosms.js
import express from "express";

const smsRouter = express.Router();

// POST /promosms/sendBulkSMS
// body: { smsList: [{ mobile, message }] }

smsRouter.post("/sendBulkSMS", async (req, res) => {
  try {
    const { smsList } = req.body;

    // Validation
    if (!smsList || !Array.isArray(smsList) || smsList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No SMS data provided.",
      });
    }

    const apiKey = "b65bf467f3282df00975768237e81ce765830322";
    const callerID = "1234";

    const results = [];

    for (let item of smsList) {
      const { mobile, message } = item;

      if (!mobile || !message) continue;

      // Bangladesh format
      const formattedNumber = mobile.startsWith("0")
        ? "+88" + mobile
        : mobile;

      const url = `https://bulksmsdhaka.net/api/sendtext?apikey=${apiKey}&callerID=${callerID}&number=${formattedNumber}&message=${encodeURIComponent(
        message
      )}`;

      try {
        const response = await fetch(url);

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = {
            success: text.toLowerCase().includes("success"),
            raw: text,
          };
        }

        const success =
          data.success === true || data.success === "true";

        results.push({
          mobile,
          success,
          response: data,
        });

        console.log(
          `SMS to ${mobile}:`,
          success ? "Success" : "Failed"
        );
      } catch (err) {
        results.push({
          mobile,
          success: false,
          response: err.message,
        });

        console.error(
          `Error sending SMS to ${mobile}:`,
          err.message
        );
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return res.json({
      success: true,
      message: `SMS sending complete. Success: ${successCount}/${smsList.length}`,
      details: results,
    });
  } catch (error) {
    console.error("SMS sending server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending SMS.",
    });
  }
});

export default smsRouter;
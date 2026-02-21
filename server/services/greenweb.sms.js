import axios from "axios";

export const sendGreenwebSMS = async (to, message) => {
  try {
    const res = await axios.post(
      "https://api.bdbulksms.net/api.php?json",
      {
        token: process.env.GREENWEB_TOKEN,
        senderid: process.env.GREENWEB_SENDER_ID,
        to,
        message,
      },
      { timeout: 10000 } // 10 sec wait
    );

    console.log("Greenweb Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Greenweb Error:", error.response?.data || error.message);
    throw error;
  }
};

import axios from "axios";

export const sendSMS = async (mobile, otp) => {
  try {
    const response = await axios.post(
      "https://api.sms.net.bd/sendsms",
      new URLSearchParams({
        api_key: process.env.SMS_API_KEY,
        msg: `Enabazar OTP: ${otp}. Do not share this code.`,
        to: mobile
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("SMS Response:", response.data);
    return response.data;

  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
    throw error;
  }
};
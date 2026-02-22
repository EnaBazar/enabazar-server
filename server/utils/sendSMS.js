import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    await axios.post("https://api.sms.net.bd/sendsms", null, {
      params: {
        api_key: process.env.SMS_API_KEY,
        msg: `Your OTP is ${otp}`,
        to: mobile
      }
    });

    return true;
  } catch (error) {
    console.log("SMS Error:", error.message);
    return false;
  }
};

export default sendSMS;
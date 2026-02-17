import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {

    // 017 → 88017 বানাবে
    if (mobile.startsWith("0")) {
      mobile = "880" + mobile.slice(1);
    }

    const response = await axios.get(
      "https://api.greenweb.com.bd/api.php",
      {
        params: {
          token: process.env.GREEN_WEB_API_KEY,
          to: mobile,
          message: `Your OTP is ${otp}`
        }
      }
    );

    console.log("SMS RESULT:", response.data);

    return true;

  } catch (error) {
    console.log("SMS ERROR:", error.message);
    return false;
  }
};

export default sendSMS;

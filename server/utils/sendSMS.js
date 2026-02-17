import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    // Mobile format 017XXXX → 88017XXXX
    if (mobile.startsWith("0")) mobile = "880" + mobile.slice(1);

    const greenwebsms = new URLSearchParams();
    greenwebsms.append("token", process.env.GREEN_WEB_API_KEY); // Green Web token
    greenwebsms.append("to", mobile);
    greenwebsms.append("message", `Your OTP is ${otp}`);

    const response = await axios.post(
      "https://api.bdbulksms.net/api.php",
      greenwebsms,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("SMS RESPONSE:", response.data);
    return true;
  } catch (error) {
    console.error("SMS ERROR:", error.response?.data || error.message);
    return false;
  }
};

export default sendSMS;

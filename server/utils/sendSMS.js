import axios from "axios";

export const sendSMS = async (mobile, otp) => {
  try {
    const params = new URLSearchParams();
    params.append("token", process.env.GREENWEB_TOKEN);
    params.append("to", mobile);
    params.append("message", `Your OTP is ${otp}`);

    const response = await axios.post(
      "https://api.bdbulksms.net/api.php",
      params
    );

    console.log("SMS Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    return false;
  }
};
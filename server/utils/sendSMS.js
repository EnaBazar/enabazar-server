import axios from "axios";

const sendSMS = async (mobile, message) => {
  try {
    if (!mobile || !message) {
      throw new Error("Mobile and message are required");
    }

    const params = new URLSearchParams();
    params.append("token", process.env.GREENWEB_TOKEN);
    params.append("to", mobile);
    params.append("message", message);

    const response = await axios.post(
      "https://api.greenweb.com.bd/api.php",
      params
    );

    return response.data;

  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    return false;
  }
};

export default sendSMS;
import axios from "axios";

const sendSMS = async (mobile, message) => {
  try {

    // 🔹 Mobile format ঠিক করা ( + থাকলে remove )
    mobile = mobile.replace("+", "");

    const url = `http://api.greenweb.com.bd/api.php?token=${process.env.GREENWEB_TOKEN}&to=${mobile}&message=${encodeURIComponent(message)}`;

    console.log("SMS URL:", url); // debug

    const response = await axios.get(url);

    console.log("SMS Response:", response.data);

    return response.data;

  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
    return false;
  }
};

export default sendSMS;
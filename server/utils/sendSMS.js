import axios from "axios";

const sendSMS = async (mobile, message) => {
  try {

    mobile = mobile.replace("+", "");

    if (mobile.startsWith("01")) {
      mobile = "88" + mobile;
    }

    const url = `https://bulksmsdhaka.net/api/otpsend?apikey=b65bf467f3282df00975768237e81ce765830322&callerID=1234&number=${mobile}&message=Your OTP is ${otp}`;

    console.log("Final URL:", url);

    const response = await axios.get(url);

    console.log("SMS Response:", response.data);

    return response.data;

  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
    return false;
  }
};

export default sendSMS;
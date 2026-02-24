import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    // Mobile normalize: +88 or 88
    mobile = mobile.replace("+", "");
    if (mobile.startsWith("01")) {
      mobile = "88" + mobile;
    }

    // Web OTP compatible message
    const message = `<#> Your OTP is ${otp}\nExampleApp verification\nFA+7x9kLmnoP`;

    const url = `https://bulksmsdhaka.net/api/otpsend?apikey=b65bf467f3282df00975768237e81ce765830322&callerID=1234&number=${mobile}&message=${encodeURIComponent(
      message
    )}`;

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
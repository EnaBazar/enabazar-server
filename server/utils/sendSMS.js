import axios from "axios";

const sendSMS = async (mobile, message) => {
  try {

    mobile = mobile.replace("+", "");

    if (mobile.startsWith("01")) {
      mobile = "88" + mobile;
    }

    const url = `${process.env.GREENWEB_API_URL}?token=${process.env.GREENWEB_TOKEN}&to=${mobile}&message=${encodeURIComponent(message)}`;

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
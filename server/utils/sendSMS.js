import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {

    let formattedMobile = mobile;

    // 017XXXXXXXX → 88017XXXXXXXX
    if (mobile.startsWith("0")) {
      formattedMobile = "880" + mobile.substring(1);
    }

   
    console.log("SMS URL:", url);

    const response = await axios.get(url);

    console.log("SMS Response:", response.data);

    return response.data;

  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
    return false;
  }
};

export default sendSMS;

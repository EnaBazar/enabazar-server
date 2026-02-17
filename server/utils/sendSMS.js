import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    const response = await axios.get(
      `http://api.greenweb.com.bd/api.php?token=${process.env.GREENWEB_TOKEN}&to=${mobile}&message=Your OTP is ${otp}`
    );

    return response.data;
  } catch (error) {
    console.log("SMS Error:", error.message);
    return false;
  }
};

export default sendSMS;

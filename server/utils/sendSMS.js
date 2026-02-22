import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    const response = await axios.get(
      `https://api.sms.net.bd/sendsms?token=${process.env.SMS_API_KEY }&to=${mobile}&message=Your OTP is ${otp}`
    );

    return response.data;
  } catch (error) {
    console.log("SMS Error:", error.message);
    return false;
  }
};

export default sendSMS;

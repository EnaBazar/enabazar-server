import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    if (!process.env.SMS_API_KEY) {
      throw new Error("SMS_API_KEY is not defined in environment variables");
    }

    const message = encodeURIComponent(`Your OTP is ${otp}`);

    const url = `https://api.bdbulksms.net/api.php?token=${process.env.SMS_API_KEY}&to=${mobile}&message=${message}`;

    const response = await axios.get(url);

    if (response.data) {
      console.log(`OTP sent to ${mobile}: ${otp}`);
      return response.data;
    } else {
      console.log(`Failed to send OTP to ${mobile}`);
      return false;
    }
  } catch (error) {
    console.error("SMS Error:", error.message);
    return false;
  }
};

export { sendSMS };
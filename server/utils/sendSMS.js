import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    if (!process.env.SMS_API_KEY) {
      throw new Error("SMS_API_KEY is not defined in environment variables");
    }

    const message = encodeURIComponent(`Your OTP is ${otp}`);

    const url = `https://api.bdbulksms.net/api.php?token=1310419322517704711457bef66f552f9ed3565718ed5fbb807b1&to=${mobile}&message=test%20massage`;

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
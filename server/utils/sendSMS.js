import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {
    const response = await axios.get(
      `http://api.bdbulksms.net/api.php?token=1310419322517704711457bef66f552f9ed3565718ed5fbb807b1&to=${mobile}&message=Your OTP is ${otp}`
    );

    return response.data;
  } catch (error) {
    console.log("SMS Error:", error.message);
    return false;
  }
};

export default sendSMS;

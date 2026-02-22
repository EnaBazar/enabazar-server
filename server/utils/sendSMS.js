import axios from "axios";




const sendSMS = async (mobile, otp) => {
  try {
    const token = process.env.GREENWEB_TOKEN;
    const message = encodeURIComponent(`Your OTP is ${otp}`);
    const url = `https://api.bdbulksms.net/api.php?token=${token}&to=${mobile}&message=${message}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("SMS Error:", error.message);
    return false;
  }
};

export default sendSMS;

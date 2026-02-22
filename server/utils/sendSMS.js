import axios from "axios";

const sendSMS = async (mobile, otp) => {
  try {

    // বাংলাদেশ format ঠিক করা
    const formattedMobile = mobile.startsWith("+88")
      ? mobile
      : `+88${mobile}`;

    const response = await axios.post(
      "http://api.bdbulksms.net/api.php",
      new URLSearchParams({
        token: process.env.GREENWEB_TOKEN ,
        to: formattedMobile,
        message: `Your OTP is ${otp}`
      })
    );

    console.log("SMS Response:", response.data);

    return true;

  } catch (error) {
    console.log("SMS Error:", error.message);
    return false;
  }
};

export default sendSMS;
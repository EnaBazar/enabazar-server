import axios from "axios";

const sendSMS = async (mobile, message) => {
  try {
    const greenwebsms = new URLSearchParams();
    greenwebsms.append("token", process.env.GREENWEB_TOKEN ); // save token in .env
    greenwebsms.append("to", mobile);
    greenwebsms.append("message", message);

    const response = await axios.post(
      "https://api.bdbulksms.net/api.php",
      greenwebsms.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("SMS Response:", response.data);
    return true;
  } catch (error) {
    console.error("SMS Sending Error:", error.message || error);
    return false;
  }
};

export default sendSMS;
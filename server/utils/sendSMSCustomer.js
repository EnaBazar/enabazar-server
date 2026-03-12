import axios from "axios";

const sendSMSCustomer = async (mobile, message) => {
  try {
    // Normalize mobile
    mobile = mobile.replace("+", "");
    if (mobile.startsWith("01")) mobile = "88" + mobile;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://bulksmsdhaka.net/api/sendtext?apikey=b65bf467f3282df00975768237e81ce765830322&callerID=1234&number=${mobile}&message=${encodedMessage}`;

    const response = await axios.get(url);

    console.log("SMS API Response:", response.data);

    // Check response format
    // BulkSMSDhaka usually returns JSON like { "status": "success", "message": "SMS sent" }
    if (response.data?.status === "success") {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data?.message || "SMS failed" };
    }
  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
    return { success: false, message: error.message };
  }
};

export default sendSMSCustomer;
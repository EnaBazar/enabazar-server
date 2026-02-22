import axios from 'axios';

export const sendSMS = async (mobile, otp) => {
  const smsData = new URLSearchParams();
  smsData.append('token', '1310419322517704711457bef66f552f9ed3565718ed5fbb807b1'); // Replace with your actual token
  smsData.append('to', mobile);
  smsData.append('message', `Your OTP is: ${otp}`);

  try {
    await axios.post('https://api.bdbulksms.net/api.php', smsData);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
import axios from 'axios';

export const sendSMS = async (mobile, otp) => {
  const smsData = new URLSearchParams();
  smsData.append('token', 'yourtokenhere'); // Replace with your actual token
  smsData.append('to', mobile);
  smsData.append('message', `Your OTP is: ${otp}`);

  try {
    await axios.post('https://api.bdbulksms.net/api.php', smsData);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
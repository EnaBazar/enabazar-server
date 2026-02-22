import axios from 'axios';

export const sendSMS = async (mobile, otp) => {
  const smsData = new URLSearchParams();
  smsData.append('token', 'g8liCEnoNfgwMK3GN6JRste6q0fQDIyTBPn7c8qn'); // Replace with your actual token
  smsData.append('to', mobile);
  smsData.append('message', `Your OTP is: ${otp}`);

  try {
    await axios.post('https://api.sms.net.bd/sendsms', smsData);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
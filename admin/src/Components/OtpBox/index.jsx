import React, { useState } from 'react';

const OtpBox = ({ length, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element, index) => {
    const value = element.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move to next input
    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className='otpBox flex flex-wrap justify-center gap-2 sm:gap-3'>
      {otp.map((data, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type='text'
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className='w-12 sm:w-14 h-12 sm:h-14 text-center text-lg sm:text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
        />
      ))}
    </div>
  );
};

export default OtpBox;

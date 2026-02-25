import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const VerifyOtpPanel = () => {
  const context = useContext(MyContext);
  const mobile = context.otpData?.mobile; // Context থেকে ফোন নাম্বার

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  // OTP verify
  const handleVerify = async () => {
    if (!mobile) {
      context.openAlertBox("error", "Mobile number missing!");
      return;
    }

    if (otp.length !== 6) {
      context.openAlertBox("error", "Please enter 6-digit OTP");
      return;
    }

    setIsLoading(true);

    const payload = {
      mobile: mobile.toString(), // string হিসেবে পাঠাও
      otp: otp.toString(),
    };

    console.log("Sending OTP verify request:", payload);

    const res = await postData("https://api.goroabazar.com/auth/verify-otp", payload);

    setIsLoading(false);

    if (!res?.error) {
      context.openAlertBox("success", "আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!");
      context.closeOtpPanel();
      
    } else {
      context.openAlertBox("error", res?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const res = await postData("https://api.goroabazar.com/auth/resend-otp", {
      mobile: mobile.toString(),
    });
    setIsLoading(false);

    if (!res?.error) {
      context.openAlertBox("success", "নতুন OTP পাঠানো হয়েছে!");
      setSeconds(60);
      setCanResend(false);
    } else {
      context.openAlertBox("error", res?.message || "Failed to resend OTP");
    }
  };

  if (!context.openVerifyOtpPanel) return null; // panel বন্ধ থাকলে কিছু দেখাবে না

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto", background: "#fff", borderRadius: 8 }}>
      <h3>Verify OTP for {mobile}</h3>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        maxLength={6}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify} disabled={isLoading}>
        {isLoading ? "Loading..." : "Verify"}
      </button>

      {canResend ? (
        <button onClick={handleResend} disabled={isLoading}>Resend OTP</button>
      ) : (
        <p>Resend in {seconds}s</p>
      )}

      <button onClick={context.closeOtpPanel}>Cancel</button>
    </div>
  );
};

export default VerifyOtpPanel;
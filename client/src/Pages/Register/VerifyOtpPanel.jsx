// VerifyOtpPanel.jsx
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const VerifyOtpPanel = () => {
  const context = useContext(MyContext);
  const mobile = context?.otpData?.mobile || "";

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown
  useEffect(() => {
    if (!context?.openVerifyOtpPanel) return;
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else setCanResend(true);
  }, [seconds, context?.openVerifyOtpPanel]);

  const handleVerify = async () => {
    if (otp.length !== 6) return context.openAlertBox("error", "6-digit OTP লাগবে");

    setIsLoading(true);
    try {
      const res = await postData("/auth/verify-update-mobile", { mobile, otp });
      setIsLoading(false);

      if (!res.error) {
        context.openAlertBox("success", res.message);
        context.closeOtpPanel();
        window.location.reload();
      } else {
        context.openAlertBox("error", res.message);
      }
    } catch (err) {
      setIsLoading(false);
      context.openAlertBox("error", "Server error");
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await postData("/auth/resend-otp", { mobile });
      setIsLoading(false);
      if (!res.error) {
        context.openAlertBox("success", "নতুন OTP পাঠানো হয়েছে!");
        setSeconds(60);
        setCanResend(false);
      } else context.openAlertBox("error", res.message);
    } catch {
      setIsLoading(false);
      context.openAlertBox("error", "Server error");
    }
  };

  if (!context.openVerifyOtpPanel) return null;

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto", background: "#fff", borderRadius: 8 }}>
      <h3>Verify OTP for {mobile}</h3>
      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter 6-digit OTP"
        style={{ width: "100%", padding: 10, margin: "15px 0" }}
      />
      <button onClick={handleVerify} disabled={isLoading}>{isLoading ? "Verifying..." : "Verify"}</button>
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
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const mobile = location.state?.mobile;
  const redirectPath = location.state?.redirectPath || "/";

  // Countdown
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  // Web OTP API auto-fill
  useEffect(() => {
    if ("OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otpCredential) => {
          setOtp(otpCredential.code);
          handleVerify(otpCredential.code);
        })
        .catch((err) => console.log("Web OTP failed", err));
      return () => ac.abort();
    }
  }, []);

  const handleVerify = async (otpCode) => {
    const code = otpCode || otp;
    if (!code) return;

    setIsLoading(true);
    const res = await postData("/auth/verify-otp", { mobile, otp: code });

    if (!res?.error) {
      context.openAlertBox("success", "আপনার মোবাইল ভেরিফাই হয়েছে!");

      // Auto login
      localStorage.setItem("accesstoken", res?.data?.accesstoken);
      localStorage.setItem("refreshtoken", res?.data?.refreshtoken);
      context.setIsLogin(true);

      navigate(redirectPath);
    } else {
      context.openAlertBox("error", res?.message);
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const res = await postData("/auth/resend-otp", { mobile });
    if (!res?.error) {
      context.openAlertBox("success", "OTP পাঠানো হয়েছে।");
      setSeconds(60);
      setCanResend(false);
    } else {
      context.openAlertBox("error", res?.message);
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto" }}>
      <h3>আপনার মোবাইল ভেরিফাই করুন</h3>
      <TextField
        label="Enter OTP"
        fullWidth
        inputProps={{ maxLength: 6 }}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        disabled={isLoading}
        style={{ marginTop: "20px", marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={() => handleVerify()}
        disabled={isLoading || !otp}
      >
        {isLoading ? <CircularProgress size={24} /> : "Verify"}
      </Button>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {canResend ? (
          <Button onClick={handleResend}>Resend OTP</Button>
        ) : (
          <p>Resend in {seconds}s</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
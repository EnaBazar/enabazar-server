import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const mobile = location.state?.mobile; // register থেকে পাঠানো mobile

  // Countdown for resend
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  // OTP verify + automatic login
  const handleVerify = async () => {
    if (otp.length !== 6) {
      context.openAlertBox("error", "Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const res = await postData("/auth/verify-otp", { mobile, otp });

    setIsLoading(false);
    if (!res?.error) {
      context.openAlertBox("success", "আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!");

      // Save tokens to localStorage
      if (res?.data?.accesstoken) {
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        context.setIsLogin(true);
      }

      // Redirect to homepage
      navigate("/");
    } else {
      context.openAlertBox("error", res?.message);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsLoading(true);
    const res = await postData("/auth/resend-otp", { mobile });
    setIsLoading(false);

    if (!res?.error) {
      context.openAlertBox("success", "নতুন OTP পাঠানো হয়েছে!");
      setSeconds(60);
      setCanResend(false);
    } else {
      context.openAlertBox("error", res?.message);
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto" }}>
      <h3 className="text-center mb-5">Verify OTP</h3>

      <TextField
        label="Enter OTP"
        fullWidth
        inputProps={{ maxLength: 6 }}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        className="mb-5"
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleVerify}
        disabled={isLoading}
        style={{ marginBottom: "20px" }}
      >
        {isLoading ? <CircularProgress color="inherit" size={24} /> : "Verify"}
      </Button>

      <div style={{ textAlign: "center" }}>
        {canResend ? (
          <Button onClick={handleResend} disabled={isLoading}>
            Resend OTP
          </Button>
        ) : (
          <p>Resend in {seconds}s</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
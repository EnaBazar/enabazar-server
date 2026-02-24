import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const mobile = location.state?.mobile;
  const redirectTo = location.state?.from || "/";

  // Countdown timer
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
      navigator.credentials
        .get({ otp: { transport: ["sms"] } })
        .then((otpResponse) => {
          const code = otpResponse.code;
          setOtp(code);
          handleVerify(code); // auto verify
        })
        .catch((err) => console.log("OTP autofill not supported", err));
    }
  }, []);

  const handleVerify = async (autoOtp) => {
    const codeToVerify = autoOtp || otp;
    if (codeToVerify.length !== 6) {
      context.openAlertBox("error", "Please enter 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const res = await postData("/auth/verify-mobile-otp", {
      mobile,
      otp: codeToVerify,
    });
    setIsLoading(false);

    if (!res.error) {
      context.openAlertBox("success", "আপনার নাম্বার সফলভাবে ভেরিফাই হয়েছে!");

      if (res.data?.accesstoken) {
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        context.setIsLogin(true);
      }

      navigate(redirectTo, { replace: true });
    } else {
      context.openAlertBox("error", res.message);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const res = await postData("/auth/resend-otp", { mobile });
    setIsLoading(false);

    if (!res.error) {
      context.openAlertBox("success", "নতুন OTP পাঠানো হয়েছে!");
      setSeconds(60);
      setCanResend(false);
    } else {
      context.openAlertBox("error", res.message);
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
        onClick={() => handleVerify()}
        disabled={isLoading}
        style={{ marginBottom: "20px" }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Verify"}
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
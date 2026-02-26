import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { Box, Typography } from "@mui/material";

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

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  // Handle OTP verification
  const handleVerify = async () => {
    if (otp.length !== 6) {
      context.openAlertBox("error", "Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const res = await postData("/auth/verify-otp", { mobile, otp });
    setIsLoading(false);

    if (!res?.error) {
      // Success → auto login
      context.openAlertBox("success", "আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!");

      if (res?.data?.accesstoken) {
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
        localStorage.setItem("isLogin", "true");

        context.setIsLogin(true);
        context.setUserData(res.data.user);
      }

navigate("/")
    } else {
      context.openAlertBox("error", res?.message || "OTP verification failed");
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    setIsLoading(true);
    const res = await postData("/auth/resend-otp", { mobile });
    setIsLoading(false);

    if (!res?.error) {
      context.openAlertBox("success", "নতুন OTP পাঠানো হয়েছে!");
      setSeconds(60);
      setCanResend(false);
    } else {
      context.openAlertBox("error", res?.message || "Failed to resend OTP");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        width: "90%",
        mx: "auto",
        mt: { xs: 8, sm: 12 },
        p: { xs: 2, sm: 4 },
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Verify OTP
      </Typography>

      <TextField
        label="Enter OTP"
        fullWidth
        inputProps={{ maxLength: 6 }}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleVerify}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress color="inherit" size={24} /> : "Verify"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        {canResend ? (
          <Button onClick={handleResend} disabled={isLoading}>
            Resend OTP
          </Button>
        ) : (
          <Typography variant="body2">Resend in {seconds}s</Typography>
        )}
      </Box>
    </Box>
  );
};

export default VerifyOtp;
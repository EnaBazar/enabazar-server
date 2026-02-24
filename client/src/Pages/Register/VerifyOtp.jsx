import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile;

  // countdown
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  const handleVerify = async () => {
    const res = await postData("/auth/verify-otp", {
      mobile,
      otp,
    });

    if (!res?.error) {
      alert("Verified Successfully");
      navigate("/login");
    } else {
      alert(res?.message);
    }
  };

  const handleResend = async () => {
    const res = await postData("/auth/resend-otp", { mobile });

    if (!res?.error) {
      alert("OTP Resent");
      setSeconds(60);
      setCanResend(false);
    } else {
      alert(res?.message);
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto" }}>
      <h3>Verify OTP</h3>

      <TextField
        label="Enter OTP"
        fullWidth
        inputProps={{ maxLength: 6 }}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      />

      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: "20px" }}
        onClick={handleVerify}
      >
        Verify
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
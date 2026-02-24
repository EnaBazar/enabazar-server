import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { MyContext } from "../../App";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile;
  const context = useContext(MyContext)
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
      context.openAlertBox("success","আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!");
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
        className="!mt-3 !mb-3"
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
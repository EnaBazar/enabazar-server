import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const VerifyOtp = () => {

  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const mobile = location.state?.mobile; // register থেকে পাঠানো

  const handleVerify = async () => {

    const res = await postData("/auth/verify-mobile-otp", {
      mobile: mobile,
      otp: otp
    });

    if (res?.error !== true) {
      alert("Mobile verified successfully");
      navigate("/login");
    } else {
      alert(res?.message);
    }
  };

  return (
    <div style={{width:"400px",margin:"100px auto"}}>
      <h3>Verify OTP</h3>

      <TextField
      className="!mt-3"
        label="Enter OTP"
        fullWidth
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        style={{marginTop:"20px"}}
        onClick={handleVerify}
      >
        Verify
      </Button>
    </div>
  );
};

export default VerifyOtp;

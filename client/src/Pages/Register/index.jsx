import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: ""
  });

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // 🔹 Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formFields.name || !formFields.mobile || !formFields.password) {
      return context.openAlertBox("error", "সব তথ্য পূরণ করুন");
    }

    setIsLoading(true);

    const res = await postData("/auth/send-mobile-otp", {
      mobile: formFields.mobile
    });

    if (res?.success) {
      context.openAlertBox("success", "OTP পাঠানো হয়েছে");
      setShowOtpField(true);
    } else {
      context.openAlertBox("error", res?.message);
    }

    setIsLoading(false);
  };

  // 🔹 Verify OTP + Register
  const verifyOtpHandler = async () => {
    setIsLoading(true);

    const verifyRes = await postData("/auth/verify-mobile-otp", {
      mobile: formFields.mobile,
      otp
    });

    if (verifyRes?.success) {
      const registerRes = await postData("/auth/register", formFields);

      if (registerRes?.success) {
        context.openAlertBox("success", "Registration Successful");
        navigate("/");
      }
    } else {
      context.openAlertBox("error", verifyRes?.message);
    }

    setIsLoading(false);
  };

  return (
    <section className="py-10">
      <div className="w-[400px] m-auto bg-white p-6 shadow-md rounded-md">

        <h3 className="text-center !mb-5">Register</h3>

        <form onSubmit={handleSendOtp}>

          <TextField
            label="Full Name"
            name="name"
            value={formFields.name}
            onChange={onchangeInput}
            fullWidth
            className="!mb-4"
          />

          <TextField
            label="Mobile"
            name="mobile"
            value={formFields.mobile}
            onChange={onchangeInput}
            fullWidth
            className="!mb-4"
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formFields.password}
            onChange={onchangeInput}
            fullWidth
            className="!mb-4"
          />

          {!showOtpField && (
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Send OTP"}
            </Button>
          )}
        </form>

        {showOtpField && (
          <>
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              className="!mt-4 !mb-4"
            />

            <Button
              variant="contained"
              fullWidth
              onClick={verifyOtpHandler}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Verify & Register"}
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default Register;

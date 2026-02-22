import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Input handler
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // ==================== Send OTP ====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, mobile, password } = formFields;

    if (!name || !mobile || !password) {
      context.openAlertBox("error", "All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formFields);

      if (res.data.success) {
        context.openAlertBox("success", res.data.message);
        setOtpSent(true);
        localStorage.setItem("verifyMobile", mobile); // store for verification
      } else {
        context.openAlertBox("error", res.data.message);
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox("error", "Server error. Try again later");
    }

    setIsLoading(false);
  };

  // ==================== Verify OTP ====================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mobile = localStorage.getItem("verifyMobile");
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-otp`, { mobile, otp });

      if (res.data.success) {
        context.openAlertBox("success", res.data.message);
        localStorage.removeItem("verifyMobile");
        navigate("/login");
      } else {
        context.openAlertBox("error", res.data.message);
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox("error", "Failed to verify OTP");
    }

    setIsLoading(false);
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12">
          <h3 className="text-center text-[14px] text-[200]">
            আপনার মোবাইল নাম্বার দিয়ে রেজিস্টেশন করুন!
          </h3>

          {!otpSent ? (
            // ==================== Registration Form ====================
            <form className="w-full !mt-5" onSubmit={handleRegister}>
              <TextField
                type="text"
                name="name"
                value={formFields.name}
                disabled={isLoading}
                label="আপনার নাম"
                variant="outlined"
                className="w-full mb-5"
                onChange={onChangeInput}
              />

              <TextField
                type="number"
                name="mobile"
                value={formFields.mobile}
                disabled={isLoading}
                label="মোবাইল নাম্বার"
                variant="outlined"
                className="w-full mb-5"
                onChange={onChangeInput}
              />

              <div className="relative mb-5">
                <TextField
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  value={formFields.password}
                  disabled={isLoading}
                  label="পাসওয়াড*"
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
                <Button
                  className="!absolute !top-[10px] !right-[10px] z-50"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={Object.values(formFields).some((val) => !val) || isLoading}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading ? <CircularProgress color="inherit" /> : "Register"}
              </Button>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-red-500 font-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            // ==================== OTP Verification Form ====================
            <form className="w-full !mt-5" onSubmit={handleVerifyOtp}>
              <TextField
                type="number"
                value={otp}
                disabled={isLoading}
                label="Enter OTP"
                variant="outlined"
                className="w-full mb-5"
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                type="submit"
                disabled={otp.length < 6 || isLoading}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading ? <CircularProgress color="inherit" /> : "Verify OTP"}
              </Button>

              <p className="text-center mt-3">
                Didn’t receive OTP?{" "}
                <span
                  className="text-red-500 font-semibold cursor-pointer"
                  onClick={() => setOtpSent(false)}
                >
                  Resend OTP
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Register;
import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
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
  const history = useNavigate();

  // Input field change handler
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  // OTP sent validation
  const handleOtpVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { mobile } = formFields;

    postData("/auth/verify-otp", { mobile, otp }).then((res) => {
      if (res.success) {
        context.openAlertBox("success", "Mobile Verified Successfully");
        history("/login"); // Redirect to login page after OTP verification
      } else {
        context.openAlertBox("error", res.message);
        setIsLoading(false);
      }
    });
  };

  // Submit the registration form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation for form fields
    if (formFields.name === "") {
      context.openAlertBox("error", "Please add full name");
      return false;
    }

    if (formFields.mobile === "") {
      context.openAlertBox("error", "Please enter your mobile number");
      return false;
    }

    if (formFields.password === "") {
      context.openAlertBox("error", "Please enter your Password");
      return false;
    }

    // Sending data to registration API
    postData("/auth/register", formFields).then((res) => {
      if (res.success) {
        context.openAlertBox("success", res.message);
        setOtpSent(true); // Set OTP sent status
        localStorage.setItem("verifyMobile", formFields.mobile); // Store mobile for OTP verification
        setIsLoading(false);
      } else {
        context.openAlertBox("error", res.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12">
          <h3 className="text-center text-[14px] text-[200]">
            আপনার মোবাইল নাম্বার দিয়ে রেজিস্টেশন করুন!
          </h3>

          {/* Registration Form */}
          {!otpSent ? (
            <form className="w-full !mt-5" onSubmit={handleSubmit}>
              <div className="form-group w-full !mb-5">
                <TextField
                  type="text"
                  id="name"
                  name="name"
                  value={formFields.name}
                  disabled={isLoading === true}
                  label="আপনার নাম"
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
              </div>

              <div className="form-group w-full !mb-5">
                <TextField
                  type="number"
                  id="mobile"
                  name="mobile"
                  value={formFields.mobile}
                  disabled={isLoading === true}
                  label="মোবাইল নাম্বার"
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
              </div>

              <div className="form-group w-full !mb-5 relative">
                <TextField
                  type={isShowPassword === false ? "password" : "text"}
                  id="password"
                  label="পাসওয়াড*"
                  name="password"
                  value={formFields.password}
                  disabled={isLoading === true}
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
                <Button
                  className="!absolute !top-[10px] !right-[10px] z-50 !w-[35x] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword === true ? (
                    <IoMdEye className="text-[20px] opacity-75" />
                  ) : (
                    <IoMdEyeOff className="text-[20px] opacity-75" />
                  )}
                </Button>
              </div>

              <div className="flex items-center w-full !mt-3 !mb-3">
                <Button
                  type="submit"
                  disabled={Object.values(formFields).some((val) => !val)}
                  className="btn-org btn-lg w-full cursor-pointer flex gap-3"
                >
                  {isLoading === true ? <CircularProgress color="inherit" /> : "Register"}
                </Button>
              </div>

              <p className="text-center">
                Already have an account?{" "}
                <Link className="link !text-[14px] cursor-pointer !font-[600] !text-[#ff5252]" to="/login">
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            // OTP Verification Form
            <form className="w-full !mt-5" onSubmit={handleOtpVerify}>
              <div className="form-group w-full !mb-5">
                <TextField
                  type="number"
                  id="otp"
                  name="otp"
                  value={otp}
                  disabled={isLoading === true}
                  label="Enter OTP"
                  variant="outlined"
                  className="w-full"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="flex items-center w-full !mt-3 !mb-3">
                <Button
                  type="submit"
                  disabled={otp.length < 6}
                  className="btn-org btn-lg w-full cursor-pointer flex gap-3"
                >
                  {isLoading === true ? <CircularProgress color="inherit" /> : "Verify OTP"}
                </Button>
              </div>

              <p className="text-center">
                Didn’t receive the OTP?{" "}
                <span
                  className="link !text-[14px] cursor-pointer !font-[600] !text-[#ff5252]"
                  onClick={() => setOtpSent(false)}
                >
                  Resend OTP
                </span>
              </p>
            </form>
          )}

          <p className="text-center font-[500]">Or continue with social account</p>
          {/* Google Sign Up */}
          <Button className="flex gap-3 w-full !bg-[f1f1f1] btn-lg !text-black">
            {/* Add Google Sign Up functionality here */}
            SignUp with Google
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Register;

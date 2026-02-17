import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: "",
    otp: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [IsShowPassword, setIsShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // OTP sent flag

  window.scrollTo(0, 0);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  // -----------------------------
  // Step 1: Register and Send OTP
  // -----------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name || !formFields.mobile || !formFields.password) {
      context.openAlertBox("error", "All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData("/auth/register", {
        name: formFields.name,
        mobile: formFields.mobile,
        password: formFields.password
      });

      if (res.success) {
        context.openAlertBox("success", "OTP sent to your mobile");
        setIsOtpSent(true);
      } else {
        context.openAlertBox("error", res.message);
      }
    } catch (error) {
      console.log(error);
      context.openAlertBox("error", "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Step 2: Verify OTP
  // -----------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formFields.otp) {
      context.openAlertBox("error", "Enter OTP");
      return;
    }

    setIsLoading(true);

    try {
      const res = await postData("/auth/verify-mobile-otp", {
        mobile: formFields.mobile,
        otp: formFields.otp
      });

      if (res.success) {
        context.openAlertBox("success", "Mobile verified successfully!");
        setFormFields({ name: "", mobile: "", password: "", otp: "" });
        setIsOtpSent(false);
        history("/login");
      } else {
        context.openAlertBox("error", res.message);
      }
    } catch (error) {
      console.log(error);
      context.openAlertBox("error", "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Step 3: Google Signup (optional)
  // -----------------------------
  const authWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;

        const fields = {
          name: user.displayName,
          email: user.email,
          password: null,
          avatar: user.photoURL,
          mobile: user.phoneNumber,
          signUpWithGoogle: true,
          role: "USER"
        };

        const res = await postData("/auth/authWithGoogle", fields);

        if (res.success) {
          context.openAlertBox("success", res.message);
          localStorage.setItem("userEmail", fields.mobile);
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("refreshtoken", res.data.refreshtoken);
          context.setIsLogin(true);
          history("/");
        } else {
          context.openAlertBox("error", res.message);
        }
      })
      .catch((error) => {
        console.log(error);
        context.openAlertBox("error", "Google Sign In failed");
      });
  };

  // -----------------------------
  // JSX Form
  // -----------------------------
  return (
    <section className="section py-10">
      <div className="container">
        <div className="card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12">
          <h3 className="text-center text-[18px] text-[200]">
            Register with a new account
          </h3>

          <form
            className="w-full !mt-5"
            onSubmit={isOtpSent ? handleVerifyOtp : handleRegister}
          >
            {!isOtpSent && (
              <>
                <div className="form-group w-full !mb-5">
                  <TextField
                    type="text"
                    id="name"
                    name="name"
                    value={formFields.name}
                    label="Full Name"
                    variant="outlined"
                    className="w-full"
                    onChange={onchangeInput}
                  />
                </div>

                <div className="form-group w-full !mb-5">
                  <TextField
                    type="number"
                    id="mobile"
                    name="mobile"
                    value={formFields.mobile}
                    label="Mobile"
                    variant="outlined"
                    className="w-full"
                    onChange={onchangeInput}
                  />
                </div>

                <div className="form-group w-full !mb-5 relative">
                  <TextField
                    type={IsShowPassword ? "text" : "password"}
                    id="Password"
                    label="Password*"
                    name="password"
                    value={formFields.password}
                    variant="outlined"
                    className="w-full"
                    onChange={onchangeInput}
                  />
                  <Button
                    className="!absolute !top-[10px] !right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                    onClick={() => setIsShowPassword(!IsShowPassword)}
                  >
                    {IsShowPassword ? (
                      <IoMdEye className="text-[20px] opacity-75" />
                    ) : (
                      <IoMdEyeOff className="text-[20px] opacity-75" />
                    )}
                  </Button>
                </div>
              </>
            )}

            {isOtpSent && (
              <div className="form-group w-full !mb-5">
                <TextField
                  type="number"
                  id="otp"
                  name="otp"
                  value={formFields.otp}
                  label="Enter OTP"
                  variant="outlined"
                  className="w-full"
                  onChange={onchangeInput}
                />
              </div>
            )}

            <div className="flex items-center w-full !mt-3 !mb-3">
              <Button
                type="submit"
                disabled={!valideValue && !isOtpSent}
                className="btn-org btn-lg w-full cursor-pointer flex gap-3"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" />
                ) : isOtpSent ? (
                  "Verify OTP"
                ) : (
                  "Register"
                )}
              </Button>
            </div>

            {!isOtpSent && (
              <>
                <p className="text-center">
                  Already have an account?{" "}
                  <Link
                    className="link !text-[14px] cursor-pointer !font-[600] !text-[#ff5252]"
                    to="/login"
                  >
                    Sign In
                  </Link>
                </p>

                <p className="text-center font-[500]">
                  Or continue with social account
                </p>

                <Button
                  className="flex gap-3 w-full !bg-[f1f1f1] btn-lg !text-black"
                  onClick={authWithGoogle}
                >
                  <FcGoogle className="text-[20px]" /> SignUp with Google
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;

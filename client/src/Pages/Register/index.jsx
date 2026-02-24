import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const isValid = Object.values(formFields).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name || !formFields.mobile || !formFields.password) {
      context.openAlertBox("error", "সব ফিল্ড পূরণ করুন");
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData("/auth/register", formFields);
      if (!res.error) {
        context.openAlertBox("success", res.message);
        localStorage.setItem("userMobile", formFields.mobile);
        setFormFields({ name: "", mobile: "", password: "" });

        // Redirect to verify OTP page
        navigate("/verify-otp", { state: { mobile: res.data.mobile, from: redirectTo } });
      } else {
        context.openAlertBox("error", res.message);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox("error", "Something went wrong!");
      setIsLoading(false);
    }
  };

  const authWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const fields = {
        name: user.displayName,
        email: user.email,
        password: null,
        avatar: user.photoURL,
        mobile: user.phoneNumber,
        signUpWithGoogle: true,
        role: "USER",
      };

      const res = await postData("/auth/authWithGoogle", fields);
      if (!res.error) {
        context.openAlertBox("success", res.message);
        localStorage.setItem("accesstoken", res.data.accesstoken);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        context.setIsLogin(true);
        navigate(redirectTo, { replace: true });
      } else {
        context.openAlertBox("error", res.message);
      }
    } catch (error) {
      console.error(error);
      context.openAlertBox("error", "Google sign in failed");
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12">
          <h3 className="text-center text-[14px] font-medium">
            আমাদের সাথে থাকার জন্য মোবাইল নাম্বার দিয়ে রেজিস্টার করুন!
          </h3>

          <form className="w-full !mt-5" onSubmit={handleSubmit}>
            <TextField
              label="আপনার নাম"
              name="name"
              value={formFields.name}
              fullWidth
              onChange={handleInputChange}
              disabled={isLoading}
              className="mb-5"
            />

            <TextField
              label="মোবাইল নাম্বার"
              name="mobile"
              type="number"
              value={formFields.mobile}
              fullWidth
              onChange={handleInputChange}
              disabled={isLoading}
              className="mb-5"
            />

            <div className="relative mb-5">
              <TextField
                label="পাসওয়ার্ড"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formFields.password}
                fullWidth
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button
                className="!absolute !top-[10px] !right-[10px] !min-w-[35px] !h-[35px] !p-0"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </Button>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={!isValid || isLoading}
              className="btn-org btn-lg w-full flex gap-3"
            >
              {isLoading ? <CircularProgress size={24} /> : "Register"}
            </Button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link className="text-[#ff5252] font-semibold" to="/login">
                Sign In
              </Link>
            </p>

            <p className="text-center font-medium mt-3">
              Or continue with social account
            </p>

            <Button
              onClick={authWithGoogle}
              className="flex gap-3 w-full bg-[#f1f1f1] btn-lg text-black mt-2"
            >
              <FcGoogle /> SignUp with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
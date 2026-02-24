import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";

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

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const isValid = Object.values(formFields).every((el) => el);

  // ================= Register Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      context.openAlertBox("error", "All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      // Mobile formatting for Bangladesh +880
      const mobileNumber = formFields.mobile.startsWith("0")
        ? "+88" + formFields.mobile
        : formFields.mobile;

      const res = await postData("/auth/register", {
        ...formFields,
        mobile: mobileNumber,
      });

      if (!res.error) {
        context.openAlertBox("success", res.message);

        // OTP verification page redirect
        navigate("/verify-otp", { state: { mobile: mobileNumber } });
      } else {
        context.openAlertBox("error", res.message);
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox("error", "Server Error! Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= Google Auth =================
  const authWithGoogle = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        const fields = {
          name: user.displayName || "Google User",
          email: user.email,
          password: null,
          avatar: user.photoURL,
          mobile: user.phoneNumber || "",
          signUpWithGoogle: true,
          role: "USER",
        };

        const res = await postData("/auth/authWithGoogle", fields);

        if (!res.error) {
          context.openAlertBox("success", res.message);
          localStorage.setItem("userEmail", fields.mobile);
          localStorage.setItem("accesstoken", res?.data?.accesstoken);
          localStorage.setItem("refreshtoken", res?.data?.refreshtoken);
          context.setIsLogin(true);
          navigate("/");
        } else {
          context.openAlertBox("error", res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        context.openAlertBox("error", "Google login failed");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12">
          <h3 className="text-center text-[14px] font-medium">
            আমাদের সাথে থাকার জন্য আপনার মোবাইল নাম্বার দিয়ে রেজিস্টেশন করুন!
          </h3>

          <form className="w-full !mt-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group w-full !mb-5">
              <TextField
                type="text"
                id="name"
                name="name"
                label="আপনার নাম"
                variant="outlined"
                value={formFields.name}
                disabled={isLoading}
                fullWidth
                onChange={onChangeInput}
              />
            </div>

            {/* Mobile */}
            <div className="form-group w-full !mb-5">
              <TextField
                type="number"
                id="mobile"
                name="mobile"
                label="মোবাইল নাম্বার"
                variant="outlined"
                value={formFields.mobile}
                disabled={isLoading}
                fullWidth
                onChange={onChangeInput}
              />
            </div>

            {/* Password */}
            <div className="form-group w-full !mb-5 relative">
              <TextField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                label="পাসওয়ার্ড"
                variant="outlined"
                value={formFields.password}
                disabled={isLoading}
                fullWidth
                onChange={onChangeInput}
              />
              <Button
                type="button"
                className="!absolute !top-[10px] !right-[10px] z-50 !w-[35px] !h-[35px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </Button>
            </div>

            {/* Submit */}
            <div className="flex items-center w-full !mt-3 !mb-3">
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="btn-org btn-lg w-full cursor-pointer flex gap-3"
              >
                {isLoading ? <CircularProgress color="inherit" size={24} /> : "Register"}
              </Button>
            </div>

            {/* Login link */}
            <p className="text-center">
              Already have an account?{" "}
              <Link className="link !text-[14px] font-semibold !text-[#ff5252]" to="/login">
                Sign In
              </Link>
            </p>

            <p className="text-center font-medium mt-3">Or continue with social account</p>

            <Button
              className="flex gap-3 w-full !bg-[f1f1f1] btn-lg !text-black mt-3"
              onClick={authWithGoogle}
              disabled={isLoading}
            >
              <FcGoogle className="text-[20px]" />
              SignUp with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const RegisterPanel = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const bdMobileRegex = /^01[3-9]\d{8}$/;

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 11) {
        setFormFields((prev) => ({ ...prev, mobile: numericValue }));

        if (!bdMobileRegex.test(numericValue)) {
          setErrors((prev) => ({
            ...prev,
            mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন",
          }));
        } else {
          setErrors((prev) => ({ ...prev, mobile: "" }));
        }
      }
      return;
    }

    if (name === "name") {
      setFormFields((prev) => ({ ...prev, name: value }));
      if (value.trim().length < 3) {
        setErrors((prev) => ({
          ...prev,
          name: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
        }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
      return;
    }

    if (name === "password") {
      setFormFields((prev) => ({ ...prev, password: value }));
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
      return;
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation before API call
    if (!bdMobileRegex.test(formFields.mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন",
      }));
      return;
    }
    if (formFields.name.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        name: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
      }));
      return;
    }
    if (formFields.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
      }));
      return;
    }

    try {
      setIsLoading(true);
      const res = await postData("/auth/register", formFields);

      if (res?.error !== true) {
        context.openAlertBox("success", res?.message);
        localStorage.setItem("userEmail", formFields.mobile);

        // OTP redirect
        navigate("/verify-otp", { state: { mobile: formFields.mobile } });

        setFormFields({
          name: "",
          mobile: "",
          password: "",
        });
      } else {
        context.openAlertBox("error", res?.message);
      }
    } catch (err) {
      context.openAlertBox("error", "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            প্রথমবার ব্যবহার করতে নাম ও মোবাইল নাম্বার দিন!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <TextField
            fullWidth
            label="আপনার নাম"
            name="name"
            value={formFields.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 42 },
              "& .MuiInputBase-input": { padding: "10px 12px", fontSize: "14px" },
            }}
          />

          {/* Mobile */}
          <TextField
            fullWidth
            label="মোবাইল নাম্বার"
            name="mobile"
            value={formFields.mobile}
            onChange={handleChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
            disabled={isLoading}
            size="small"
            inputProps={{ maxLength: 11, inputMode: "numeric" }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 42 },
              "& .MuiInputBase-input": { padding: "10px 12px", fontSize: "14px" },
            }}
          />

          {/* Password */}
          <div className="relative">
            <TextField
              fullWidth
              type={isShowPassword ? "text" : "password"}
              label="পাসওয়ার্ড"
              name="password"
              value={formFields.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 42 },
                "& .MuiInputBase-input": { padding: "10px 12px", fontSize: "14px" },
              }}
            />
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="absolute top-3 right-3 text-gray-500"
            >
              {isShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            sx={{
              height: 42,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              background: "linear-gradient(90deg, #ff4d4d, #ff0000)",
              boxShadow: "0 8px 20px rgba(255,0,0,0.25)",
              "&:hover": {
                background: "linear-gradient(90deg, #e60000, #cc0000)",
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>

          {/* Switch to Login */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => {
                context?.setOpenRegisterPanel(false);
                context?.setOpenLoginPanel(true);
              }}
              className="font-semibold text-red-500 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterPanel;
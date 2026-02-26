import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const LoginPanel = () => {
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
  });

  const bdMobileRegex = /^01[3-9]\d{8}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length <= 11) {
        setFormFields((prev) => ({
          ...prev,
          mobile: numericValue,
        }));

        if (!bdMobileRegex.test(numericValue)) {
          setErrors((prev) => ({
            ...prev,
            mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            mobile: "",
          }));
        }
      }
    }

    if (name === "name") {
      setFormFields((prev) => ({
        ...prev,
        name: value,
      }));

      if (value.trim().length < 3) {
        setErrors((prev) => ({
          ...prev,
          name: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          name: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      setIsLoading(true);

      const res = await postData("/auth/login", formFields, {
        withCredentials: true,
      });

      if (res?.error !== true) {
        context.openAlertBox("success", res?.message);

        localStorage.setItem("accesstoken", res?.data?.accesstoken);
        localStorage.setItem("refreshtoken", res?.data?.refreshtoken);

        context.setIsLogin(true);
        context?.setOpenLoginPanel(false);

        window.location.reload();
      } else {
        context.openAlertBox(
          "error",
          "আপনার নিবন্ধন নাই! নাম ও মোবাইল নাম্বার দিয়ে রেজিস্টার করুন!"
        );

        context?.setOpenLoginPanel(false);
        setTimeout(() => {
          context?.setOpenRegisterPanel(true);
        }, 1000);
      }
    } catch (error) {
      context.openAlertBox("error", "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-100 ">
      <div className="">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
          আপনার নাম ও মোবাইল নাম্বার দিন !
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="আপনার নাম"
            name="name"
            value={formFields.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            className="!mt-4"
            label="মোবাইল নাম্বার"
            name="mobile"
            value={formFields.mobile}
            onChange={handleChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
            disabled={isLoading}
            inputProps={{
              maxLength: 11,
              inputMode: "numeric",
            }}
          />

          <Button
            type="submit"
            className="!mt-4 !mb-4"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              height: 50,
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
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>

        

       

          <p className="text-center !text-[8px] text-gray-600">
            আপনার আগের রেজিস্টেশন না থাকলে! {" "}
            <span
              onClick={() => {
                context?.setOpenLoginPanel(false);
                context?.setOpenRegisterPanel(true);
              }}
              className="font-semibold !text-[12px] text-red-500 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPanel;
import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const Login = () => {
  const context = useContext(MyContext);

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bdMobileRegex = /^01[3-9]\d{8}$/;

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setMobile(value);

    if (!bdMobileRegex.test(value)) {
      setError("সঠিক মোবাইল নাম্বার দিন");
    } else {
      setError("");
    }
  };

  const handleLogin = () => {
    if (!bdMobileRegex.test(mobile)) return;

    setLoading(true);

    postData("/auth/loginotp", { mobile }).then((res) => {
      setLoading(false);

      if (!res?.data?.error) {
        context.openAlertBox("success", "OTP পাঠানো হয়েছে");

        // 🔥 Open OTP Panel
        context.openUpdateOtpPanel({
          mobile: mobile,
          type: "login", // important
        });
      } else {
        context.openAlertBox("error", res?.data?.message);
      }
    });
  };

  return (
    <div className="card w-[400px] p-5 mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Login your profile</h2>

      <TextField
        label="Mobile Number"
        fullWidth
        value={mobile}
        onChange={handleChange}
        error={!!error}
        helperText={error}
        placeholder="01XXXXXXXXX"
      />

      <Button
        className="btn-blue mt-4 w-full"
        onClick={handleLogin}
        disabled={!!error || !mobile || loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
};

export default Login;
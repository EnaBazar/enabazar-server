import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";


const VerifyOtpPanel = () => {
  const context = useContext(MyContext);
  const mobile = context?.otpData?.mobile || "";

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown Timer
  useEffect(() => {
    if (!context?.openVerifyOtpPanel) return;

    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds, context?.openVerifyOtpPanel]);

  // ✅ FIXED INPUT HANDLER
  const handleOtpChange = (e) => {
    let value = e.target.value;

    // শুধু number রাখবে
    value = value.replace(/[^0-9]/g, "");

    // max 6 digit
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // ✅ Paste support
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text");
    const cleaned = pasteData.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(cleaned);
    e.preventDefault();
  };

  // OTP Verify
const handleVerify = async () => {
  if (!mobile) {
    context.openAlertBox("error", "Mobile number missing!");
    return;
  }

  if (otp.length !== 6) {
    context.openAlertBox("error", "Please enter 6-digit OTP");
    return;
  }

  try {
    setIsLoading(true);

    const payload = {
      mobile: String(mobile),
      otp: String(otp),
    };

    const res = await postData("/auth/verify-otp", payload);

    setIsLoading(false);

    if (!res?.error) {
      context.openAlertBox(
        "success",
        "আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!"
      );

      // 🔒 Admin check happens only during auto-login
      if (res?.data?.user?.verify_admin) {
        // Auto login
        if (res?.data?.accesstoken) {
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("refreshtoken", res.data.refreshtoken);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
          localStorage.setItem("isLogin", "true");

          context.setIsLogin(true);
          context.setUserData(res.data.user);

          context.closeOtpPanel();
          window.location.href = "/dashboard";
        }
      } else {
        // User not allowed by admin → redirect to login page
        context.openAlertBox(
          "error",
          "আপনাকে প্রবেশের জন্য অনুমতি নিতে হবে। লগইন পেজে ফিরে যাচ্ছেন।"
        );
        context.closeOtpPanel();
        window.location.href = "/login"; // redirect to login
      }

    } else {
      context.openAlertBox(
        "error",
        res?.message || "OTP verification failed"
      );
    }

  } catch (error) {
    setIsLoading(false);
    context.openAlertBox("error", "Server error. Please try again.");
  }
};



  // Resend OTP
  const handleResend = async () => {
    if (!mobile) return;

    try {
      setIsLoading(true);

      const res = await postData("/auth/resend-otp", {
        mobile: String(mobile),
      });

      setIsLoading(false);

      if (!res?.error) {
        context.openAlertBox("success", "নতুন OTP পাঠানো হয়েছে!");
        setSeconds(60);
        setCanResend(false);
      } else {
        context.openAlertBox(
          "error",
          res?.message || "Failed to resend OTP"
        );
      }
    } catch (error) {
      setIsLoading(false);
      context.openAlertBox("error", "Server error. Please try again.");
    }
  };

  if (!context?.openVerifyOtpPanel) return null;

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "auto",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ textAlign: "center" }}>
        Verify Your OTP {mobile && `for ${mobile}`}
      </h3>

      <input
        type="text"
        inputMode="numeric" 
  autoComplete="one-time-code"
        
        // ✅ mobile keyboard fix
        pattern="[0-9]*"
        value={otp}
        onChange={handleOtpChange}
        onPaste={handlePaste}
        maxLength={6}
        placeholder="Enter 6 digit OTP"
        autoFocus
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "15px",
          marginBottom: "15px",
          fontSize: "16px",
          letterSpacing: "5px",
          textAlign: "center",
        }}
      />

      <button
        onClick={handleVerify}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px",
          background: "#ff5252",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isLoading}
            style={{ border: "none", background: "none", color: "blue" }}
          >
            Resend OTP
          </button>
        ) : (
          <p>Resend in {seconds}s</p>
        )}
      </div>

      <button
        onClick={context.closeOtpPanel}
        style={{
          marginTop: "10px",
          width: "100%",
          background: "gray",
          color: "#fff",
          border: "none",
          padding: "8px",
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default VerifyOtpPanel;
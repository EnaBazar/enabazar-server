import React, { useState, useEffect, useContext, useRef } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const VerifyOtpPanel = () => {
  const context = useContext(MyContext);
  const mobile = context?.otpData?.mobile || "";
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

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

  // OTP পরিবর্তন এবং পরবর্তী ইনপুটে ফোকাস
  const handleOtpChange = (e, index) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // শুধু সংখ্যা

    if (value.length <= 1) {
      const newOtp = otp.split("");
      newOtp[index] = value; // OTP আপডেট
      setOtp(newOtp.join(""));

      // পরবর্তী ইনপুট ফিল্ডে ফোকাস চলে যাবে
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // পেস্ট করার ফিচার
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text");
    const cleaned = pasteData.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(cleaned);
    e.preventDefault();
  };

  // OTP ভেরিফাই করার ফাংশন
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
        context.openAlertBox("success", "আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!");

        // Auto login
        if (res?.data?.accesstoken) {
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("refreshtoken", res.data.refreshtoken);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
          localStorage.setItem("isLogin", "true");

          context.setIsLogin(true);
          context.setUserData(res.data.user);
        }

        context.closeOtpPanel();
        window.location.href = "/dashboard";
      } else {
        context.openAlertBox("error", res?.message || "OTP verification failed");
      }
    } catch (error) {
      setIsLoading(false);
      context.openAlertBox("error", "Server error. Please try again.");
    }
  };

  // OTP রিসেন্ড করার ফাংশন
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
        context.openAlertBox("error", res?.message || "Failed to resend OTP");
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
        Verify OTP {mobile && `for ${mobile}`}
      </h3>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={otp[index] || ""}
            onChange={(e) => handleOtpChange(e, index)}
            onPaste={handlePaste}
            maxLength={1}
            placeholder="0"
            autoFocus={index === 0}
            style={{
              width: "30px",
              padding: "10px",
              marginTop: "15px",
              marginBottom: "15px",
              fontSize: "16px",
              letterSpacing: "5px",
              textAlign: "center",
            }}
          />
        ))}
      </div>

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
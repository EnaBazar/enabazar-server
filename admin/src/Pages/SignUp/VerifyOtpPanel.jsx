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

  // ✅ OTP input handler
  const handleOtpChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) setOtp(value);
  };

  // ✅ Paste support
  const handlePaste = (e) => {
    const cleaned = e.clipboardData.getData("Text").replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(cleaned);
    e.preventDefault();
  };

  // ✅ Clipboard API auto-fill for web
  useEffect(() => {
    if (!context?.openVerifyOtpPanel) return;
    const interval = setInterval(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (/^\d{6}$/.test(text) && text !== otp) {
          setOtp(text);
        }
      } catch (err) {
        // permission denied or unsupported, ignore
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [context?.openVerifyOtpPanel, otp]);

  // OTP Verify
  const handleVerify = async () => {
    if (!mobile) return context.openAlertBox("error", "Mobile number missing!");
    if (otp.length !== 6) return context.openAlertBox("error", "Please enter 6-digit OTP");

    try {
      setIsLoading(true);
      const res = await postData("/auth/verify-otp", { mobile: String(mobile), otp: String(otp) });
      setIsLoading(false);

      if (!res?.error) {
        context.openAlertBox("success", "আপনার নাম্বার সফলভাবে ভেরিফাই করা হয়েছে!");

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

  // Resend OTP
  const handleResend = async () => {
    if (!mobile) return;
    try {
      setIsLoading(true);
      const res = await postData("/auth/resend-otp", { mobile: String(mobile) });
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
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={context.closeOtpPanel} // বাইরে click করলে close হবে
    >
      <div
        onClick={(e) => e.stopPropagation()} // ভিতরে click করলে close হবে না
        style={{
          padding: 20,
          maxWidth: 400,
          width: "90%",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ textAlign: "center" }}>
          Verify OTP {mobile && `for ${mobile}`}
        </h3>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code" // Mobile auto-fill
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
    </div>
  );
};

export default VerifyOtpPanel;
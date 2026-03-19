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

  // ✅ WebOTP API auto-fill
  useEffect(() => {
    if (!("OTPCredential" in window)) return;

    let abortController = new AbortController();

    navigator.credentials.get({
      otp: { transport: ["sms"] },
      signal: abortController.signal
    }).then((otpCredential) => {
      if (otpCredential?.code) {
        setOtp(otpCredential.code);
        // auto-verify
        handleVerify(otpCredential.code);
      }
    }).catch((err) => {
      // ignore errors if user cancels or not supported
      console.log("WebOTP not available", err);
    });

    return () => abortController.abort();
  }, [context?.openVerifyOtpPanel]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(value);
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(pasteData);
    e.preventDefault();
  };

  const handleVerify = async (autoOtp) => {
    const otpToSend = autoOtp || otp;
    if (!mobile) return context.openAlertBox("error", "Mobile number missing!");
    if (otpToSend.length !== 6) return context.openAlertBox("error", "Please enter 6-digit OTP");

    try {
      setIsLoading(true);
      const res = await postData("/auth/verify-otp", { mobile: String(mobile), otp: otpToSend });
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
    } catch (err) {
      setIsLoading(false);
      context.openAlertBox("error", "Server error. Please try again.");
    }
  };

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
    } catch (err) {
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
      <h3 style={{ textAlign: "center" }}>Verify OTP {mobile && `for ${mobile}`}</h3>

      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
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
        onClick={() => handleVerify()}
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
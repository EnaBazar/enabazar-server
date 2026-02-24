import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';

const Register = () => {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Register, 2: OTP
  const [formFields, setFormFields] = useState({ name: "", mobile: "", password: "", otp: "" });

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  // Step 1: Register & send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await postData("/users/register", {
      name: formFields.name,
      mobile: formFields.mobile,
      password: formFields.password
    });
    setIsLoading(false);

    if (!res.error) {
      context.openAlertBox("success", "OTP sent to your mobile");
      setStep(2);
    } else {
      context.openAlertBox("error", res.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await postData("/users/verify-otp", {
      mobile: formFields.mobile,
      otp: formFields.otp
    });
    setIsLoading(false);

    if (!res.error) {
      context.openAlertBox("success", "Mobile verified successfully");
      setStep(1);
      setFormFields({ name: "", mobile: "", password: "", otp: "" });
    } else {
      context.openAlertBox("error", res.message);
    }
  };

  return (
    <div className="container mx-auto p-5">
      {step === 1 && (
        <form onSubmit={handleRegister} className="space-y-4 max-w-md mx-auto">
          <TextField label="Name" name="name" value={formFields.name} onChange={handleChange} fullWidth required />
          <TextField label="Mobile" name="mobile" value={formFields.mobile} onChange={handleChange} fullWidth required />
          <TextField label="Password" type="password" name="password" value={formFields.password} onChange={handleChange} fullWidth required />
          <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Register & Send OTP"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md mx-auto">
          <TextField label="OTP" name="otp" value={formFields.otp} onChange={handleChange} fullWidth required />
          <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default Register;
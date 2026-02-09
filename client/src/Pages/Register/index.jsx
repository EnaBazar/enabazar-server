import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [IsShowPassword, setIsShowPassword] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: ""
  });

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();
  window.scrollTo(0, 0);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(formFields).every(el => el);

  // SEND OTP
  const sendOtp = async () => {
    if (!formFields.mobile) {
      context.openAlertBox("error", "Please enter mobile number");
      return;
    }

    const res = await postData("/auth/send-otp", { mobile: formFields.mobile });
    if (res?.success) {
      setOtpSent(true);
      context.openAlertBox("success", "OTP sent successfully");
    } else {
      context.openAlertBox("error", res?.message);
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return context.openAlertBox("error", "Enter OTP");

    const res = await postData("/auth/verify-otp", {
      mobile: formFields.mobile,
      otp
    });

    if (res?.success) {
      setIsVerified(true);
      context.openAlertBox("success", "Mobile verified successfully");
    } else {
      context.openAlertBox("error", res?.message || "Invalid OTP");
    }
  };

  // REGISTER
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isVerified) {
      context.openAlertBox("error", "Please verify mobile number first");
      return;
    }

    setIsLoading(true);

    postData("/auth/registerPanel", {
      ...formFields,
      isPhoneVerified: true
    }).then((res) => {
      if (res?.error !== true) {
        context.openAlertBox("success", res?.message);
        setFormFields({ name: "", mobile: "", password: "" });
        history("/login");
      } else {
        context.openAlertBox("error", res?.message);
      }
      setIsLoading(false);
    });
  };

  // GOOGLE AUTH (unchanged)
  const authWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const user = result.user;

      const fields = {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        password: null,
        avatar: user.providerData[0].photoURL,
        mobile: user.providerData[0].phoneNumber,
        signUpWithGoogle: true,
        role: "USER"
      };

      postData("/auth/authWithGoogle", fields).then((res) => {
        if (res?.error !== true) {
          context.openAlertBox("success", res?.message);
          context.setIsLogin(true);
          history("/");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    });
  };

  return (
    <section className='section py-10'>
      <div className='container'>
        <div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>
          <h3 className='text-center text-[18px]'>Register with a new account</h3>

          <form className='w-full !mt-5' onSubmit={handleSubmit}>

            <TextField label="Full Name" name="name" value={formFields.name} onChange={onchangeInput} fullWidth className='!mb-4' />

            <TextField label="Mobile" name="mobile" value={formFields.mobile} onChange={onchangeInput} fullWidth className='!mb-2' disabled={isVerified} />

            {!otpSent && (
              <Button type='button' onClick={sendOtp} className='btn-org w-full !mb-4'>Send OTP</Button>
            )}

            {otpSent && !isVerified && (
              <>
                <TextField label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} fullWidth className='!mb-2' />
                <Button type='button' onClick={verifyOtp} className='btn-org w-full !mb-4'>Verify OTP</Button>
              </>
            )}

            <div className='relative !mb-4'>
              <TextField
                type={IsShowPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={formFields.password}
                onChange={onchangeInput}
                fullWidth
              />
              <Button className='!absolute !top-[10px] !right-[10px]' onClick={() => setIsShowPassword(!IsShowPassword)}>
                {IsShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </Button>
            </div>

            <Button type='submit' disabled={!valideValue || !isVerified || isLoading} className='btn-org w-full'>
              {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Register'}
            </Button>

            <p className='text-center mt-3'>Already have an account? <Link to="/login" className='link'>Sign In</Link></p>

            <p className='text-center font-[500]'>Or continue with social account</p>

            <Button onClick={authWithGoogle} className='flex gap-3 w-full !bg-[f1f1f1] btn-lg !text-black'>
              <FcGoogle /> SignUp with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';

const Register = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: ""
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value
    });
  };

  const validateValue = Object.values(formFields).every(el => el.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateValue) {
      context.openAlertBox("error", "সব তথ্য পূরণ করুন");
      return;
    }

    try {
      setIsLoading(true);

      const res = await postData("/auth/register", formFields);

      if (!res?.error) {

        context.openAlertBox("success", res?.message);

        // 👉 mobile save for OTP verify page
        localStorage.setItem("verifyMobile", formFields.mobile);

        // 👉 redirect to OTP page
        navigate("/verify-otp");

      } else {
        context.openAlertBox("error", res?.message);
      }

    } catch (error) {
      context.openAlertBox("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='section py-10'>
      <div className='container'>
        <div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>

          <h3 className='text-center text-[14px]'>
            আমাদের সাথে থাকার জন্য আপনার মোবাইল নাম্বার দিয়ে রেজিস্টেশন করুন!
          </h3>

          <form className='w-full !mt-5' onSubmit={handleSubmit}>

            {/* Name */}
            <div className='form-group w-full !mb-5'>
              <TextField
                type='text'
                name="name"
                value={formFields.name}
                disabled={isLoading}
                label="আপনার নাম"
                variant="outlined"
                className='w-full'
                onChange={onchangeInput}
              />
            </div>

            {/* Mobile */}
            <div className='form-group w-full !mb-5'>
              <TextField
                type='text'
                name="mobile"
                value={formFields.mobile}
                disabled={isLoading}
                label="মোবাইল নাম্বার"
                variant="outlined"
                className='w-full'
                onChange={onchangeInput}
              />
            </div>

            {/* Password */}
            <div className='form-group w-full !mb-5 relative'>
              <TextField
                type={isShowPassword ? 'text' : 'password'}
                label="পাসওয়ার্ড"
                name="password"
                value={formFields.password}
                disabled={isLoading}
                variant="outlined"
                className='w-full'
                onChange={onchangeInput}
              />
              <Button
                type="button"
                className='!absolute !top-[10px] !right-[10px]'
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ?
                  <IoMdEye className="text-[20px]" /> :
                  <IoMdEyeOff className="text-[20px]" />
                }
              </Button>
            </div>

            {/* Submit */}
            <div className='flex items-center w-full !mt-3 !mb-3'>
              <Button
                type='submit'
                disabled={!validateValue || isLoading}
                className='btn-org btn-lg w-full flex gap-3'
              >
                {isLoading ?
                  <CircularProgress size={22} color="inherit" />
                  :
                  'Register'
                }
              </Button>
            </div>

            <p className='text-center'>
              Already have an account?
              <Link
                className='link !text-[14px] !font-[600] !text-[#ff5252]'
                to="/login"
              > Sign In</Link>
            </p>

            <p className='text-center font-[500] mt-3'>
              Or continue with social account
            </p>

            <Button
              className='flex gap-3 w-full btn-lg !text-black'
            >
              <FcGoogle className='text-[20px]' />
              SignUp with Google
            </Button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
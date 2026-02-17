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
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    name: "",
    mobile: "",
    password: ""
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value
    });
  };

  const validateValue = Object.values(formFields).every(el => el !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateValue) {
      context.openAlertBox("error", "All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData("/auth/register", formFields);

      if (res?.error !== true) {
        context.openAlertBox("success", res?.message);

        // Mobile number OTP verify page এ পাঠাবে
        navigate("/verify-otp", {
          state: { mobile: formFields.mobile }
        });

        setFormFields({
          name: "",
          mobile: "",
          password: ""
        });

      } else {
        context.openAlertBox("error", res?.message);
      }

    } catch (error) {
      context.openAlertBox("error", "Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <section className='section py-10'>
      <div className='container'>
        <div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>

          <h3 className='text-center text-[18px] font-[500]'>
            Register with a new account
          </h3>

          <form className='w-full !mt-5' onSubmit={handleSubmit}>

            <div className='form-group !mb-5'>
              <TextField
                type='text'
                name="name"
                label="Full Name"
                value={formFields.name}
                disabled={isLoading}
                variant="outlined"
                fullWidth
                onChange={onChangeInput}
              />
            </div>

            <div className='form-group !mb-5'>
              <TextField
                type='tel'
                name="mobile"
                label="Mobile Number"
                value={formFields.mobile}
                disabled={isLoading}
                variant="outlined"
                fullWidth
                onChange={onChangeInput}
              />
            </div>

            <div className='form-group !mb-5 relative'>
              <TextField
                type={isShowPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                value={formFields.password}
                disabled={isLoading}
                variant="outlined"
                fullWidth
                onChange={onChangeInput}
              />

              <Button
                type="button"
                className='!absolute !top-[10px] !right-[10px] !min-w-[35px]'
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ?
                  <IoMdEye className="text-[20px]" /> :
                  <IoMdEyeOff className="text-[20px]" />}
              </Button>
            </div>

            <div className='mt-3 mb-3'>
              <Button
                type='submit'
                disabled={!validateValue || isLoading}
                className='btn-org btn-lg w-full flex gap-3'
              >
                {
                  isLoading
                    ? <CircularProgress size={24} color="inherit" />
                    : "Register"
                }
              </Button>
            </div>

            <p className='text-center'>
              Already have an account?
              <Link
                className='link ml-1 font-[600] text-[#ff5252]'
                to="/login"
              >
                Sign In
              </Link>
            </p>

            <p className='text-center font-[500] mt-3'>
              Or continue with social account
            </p>

            <Button
              type="button"
              className='flex gap-3 w-full bg-gray-100 btn-lg text-black'
            >
              <FcGoogle className='text-[20px]' />
              SignUp with Google
            </Button>

          </form>
        </div>
      </div>
    </section>
  )
}

export default Register;

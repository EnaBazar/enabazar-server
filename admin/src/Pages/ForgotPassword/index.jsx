import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import Button from '@mui/material/Button';
import { Input } from '@mui/material';


const ForgotPassword = () => {
  
  

  return (
    
 <section className='bg-[#f1f1f1] w-full min-h-screen px-4'>
  {/* Header */}
  <header className='w-full fixed top-0 left-0 px-4 py-5 flex flex-col sm:flex-row items-center justify-between z-50 bg-white shadow-sm'>
    <div className='py-2 px-4 flex items-center w-full sm:w-auto'>
      <Link to="/" className='w-[200px]'>
        <p>
          <span className='font-extrabold text-[32px] text-[#ff5252]'>
            F<span className='font-bold text-[25px] text-black'>enix</span>
          </span>
        </p>
      </Link>
    </div>
    <div className='flex gap-2 mt-2 sm:mt-0'>
      <NavLink to="/login" exact="true" activeclassname="isActive">
        <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-4 flex gap-1'>
          <CgLogIn className='text-[18px]' /> Login
        </Button>
      </NavLink>
      <NavLink to="/sign-up" exact="true" activeclassname="isActive">
        <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-4 flex gap-1'>
          <FaRegUser className='text-[14px]' /> SignUp
        </Button>
      </NavLink>
    </div>
  </header>

  {/* Reset Password Box */}
  <div className='loginBox card w-full max-w-md mx-auto mt-28 p-6 bg-white rounded-lg shadow-md relative z-50'>
    <h1 className='text-center text-[24px] font-extrabold mb-6'>
      Having trouble to sign in? <br />Reset your Password
    </h1>

    <form className='w-full flex flex-col gap-4'>
      {/* Email Input */}
      <div className='flex flex-col w-full'>
        <label className='mb-2 text-sm font-semibold'>
          Email <span className='text-red-500'>*</span>
        </label>
        <Input
          type='email'
          placeholder='Enter your Email'
          className='w-full h-[40px] border border-gray-300 rounded-sm focus:border-gray-700 focus:outline-none px-3'
        />
      </div>

      {/* Reset Button */}
      <Button className='btn-blue w-full py-2 mt-4'>Reset Password</Button>

      {/* Footer Link */}
      <div className='text-center mt-4 flex items-center justify-center gap-2'>
        <span className='text-[13px]'>Don't want to Reset?</span>
        <Link to="/login" className='text-blue-600 text-[14px] font-semibold hover:underline'>
          Sign in
        </Link>
      </div>
    </form>
  </div>
</section>


  );
};
export default ForgotPassword;

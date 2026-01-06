import React, { useState,useContext, useEffect } from 'react'
import { Link, NavLink , useNavigate } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import OtpBox from '../../Components/OtpBox';
import Button from '@mui/material/Button';
import { postData } from '../../utils/api.js';
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';



const VerifyAccount = () => {
  
   const [isLoading,setIsLoading]= useState(false);
  const [otp,setOtp] =useState("");
  const handleOtpChange =(value)=>{
    setOtp(value);
  }
  
  
  useEffect(()=>{
   
    
    
  },[])
  
  
  const history = useNavigate();
  const context =useContext(MyContext);
  
   const verityOTP = (e) => {
      
    e.preventDefault();  

   if(otp!==""){
     setIsLoading(true);
         const actionType = localStorage.getItem("actionType");
          
    if(actionType!=="forgot-password"){
      postData("/auth/verifyemail",
        { email:localStorage.getItem("userEmail") ,
        otp: otp       
      }).then((res)=> {
      if(res?.error === false){
        context.openAlertBox("success", res?.message);
        localStorage.removeItem("userEmail")
        setIsLoading(false);
        history("/login")
        
      }else{
        context.openAlertBox("error", res?.message);
             setIsLoading(false);
      }
      })
      
    }else{
      
      postData("/auth/verify-forgot-password-otp",
        { email:localStorage.getItem("userEmail") ,
        otp: otp       
      }).then((res)=> {
      if(res?.error === false){
        context.openAlertBox("success", res?.message);
      
        history("/change-password")
        
      }else{
        context.openAlertBox("error", res?.message);
             setIsLoading(false);
      }
      })
    }
     
   }else{
     context.openAlertBox("error", "Please Enter Correct Otp");
          setIsLoading(false);
     
   }
      

   
    }
   
  
  
    
 return (
    
   <section className='bg-[#f1f1f1] w-full min-h-screen px-4'>
  {/* Header */}
 <header className='w-full fixed top-0 left-0 px-4 py-5 flex flex-col sm:flex-row items-center justify-between z-50 bg-white shadow-sm'>


  {/* Navigation Buttons */}
  <div className='flex gap-2 mt-2 sm:mt-0'>
    <NavLink to="/login" exact="true" activeclassname="isActive">
      <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-4 flex items-center gap-1'>
        <CgLogIn className='text-[18px]' /> Login
      </Button>
    </NavLink>
    <NavLink to="/sign-up" exact="true" activeclassname="isActive">
      <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-4 flex items-center gap-1'>
        <FaRegUser className='text-[14px]' /> SignUp
      </Button>
    </NavLink>
  </div>
</header>


  {/* OTP Verification Box */}
  <div className='loginBox w-full max-w-md mx-auto mt-28 p-6 relative z-50'>
    <h1 className='text-center text-2xl sm:text-3xl font-extrabold mb-6'>
      Welcome Back <br />Please verify Your Account.
    </h1>

    <div className='card w-full bg-white shadow-md rounded-md p-5 sm:px-8'>
      <div className='flex justify-center mb-4'>
        <img src='/verify.png' className='w-14 sm:w-16' alt='Verify Icon' />
      </div>

      <h3 className='text-center text-lg sm:text-xl font-semibold mb-1'>Verify OTP</h3>
      <p className='text-center text-sm sm:text-base mb-4'>
        OTP sent to <span className='text-[#ff5252] font-bold'>{localStorage.getItem("userEmail")}</span>
      </p>

      <form onSubmit={verityOTP} className='flex flex-col items-center gap-4'>
        <OtpBox length={6} onChange={handleOtpChange} />

        <button type="submit" className='w-full sm:w-[300px] btn-blue py-2 mt-4 flex justify-center items-center'>
          {isLoading ? <CircularProgress color="inherit" size={20} /> : 'Verify OTP'}
        </button>
      </form>
    </div>
  </div>
</section>


  );
};
export default VerifyAccount;

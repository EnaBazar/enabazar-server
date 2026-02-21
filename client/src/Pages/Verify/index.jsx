import React, { useEffect, useState } from 'react'
import OtpBox from '../../Components/OtpBox';
import Button  from '@mui/material/Button';
import { postData } from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App.jsx';
import { useContext } from 'react';
import  CircularProgress  from '@mui/material/CircularProgress';

const Verify = () => {
  
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
      context.openAlertBox("success",res?.message);
      localStorage.removeItem("userEmail")
      history("/login")
      
    }else{
      context.openAlertBox("error",res?.message);
            setIsLoading(false);
    }
    })
    
  }else{
    
    postData("/auth/verify-forgot-password-otp",
      { email:localStorage.getItem("userEmail") ,
   otp: otp  
    }).then((res)=> {
    if(res?.error===false){
      context.openAlertBox("success",res?.message);
    
      history("/forgot-password")
      
    }else{
      context.openAlertBox("error",res?.message);
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

    <section className='section py-10'>
      <div className='container'>
      <div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>
      
      <div className='text-center flex items-center justify-center'>
      
      <img src='/public/verify.png' width="60"/>
      </div>
   <h3 className='text-center text-[18px] text-[200] !mt-4 !mb-1'>Verify Otp</h3>
   
   <p className='text-center !mt-0 !mb-4'>OTP send to <span className='text-[#ff5252] font-bold'>{localStorage.getItem("userEmail")}</span></p>
 
 
  <form onSubmit={verityOTP}>
  
  <div className='text-center flex items-center justify-center flex-col'>
  <OtpBox length={6} onChange={handleOtpChange}/>
   </div>
   <br/>
   
   <div className='w-[300px] m-auto'>
   <Button type="submit" className='w-full btn-org btn-sm'>{
     
     isLoading === true ? <CircularProgress color="inherit"/>
     
     :
     'Verify Otp'
   }</Button>
   </div>
  
  
  </form>
   
      </div>
      </div>  
      </section>
    
  )
}
export default Verify;

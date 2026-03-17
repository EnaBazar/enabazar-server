import React from 'react'
import { Link, NavLink,useNavigate } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import Button from '@mui/material/Button';
import { FormControlLabel, Input, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useContext } from 'react';
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { editData, postData } from '../../utils/api';
import { useState } from 'react';
import { useEffect } from 'react';

const Login = () => {
  
   const [isLoading,setIsLoading]= useState(false);
   const [userId, setUserId] = useState("");
   const [errors, setErrors] = useState({ mobile: "" });
    const bdMobileRegex = /^01[3-9]\d{8}$/;
    const [formFields,setFormFields]= useState({
         
       mobile:"",
       name:""
         
      });
      const context = useContext(MyContext)
      const history = useNavigate();
      


  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);

   
    }
  }, [context?.userData]);





   const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "").slice(0, 11);

      setFormFields((prev) => ({ ...prev, mobile: numericValue }));

      if (!bdMobileRegex.test(numericValue)) {
        setErrors({ mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন" });
      } else {
        setErrors({ mobile: "" });
      }
    } else {
      setFormFields((prev) => ({ ...prev, [name]: value }));
    }
  };
    const onchangeInput=(e)=>{
      
      const {name,value} = e.target;
      setFormFields(()=>{
        return{
          ...formFields,
          [name]:value
        }
      })
    }
    
        const valideValue = Object.values(formFields).every(el => el)

        const isValid =
    formFields.name.trim().length >= 3 &&
    bdMobileRegex.test(formFields.mobile) &&
    !errors.mobile;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!isValid) return;
  
      setIsLoading(true);
  
      editData(`/auth/loginOtp${userId}`, formFields, { withCredentials: true }).then(
        (res) => {
          setIsLoading(false);
  
          if (!res?.data?.error) {
            context.openAlertBox("success", res?.data?.message || "Profile Updated");
     
     
            const Mobile = formFields.mobile;
            context.openUpdateOtpPanel({ mobile: Mobile });
         
        
         
          } else {
            context.openAlertBox("error", res?.data?.message || "Update Failed");
          }
        }
      );
    };
    

  return (
    
    <section className=' bg-[#f1f1f1 w-full '>
    <header className='w-full static lg:fixed top-0 left-0 px-4 py-5 flex items-center  justify-center
    sm:justify-between z-50'>
    
     <div className="col1 w-[50%] lg:w-[10%] flex items-center 
     justify-end ">

    <img src="/logo.png"/>
 
</div>
      
       
 <div className='hidden sm:flex items-center gap-0 '>
 <NavLink to="/login" exact="true" activeclassname="isActive">
 <Button className='!rounded-full !text-[rgba(0,0,0,0.8)]
  !px-4 flex gap-1'>
 <CgLogIn className='text-[18px]'/>Login
 </Button>
 
 </NavLink>

 <NavLink to="/sign-up" exact="true" activeclassname="isActive">
 <Button className='!rounded-full !text-[rgba(0,0,0,0.8)]
  !px-4 flex gap-1'>
 <FaRegUser className='text-[14px]'/>SignUp
 </Button>
 </NavLink>
 </div>
    </header>
   
   
   <div className='loginBox card w-full md:w-[600px] h-[auto] pb-25 mx-auto pt-0 lg:pt-20 relative z-50'>
  
       
   
       
       <br/>
       
       <div className='w-full flex items-center justify-center gap-3'>
     <h1 className='text-center text-[18px] !px-10 sm:text-[30px] font-[800] mt-4'>আপনার মোবাইল নাম্বার দিয়ে প্রবেশ করুন!</h1>
       
   
       </div>
       
       <br/><br/>
       
       <form className='w-full !px-10 ' onSubmit={handleSubmit}>
<div className='form-group w-full !mb-5 relative'>
 <TextField
          label="Full Name"
          size="small"
          name="name"
          value={formFields.name}
          onChange={handleChange}
  className='w-full' 
  
  />

</div>
<div className='form-group w-full !mb-5'>
<TextField
          label="Mobile Number"
          size="small"
          name="mobile"
          value={formFields.mobile}
          onChange={handleChange}
          placeholder="01XXXXXXXXX"
          error={!!errors.mobile}
          helperText={errors.mobile}
  className='w-full' 

  />

</div>
       
       
           
       <div className='form-group mb-4 w-full flex items-center justify-between'>
       <FormControlLabel 
       control={<Checkbox defaultChecked/>}
       label="Remember Me"
       />
       
    
       </div>

       <div className='flex items-center justify-between mb-3'>
<span className='text-[13px]'>Don`t have a Account?</span>
      <Link to="/sign-up"
    
       className='text-blue-600 
       text-[14px] font-[700] hover: cursor-pointer'>
     Sign Up
     </Link>

       </div>
       
<Button type='submit' disabled={!valideValue} className='btn-blue btn-lg w-full cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Login'
}

</Button>
       </form>
       
       
   </div>
   
   
   </section>

  );
};
export default Login;

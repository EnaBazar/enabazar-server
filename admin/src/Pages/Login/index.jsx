import React from 'react'
import { Link, NavLink,useNavigate } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import { FormControlLabel} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useContext } from 'react';
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import { useState } from 'react';
import { TextField, Button } from "@mui/material";




const Login = () => {
    const context = useContext(MyContext)
  const [isLoading,setIsLoading]= useState(false);
  const [IsShowPassword,setIsShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const bdMobileRegex = /^01[3-9]\d{8}$/;

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
  });
  const [formFields,setFormFields]= useState({       
       mobile:"",
       name:"" 
      });
 const history = useNavigate();
      
  
  const onchangeInput  = (e) => {
  const { name, value } = e.target;

  if (name === "mobile") {
    const numericValue = value.replace(/\D/g, "").slice(0, 11);
    setFormFields((prev) => ({
      ...prev,
      mobile: numericValue,
    }));

    if (!bdMobileRegex.test(numericValue)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mobile: "",
      }));
    }

  } else if (name === "name") {

    setFormFields((prev) => ({ ...prev, name: value }));

    if (value.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        name: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
    }

  } 
};
    
const valideValue = Object.values(formFields).every(el => el)  

const handleSubmit = (e) => {
  e.preventDefault();
  setIsLoading(true);  // লোডিং শুরু

  // মোবাইল নাম্বার চেক করা হচ্ছে
  if (formFields.mobile === "") {
    context.openAlertBox("error", "Please enter your mobile number");
    setIsLoading(false); // লোডিং বন্ধ
    return false;
  }

  // নাম চেক করা হচ্ছে
  if (formFields.name === "") {
    context.openAlertBox("error", "Please enter your name");
    setIsLoading(false); // লোডিং বন্ধ
    return false;
  }

  postData("/auth/loginotp", formFields, { withCredentials: true })
    .then((res) => {
      if (res?.error !== true) {
        if (res?.message === "আপনাকে প্রবেশের জন্য অনুমতি নিতে হবে") {
          // এই মেসেজ যদি আসে, তাহলে লোডিং বন্ধ করে আলার্ট দেখান
          context.openAlertBox("error", res?.message);
          setIsLoading(false); // লোডিং বন্ধ
          return;
        }

        // OTP successfully sent, OTP প্যানেল খুলুন
        context.openAlertBox("success", "OTP পাঠানো হয়েছে");
        context.openOtpPanel({
          mobile: formFields.mobile,
          type: "login"
        });

        setIsLoading(false);  // লোডিং বন্ধ
      } else {
        context.openAlertBox("error", res?.message);
        setIsLoading(false);  // লোডিং বন্ধ
      }
    })
    .catch((err) => {
      // কোনো সার্ভার বা নেটওয়ার্ক সমস্যা হলে
      context.openAlertBox("error", "Something went wrong. Please try again later.");
      console.error("Error:", err);
      setIsLoading(false); // লোডিং বন্ধ
    });
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
 <CgLogIn className='text-[18px]'/>Login here
 </Button>
 
 </NavLink>

 <NavLink to="/sign-up" exact="true" activeclassname="isActive">
 <Button className='!rounded-full !text-[rgba(0,0,0,0.8)]
  !px-4 flex gap-1'>
 <FaRegUser className='text-[14px]'/>SignUp here
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
type='text'
id="name"
 label="আপনার নাম"
  name='name'
value={formFields.name}
disabled={isLoading===true ? true : false}
onChange={onchangeInput}
  variant="outlined"
  className='w-full'   
  />
<Button  className='!absolute !top-[10px] !right-[10px] z-50 !w-[35x]
 !h-[35px] !min-w-[35px] !rounded-full 
 !text-black' onClick={()=>{setIsShowPassword(!IsShowPassword)}}>
 {
    IsShowPassword===true ?  <IoMdEye className="text-[20px] opacity-75"/> :  <IoMdEyeOff className="text-[20px] opacity-75"/>
 }
</Button>
</div>
<div className='form-group w-full !mb-5'>
<TextField 
type='number'
id="mobile"
name="mobile"
value={formFields.mobile}
disabled={isLoading===true ? true : false}
onChange={onchangeInput}
 label="মোবাইল নাম্বার"
  variant="outlined"
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
<span className='text-[13px]'>আগের রেজিস্ট্রোেশন সা থাকলে ?</span>
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

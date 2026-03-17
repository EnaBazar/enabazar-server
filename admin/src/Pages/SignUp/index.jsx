import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import {FcGoogle} from "react-icons/fc"
import Button from '@mui/material/Button';
import { BsFacebook } from 'react-icons/bs';
import { FormControlLabel, Input, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import  CircularProgress  from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { postData } from '../../utils/api.js';



const SignUp = () => {
  
   const [isLoading,setIsLoading]= useState(false);
  const [loadingFacBook, setLoadingFaceBook] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);
  const [IsShowPassword,setIsShowPassword] = useState(false);
 const bdMobileRegex = /^01[3-9]\d{8}$/;

const [errors, setErrors] = useState({
  name: "",
  mobile: "",
  password: ""
});
     const [formFields,setFormFields]= useState({
      name:"",
      mobile:"",
      password:""
    })
    
    
    const context = useContext(MyContext)
    const history = useNavigate();
    
 const onchangeInput = (e) => {
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

  } else if (name === "password") {

    setFormFields((prev) => ({ ...prev, password: value }));

    if (value.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        password: "পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }
};
    
    const valideValue = Object.values(formFields).every(el => el)
    
const handleSubmit = (e) => {
  e.preventDefault();

  if (!bdMobileRegex.test(formFields.mobile)) {
    context.openAlertBox("error", "সঠিক মোবাইল নাম্বার দিন");
    return;
  }

  if (formFields.name.trim().length < 3) {
    context.openAlertBox("error", "নাম কমপক্ষে ৩ অক্ষরের হতে হবে");
    return;
  }

  if (formFields.password.trim().length < 3) {
    context.openAlertBox("error", "পাসওয়ার্ড দিন");
    return;
  }

  setIsLoading(true);

  postData("/auth/register", formFields).then((res) => {

    setIsLoading(false);

    if (!res?.error) {

      context.openAlertBox("success", res?.message || "Registered Successfully");

      // ✅ OTP PANEL OPEN
      context?.openOtpPanel({
        mobile: formFields.mobile
      });

      // reset form
      setFormFields({
        name: "",
        mobile: "",
        password: ""
      });

    } else {
      context.openAlertBox("error", res?.message);
    }
  });
};
 


  return (
    
    <section className=' bg-[#f1f1f1 w-full '>
    <header className='w-full static lg:fixed top-0 left-0 px-4 py-5 flex items-center  justify-center
    sm:justify-between z-50'>
   
         <div className="col1 w-[50%] lg:w-[10%] flex items-center 
     justify-end ">
      <Link to={"/"}> 
        <img src="/logo.png"/>
      </Link>
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
  
       
       
       <h1 className='text-center text-[18px] sm:text-[30px] font-[800] mt-4'>Join us today! Get Special<br/> benefits and stay up-to-date.</h1>
       
  
       <br/>
       
     
       
      
       <form className='w-full !px-10' onSubmit={handleSubmit}>
  
       <div className='form-group w-full !mb-5'>
<TextField
  name="name"
  value={formFields.name}
  onChange={onchangeInput}
  error={!!errors.name}
  helperText={errors.name}
  label="Full Name"
    className='w-full'
/>
       </div>
       <div className='form-group w-full !mb-5'>
<TextField
  type="text"
  name="mobile"
  value={formFields.mobile}
  onChange={onchangeInput}
  error={!!errors.mobile}
  helperText={errors.mobile}
     className='w-full' 
  label="Mobile"
/>
       
       </div>
       <div className='form-group w-full !mb-5 relative'>
<TextField
  type={IsShowPassword ? "text" : "password"}
  name="password"
    className='w-full'
  value={formFields.password}
  onChange={onchangeInput}
  error={!!errors.password}
  helperText={errors.password}
  label="Password"
/>
       <Button className='!absolute !top-[10px] !right-[10px] z-50 !w-[35x]
        !h-[35px] !min-w-[35px] !rounded-full 
        !text-black' onClick={()=>{setIsShowPassword(!IsShowPassword)}}>
        {
           IsShowPassword===true ?  <IoMdEye className="text-[20px] opacity-75"/> :  <IoMdEyeOff className="text-[20px] opacity-75"/>
        }
       </Button>
       </div>
       
           
       <div className='form-group mb-4 w-full flex items-center justify-between'>
       <FormControlLabel 
       control={<Checkbox defaultChecked/>}
       label="Remember Me"
       />
       
       <Link to="/forgot-password" className='text-blue-600 text-[14px] font-[700] hover:underline'>Forgot Password ?</Link>
       </div>
       

       <div className='flex items-center justify-between mb-3'>
<span className='text-[13px]'>Already have a Account?</span>
      <Link to="/login"
    
       className='text-blue-600 
       text-[14px] font-[700] hover: cursor-pointer'>
     Sign In
     </Link>

       </div>



     <Button type='submit' disabled={!valideValue} className='btn-blue btn-lg w-full cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Sign Up'
}

</Button>

       </form>
       
       
   </div>
   
   
   </section>

  );
};
export default SignUp;

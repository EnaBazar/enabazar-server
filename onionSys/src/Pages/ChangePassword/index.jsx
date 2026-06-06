import React, {useState,useContext} from 'react';
import { Link, NavLink } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import {useNavigate } from "react-router-dom";
import { MyContext } from '../../App.jsx';
import  CircularProgress  from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';





const ChangePassword = () => {
  
     const [IsShowPassword, setIsShowPassword] = useState(false);
  const [IsShowPassword2, setIsShowPassword2] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
  
    const [formFields, setFormFields] = useState({
         email: localStorage.getItem("userEmail"),
         newPassword: "",
         confirmPassword: ""
         
      });
  const context = useContext(MyContext);
  const history = useNavigate();
      
  const onChangeInput = (e) => {
        
     const { name, value } = e.target;
     setFormFields(() => {
     return {
     ...formFields,
     [name]: value
     }
     })
   }
   
   const valideValue = Object.values(formFields).every(el => el)
   
   
     const handleSubmit=(e)=>{
         
         e.preventDefault();
         setIsLoading(true)
         
         if(formFields.newPassword==="")
           
           {
           context.openAlertBox("error","Please entry your newPassword")
       
           return false
           }     
           if(formFields.confirmPassword==="")
           {
           context.openAlertBox("error","Please entry your confirmPassword")
        
           return false
           }
           if(formFields.confirmPassword !== formFields.newPassword)
           {
           context.openAlertBox("error","passwod and confirmPassword not match")
        setIsLoading(false);
           return false
           }
       
       postData(`/auth/reset-password`, formFields).then((res) => {
          
       
          if(res?.error===false) {
             
          localStorage.removeItem("userEmail")
          localStorage.removeItem("actionType") 
         context.openAlertBox("success",res?.message);
         setIsLoading(false);
          history("/login")  
             
          }else{
             context.openAlertBox("error",res?.message);
              setIsLoading(false)
          }
     
       })
       
       
       }
  
  
  
  
  
  


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

  {/* Change Password Box */}
  <div className='loginBox card w-full max-w-md mx-auto mt-28 p-6 bg-white rounded-lg shadow-md relative z-50'>
    <h1 className='text-center text-[24px] font-extrabold'>Welcome Back!<br />You Can Change Password from Here..</h1>
    <form className='w-full mt-6 flex flex-col gap-4' onSubmit={handleSubmit}>
      
      {/* New Password */}
      <div className='relative w-full'>
        <label className='block mb-2 text-sm font-semibold'>
          New Password <span className='text-red-500'>*</span>
        </label>
        <Input
          type={IsShowPassword ? 'text' : 'password'}
          variant="outlined"
          name='newPassword'
          value={formFields.newPassword}
          disabled={isLoading}
          onChange={onChangeInput}
          placeholder='Enter your New Password'
          className='w-full h-[40px] border border-gray-300 rounded-sm focus:border-gray-700 focus:outline-none px-3'
        />
        <Button
          type='button'
          className='absolute top-1/2 right-2 -translate-y-1/2 !w-9 !h-9 rounded-full text-black p-1'
          onClick={() => setIsShowPassword(!IsShowPassword)}
        >
          {IsShowPassword ? <IoMdEye className="text-[20px] opacity-75" /> : <IoMdEyeOff className="text-[20px] opacity-75" />}
        </Button>
      </div>

      {/* Confirm Password */}
      <div className='relative w-full'>
        <label className='block mb-2 text-sm font-semibold'>
          Confirm Password <span className='text-red-500'>*</span>
        </label>
        <Input
          type={IsShowPassword2 ? 'text' : 'password'}
          variant="outlined"
          name='confirmPassword'
          value={formFields.confirmPassword}
          disabled={isLoading}
          onChange={onChangeInput}
          placeholder='Enter your Confirm Password'
          className='w-full h-[40px] border border-gray-300 rounded-sm focus:border-gray-700 focus:outline-none px-3'
        />
        <Button
          type='button'
          className='absolute top-1/2 right-2 -translate-y-1/2 !w-9 !h-9 rounded-full text-black p-1'
          onClick={() => setIsShowPassword2(!IsShowPassword2)}
        >
          {IsShowPassword2 ? <IoMdEye className="text-[20px] opacity-75" /> : <IoMdEyeOff className="text-[20px] opacity-75" />}
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={!valideValue}
        className='btn-blue w-full py-2 mt-4 flex justify-center'
      >
        {isLoading ? <CircularProgress size={20} /> : 'Reset Password'}
      </Button>
    </form>
  </div>
</section>


  );
};
export default ChangePassword;

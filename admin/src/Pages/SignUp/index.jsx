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
 
     const [formFields,setFormFields]= useState({
      name:"",
      mobile:"",
      password:""
    })
    
    
    const context = useContext(MyContext)
    const history = useNavigate();
    
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
    
const handleSubmit=(e)=>{
  
  e.preventDefault();
  setIsLoading(true)
  
  
  if(formFields.name==="")
  {
    context.openAlertBox("error","Please add full name")
    return false
  }
  
  if(formFields.mobile==="")
    {
      context.openAlertBox("error","Please entry your mobile")
      return false
    }
    
    if(formFields.password==="")
      {
        context.openAlertBox("error","Please entry your Password")
        return false
      } 
  
  postData("/auth/register",formFields).then((res)=>{
    console.log(res)
    
    
    if(res?.error !== true){
      setIsLoading(false)
      context.openAlertBox("success",res?.message);
      localStorage.setItem("userEmail",formFields.mobile)
      setFormFields({
      name:"",
      mobile:"",
      password:""
      })

    }else{
      context.openAlertBox("error",res?.message);
      setFormFields({
     name:"",
      mobile:"",
      password:""
      })
      setIsLoading(false);
     
    }
   
  })
}
 
  function handleClickGoogle() {
    setLoadingGoogle(true);
  }
  
  
  
  function handleClickFaceBook() {
    setLoadingFaceBook(true);
  }

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
       
       <div className='flex items-center justify-center w-full mt-5 gap-2'>
       <Button
          size="small"
          onClick={handleClickGoogle}
          endIcon={<FcGoogle className='!text-[25px]'/>}
          loading={loadingGoogle}
          loadingPosition='end'
          variant="outlined"
        className='!bg-none !py-2 !text-[14px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)]'
        >
        signing with Google
        </Button>
        
     
        
        
       </div>
       
       <br/>
       
       <div className='w-full flex items-center justify-center gap-3'>
       <span className='flex items-center w-[100px] h-[1px] bg-gray-500'></span>
       <span className='text-[10px] lg:text-[13px] font-[500]' >Or, Sign in with your email</span>
       <span className='flex items-center w-[100px] h-[1px] bg-gray-500'></span>
       </div>
       
       <br/><br/>
       
       <form className='w-full !px-10' onSubmit={handleSubmit}>
  
       <div className='form-group w-full !mb-5'>
       <TextField 
       type='text'
       id="name"
       name="name"
       value={formFields.name}
       disabled={isLoading===true ? true : false}
        label="Full Name"
         variant="outlined"
         className='w-full' 
         onChange={onchangeInput}
         />
       </div>
       <div className='form-group w-full !mb-5'>
       <TextField 
       type='number'
       id="mobile"
       name="mobile"
       value={formFields.mobile}
       disabled={isLoading===true ? true : false}
        label="Mobile"
         variant="outlined"
         className='w-full' 
         onChange={onchangeInput}
         />
       
       </div>
       <div className='form-group w-full !mb-5 relative'>
       <TextField 
       type={IsShowPassword===false ? 'password': 'text'}
       id="Password"
        label="Password*"
        name="password"
        value={formFields.password}
        disabled={isLoading===true ? true : false}
         variant="outlined"
         className='w-full' 
         onChange={onchangeInput}
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

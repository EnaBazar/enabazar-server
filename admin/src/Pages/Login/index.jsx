import React from 'react'
import { Link, NavLink,useNavigate } from 'react-router-dom';
import {CgLogIn} from "react-icons/cg"
import {FaRegUser} from "react-icons/fa6"
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import {FcGoogle} from "react-icons/fc"
import Button from '@mui/material/Button';
import { BsFacebook } from 'react-icons/bs';
import { FormControlLabel, Input } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useContext } from 'react';
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import { useState } from 'react';

const Login = () => {
  
   const [isLoading,setIsLoading]= useState(false);
    const [IsShowPassword,setIsShowPassword] = useState(false);
  const [loadingFacBook, setLoadingFaceBook] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);
  
    const [formFields,setFormFields]= useState({
         
         email:"",
         password:""
         
      });
      const context = useContext(MyContext)
      const history = useNavigate();
      
      
  
  
  function handleClickGoogle() {
    setLoadingGoogle(true);
  }
  
  
  
  function handleClickFaceBook() {
    setLoadingFaceBook(true);
  }
  


    const forgotPassword =()=>{

      
        if(formFields.email===""){
           
         context.openAlertBox("error","Please entry your Eamil")
         return false; 
        }else{
      
           localStorage.setItem("userEmail",formFields.email)
           localStorage.setItem("actionType",'forgot-password')
           
               postData("/auth/forgot-password",
             { email:formFields.email ,
                
           }).then((res)=> {
           if(res?.error===false){
             context.openAlertBox("success",res?.message);
             history("/verify-account")          
           }else{
             context.openAlertBox("error",res?.message);
           }
           })
           
        }
         
       
    }
    
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
      
      if(formFields.email==="")
        {
          context.openAlertBox("error","Please entry your Eamil")
          return false
        }
        
        if(formFields.password==="")
          {
            context.openAlertBox("error","Please entry your Password")
            return false
          }
      
      postData("/auth/login",formFields,{withCredentials:true}).then((res)=>{
        console.log(res)
        if(res?.error !== true){
          setIsLoading(false)
          context.openAlertBox("success",res?.message);
      
          setFormFields({
            email: "",
            password: ""
          })
     
     localStorage.setItem("accesstoken",res?.data?.accesstoken)     
     localStorage.setItem("refreshtoken",res?.data?.refreshtoken)
     
     context.setIsLogin(true);
          history("/")
        }else{
          context.openAlertBox("error",res?.message);
          setFormFields({
            email: "",
            password: ""
          })
          setIsLoading(false);
         
        }
       
      })
    }
    

  return (
    
    <section className=' bg-[#f1f1f1 w-full '>
    <header className='w-full static lg:fixed top-0 left-0 px-4 py-5 flex items-center  justify-center
    sm:justify-between z-50'>
    
 
       <Link to="/" className='w-[200px]'> <p><span className='font-[800] text-[32px] text-[#ff5252]'>F
       <span className=' font-bold text-[25px] text-black'>enix</span></span></p></Link>
      
       
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
  
       
       
       <h1 className='text-center text-[18px] sm:text-[30px] font-[800] mt-4'>Welcome Back <br/>Sign in with Credentials.</h1>
       
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
       <span className='text-[10px] lg:text-[13px] font-[500]'>Or, Sign in with your email</span>
       <span className='flex items-center w-[100px] h-[1px] bg-gray-500'></span>
       </div>
       
       <br/><br/>
       
       <form className='w-full !px-10 ' onSubmit={handleSubmit}>
       <div className='form-group mb-4 w-full'>
       <h4 className='mb-2 text-[14px]  font-[600]'>Email<span className='text-[red] font-[500]'> *</span></h4>
       <Input 
       type='email'
        placeholder='Enter your Email'
      name="email"
      value={formFields.email}
      disabled={isLoading===true ? true : false}
      onChange={onchangeInput}
      variant="outlined"
      className='w-full  h-[40px]
       border border-[rbga(0,0,0,0.1)] 
       rounded-sm focus:border-[rgba(0,0,0,0.7)]
        focus:outline-none px-3'     
         />
       </div>
       
       
       <div className='form-group mb-4 w-full'>
       <h4 className='mb-2 text-[14px]  font-[600]'>Password<span className='text-[red] font-[500]'> *</span></h4>
       <div className='relative w-full'>
       <Input  
       placeholder='Enter your Password' 
       type={IsShowPassword===false ? 'password': 'text'}
       name='password'
       value={formFields.password}
       disabled={isLoading===true ? true : false}
       onChange={onchangeInput}
       variant="outlined"
       className='w-full  h-[40px]
        border border-[rbga(0,0,0,0.1)] 
        rounded-sm focus:border-[rgba(0,0,0,0.7)] 
        focus:outline-none px-3'   
        />
        
        <Button  className='!absolute !top-[5px] !right-[10px] z-50 !w-[35x]
         !h-[35px] !min-w-[35px] !rounded-full 
         !text-black' onClick={()=>{setIsShowPassword(!IsShowPassword)}}>
         {
            IsShowPassword===true ?  <IoMdEye className="text-[20px] opacity-75"/> :  <IoMdEyeOff className="text-[20px] opacity-75"/>
         }
        </Button>
        </div>
       </div>
       
       
           
       <div className='form-group mb-4 w-full flex items-center justify-between'>
       <FormControlLabel 
       control={<Checkbox defaultChecked/>}
       label="Remember Me"
       />
       
       <a
       onClick={forgotPassword}
       className='text-blue-600 
       text-[14px] font-[700] hover: cursor-pointer'>
       Forgot Password ?
       </a>
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

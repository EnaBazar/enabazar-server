import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import { Link } from "react-router-dom";
import {FcGoogle} from 'react-icons/fc';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase';
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

 const Register = () => {
    
    
    const [isLoading,setIsLoading]= useState(false);
    const [IsShowPassword,setIsShowPassword] = useState(false);
    const [formFields,setFormFields]= useState({
      name:"",
      mobile:"",
      password:""
    })
    
    
    const context = useContext(MyContext)
    const history = useNavigate();
    window.scrollTo(0,0)
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


    // Register.jsx এর handleSubmit function এর মধ্যে
if(res?.error !== true){
  setIsLoading(false)
  context.openAlertBox("success",res?.message);
  localStorage.setItem("userEmail",formFields.mobile)

  // ✅ Add this line for OTP redirect
  navigate("/verify-otp", { state: { mobile: formFields.mobile } });

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

const authWithGoogle=()=>{
 signInWithPopup(auth, googleProvider)
  .then((result) => {
  
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
   
    const user = result.user;
    
    const fields = {
      
      name: user.providerData[0].displayName,
      email: user.providerData[0].email,
       password: null,
        avatar: user.providerData[0].photoURL,
         mobile: user.providerData[0].phoneNumber,
         signUpWithGoogle:true,
         role:"USER"
    }
    
    
      postData("/auth/authWithGoogle",fields).then((res)=>{
   
    if(res?.error !== true){
      setIsLoading(false)
      context.openAlertBox("success",res?.message);
      localStorage.setItem("userEmail",fields.mobile)
      
       localStorage.setItem("accesstoken",res?.data?.accesstoken)     
     localStorage.setItem("refreshtoken",res?.data?.refreshtoken)
     
     context.setIsLogin(true);
 
      history("/")
    }else{
      context.openAlertBox("error",res?.message);
      setFormFields({
        name:"",
        email:"",
     
        password:""
      })
      setIsLoading(false);
     
    }
   
  })
    
    
    
   console.log(user)
  
  }).catch((error) => {
  
    const errorCode = error.code;
    const errorMessage = error.message;

    const email = error.customData.mobile;
 
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

  return (
   <section className='section py-10'>
   <div className='container'>
   <div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>
<h3 className='text-center text-[14px] text-[200]'>আমাদের সাথে থাকার জন্য আপনার মোবাইল নাম্বার দিয়ে রেজিস্টেশন করুন!</h3>

<form className='w-full !mt-5'onSubmit={handleSubmit}>
<div className='form-group w-full !mb-5'>
<TextField 
type='text'
id="name"
name="name"
value={formFields.name}
disabled={isLoading===true ? true : false}
 label="আপনার নাম"
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
 label="মোবাইল নাম্বার"
  variant="outlined"
  className='w-full' 
  onChange={onchangeInput}
  />

</div>
<div className='form-group w-full !mb-5 relative'>
<TextField 
type={IsShowPassword===false ? 'password': 'text'}
id="Password"
 label="পাসওয়াড*"
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


<div className='flex items-center w-full !mt-3 !mb-3'>

<Button type='submit' disabled={!valideValue} className='btn-org btn-lg w-full cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Register'
}

</Button>

</div>
<p className='text-center '>Already have an account? <Link className='link !text-[14px] cursor-pointer  !font-[600] !text-[#ff5252]' to="/login">Sign In</Link></p>

<p className='text-center font-[500] '>Or continue with social account</p>

<Button className='flex gap-3 w-full !bg-[f1f1f1] btn-lg !text-black'
onClick={authWithGoogle}
><FcGoogle className='text-[20px]'/>SignUp with Google</Button>
</form>
   </div>
   </div>  
   </section>
  )
}
export default Register;
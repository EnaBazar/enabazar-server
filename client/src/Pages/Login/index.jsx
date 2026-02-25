import React, { useContext, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import { Link, useNavigate } from "react-router-dom";
import {FcGoogle} from 'react-icons/fc';
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';




import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase';
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

 const Login = () => {
    
  const [isLoading,setIsLoading]= useState(false);
  const [IsShowPassword,setIsShowPassword] = useState(false);
  const [formFields,setFormFields]= useState({
       
       email:"",
       password:""
       
    });
    const context = useContext(MyContext)
    const history = useNavigate();
    
    
window.scrollTo(0,0)
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
             history("/verify")          
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
          localStorage.setItem("userEmail",fields.email)
          
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
    
        const email = error.customData.email;
     
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    }
    
    
  return (
   <section className='section py-10'>
   <div className='container'>
   <div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>
<h3 className='text-center text-[18px] text-[200]'>Login to your account</h3>

<form className='w-full !mt-5' onSubmit={handleSubmit}>
<div className='form-group w-full !mb-5'>
<TextField 
type='email'
id="Email"
name="email"
value={formFields.email}
disabled={isLoading===true ? true : false}
onChange={onchangeInput}
 label="Email ID*"
  variant="outlined"
  className='w-full' 

  />

</div>
<div className='form-group w-full !mb-5 relative'>
<TextField 
type={IsShowPassword===false ? 'password': 'text'}
id="Password"
 label="Password*"
  name='password'
value={formFields.password}
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


<a className='link cursor-pointer text-[14px] font-[600]' onClick={forgotPassword}>Forget Password</a>

<div className='flex items-center w-full !mt-3 !mb-3'>


<Button type='submit' disabled={!valideValue} className='btn-org btn-lg w-full cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Login'
}

</Button>

</div>
<p className='text-center '>Not Registered? <Link className='link !text-[14px] cursor-pointer  !font-[600] !text-[#ff5252]' to="/register">Sign Up </Link></p>

<p className='text-center font-[500]'>Or continue with social account</p>

<Button className='flex gap-3 w-full !bg-[f1f1f1] btn-lg !text-black'

onClick={authWithGoogle}
><FcGoogle className='text-[20px]'/>SignIn with Google</Button>
</form>
   </div>
   </div>  
   </section>
  )
}
export default Login;
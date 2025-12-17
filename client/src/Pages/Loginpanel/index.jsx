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

 const LoginPanel = () => {
    const context = useContext(MyContext);

  const [isLoading,setIsLoading]= useState(false);
  const [IsShowPassword,setIsShowPassword] = useState(false);
  const [formFields,setFormFields]= useState({
       
  name: context.loginPrefill?.name || "",
  mobile: context.loginPrefill?.mobile || ""
    });





    const history = useNavigate();
    
    
window.scrollTo(0,0)
    const forgotPassword =()=>{

      
        if(formFields.mobile===""){
           
         context.openAlertBox("error","Please entry your Eamil")
         return false; 
        }else{
      
           localStorage.setItem("userEmail",formFields.mobile)
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
      
      if(formFields.mobile==="")
        {
          context.openAlertBox("error","Please entry your Eamil")
          return false
        }
        
        if(formFields.name==="")
          {
            context.openAlertBox("error","Please entry your name")
            return false
          }
      
      postData("/auth/login",formFields,{withCredentials:true}).then((res)=>{
        console.log(res)
        if(res?.error !== true){
          setIsLoading(false)
          context.openAlertBox("success",res?.message);
      
          setFormFields({
            mobile: "",
            name: ""
          })
     
     localStorage.setItem("accesstoken",res?.data?.accesstoken)     
     localStorage.setItem("refreshtoken",res?.data?.refreshtoken)
     
     context.setIsLogin(true);
       window.location.reload(); 
              context?.setOpenLoginPanel(false);
        }else{
                   context?.setOpenLoginPanel(false);
          context.openAlertBox("error"," আপনার নিবন্ধন নাই! নাম,মোবাইল নাম্বার দিয়ে প্রবেশ করুন!");

           setTimeout(()=>{
       context?.setOpenRegisterPanel(true);
               
  },1000)
          setFormFields({
            mobile: "",
            name: ""
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
  
    <div
    className="
      w-[90%] 
      max-w-[360px] 
      bg-white/80 
      backdrop-blur-md 
      shadow-xl 
      rounded-xl 
      p-6
    "
  >
<h3 className='text-center  text-[18px] text-[200]'>Login to your account</h3>

<form className='w-full !mt-5' onSubmit={handleSubmit}>

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




</form>
   </div>

   </section>
  )
}
export default LoginPanel;
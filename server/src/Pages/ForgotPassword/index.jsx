import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {IoMdEye} from 'react-icons/io';
import {IoMdEyeOff} from 'react-icons/io';
import {useNavigate } from "react-router-dom";
import { MyContext } from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';


const ForgotPassword = () => {
   const [IsShowPassword,setIsShowPassword] = useState(false);
const [IsShowPassword2,setIsShowPassword2] = useState(false);
   const [isLoading,setIsLoading]= useState(false);

  const [formFields,setFormFields]= useState({
       email:localStorage.getItem("userEmail"),
       newPassword:"",
       confirmPassword:""
       
    });
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
       
       if(formFields.newPassword==="")
         
         {
         context.openAlertBox("error","Please entry your newPassword")
         setIsLoading(false)
       
         return false
         }     
         if(formFields.confirmPassword==="")
         {
         context.openAlertBox("error","Please entry your confirmPassword")
         setIsLoading(false)
         return false
         }
         if(formFields.confirmPassword !== formFields.newPassword)
         {
         context.openAlertBox("error","passwod and confirmPassword not match")
         setIsLoading(false)
         return false
         }
     
     postData(`/auth/reset-password`,formFields).then((res)=>{
        
     
        if(res?.error===false){
           
        localStorage.removeItem("userEmail")
        localStorage.removeItem("actionType")
       
       setIsLoading(false)
        history("/login")  
           
        }else{
           context.openAlertBox("error",res?.message);
              setIsLoading(false)
        }
   
     })
     
     
     }
return (                                 
     
<section className='section py-10'>
<div className='container'>
<div className='card !shadow-md !w-[400px] !m-auto !rounded-md !bg-white p-5 px-12'>
<h3 className='text-center text-[18px] text-[200]'>Forgot Password</h3>

<form className='w-full !mt-5'onSubmit={handleSubmit}>
<div className='form-group w-full !mb-5 relative'>
<TextField 
type={IsShowPassword===false ? 'password': 'text'}
id="password"
label="New password*"
variant="outlined"
className='w-full' 
name='newPassword'
value={formFields.newPassword}
disabled={isLoading===true ? true : false}
onChange={onchangeInput}
/>
<Button  className='!absolute !top-[10px] !right-[10px] z-50 !w-[35x]
 !h-[35px] !min-w-[35px] !rounded-full 
 !text-black' onClick={()=>{setIsShowPassword(!IsShowPassword)}}>
 {
    IsShowPassword===true ?  <IoMdEye className="text-[20px] opacity-75"/> :  <IoMdEyeOff className="text-[20px] opacity-75"/>
 }
</Button>




</div>
<div className='form-group w-full !mb-5 relative'onSubmit={handleSubmit}>
<TextField 
type={IsShowPassword2===false ? 'password': 'text'}
id="confirm_Password"
 label="confirm_Password*"
  variant="outlined"
  className='w-full' 
    name='confirmPassword'
    value={formFields.confirmPassword}
disabled={isLoading===true ? true : false}
    onChange={onchangeInput}
  />
<Button  className='!absolute !top-[10px] !right-[10px] z-50 !w-[35x]
 !h-[35px] !min-w-[35px] !rounded-full 
 !text-black' onClick={()=>{setIsShowPassword2(!IsShowPassword2)}}>
 {
    IsShowPassword2===true ?  <IoMdEye className="text-[20px] opacity-75"/> :  <IoMdEyeOff className="text-[20px] opacity-75"/>
 }
</Button>
</div>




<div className='flex items-center w-full !mt-3 !mb-3'>


<Button type='submit' disabled={!valideValue} className='btn-org btn-lg w-full cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Reset password'
}

</Button>


</div>

</form>
   </div>
   </div>  
   </section>
  )
}
export default ForgotPassword;
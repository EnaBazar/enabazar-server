
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../Components/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import  CircularProgress  from '@mui/material/CircularProgress';
import {Collapse} from 'react-collapse';
import {PhoneInput} from 'react-international-phone';
import 'react-international-phone/style.css'

  
const MyAccount = () => {
  
    const [isLoading,setIsLoading]= useState(false);
    const [isLoading2,setIsLoading2]= useState(false);
    
    const [userId,setUserId] =useState();
    const [phone, setPhone] = useState('');
    
   const [ischangePasswordFormShow,setIsChangePasswordFormShow]= useState(false);
   
    const [formFields, setFormFields]= useState({
         
         name:"",
         email:"",
         mobile:""
         
      });
  
  
      const [changePassword, setChangePassword] = useState({
        email: '',
        oldpassword: '',
        newPassword: '',
        confirmPassword: ''
        
     });
  
  
  const context = useContext(MyContext);
  const history = useNavigate();
  
useEffect(() => {
  const token = localStorage.getItem("accesstoken");
  if(token===null){
    history("/");
  }
  
}, [context?.isLogin])
  
  
    useEffect(()=>{
    if(context?.userData?._id!=="" && context?.userData?._id!==undefined){
  
      setUserId(context?.userData?._id)  
      setFormFields({
        
        name:context?.userData?.name,
        email:context?.userData?.email,
        mobile:context?.userData?.mobile
      })
      const ph = `"${context?.userData?.mobile}"`
      setPhone(ph)
      setChangePassword({
        
        email: context?.userData?.email
      })
      
    } 
    },[context?.userData])
  
  
  
const onchangeInput=(e)=>{
      
  const {name,value} = e.target;
  setFormFields(()=>{
    return{
      ...formFields,
      [name]:value
    }
  })
  setChangePassword(()=>{
    return{
      ...changePassword,
      [name]:value
    }
  })
}

      const valideValue = Object.values(formFields).every(el => el)
      
      const valideValue2 = Object.values(changePassword).every(el => el)
   
   
   
   
      const handleSubmit=(e)=>{     
        e.preventDefault();
        setIsLoading(true)
        
        if(formFields.name==="")
          {
            context.openAlertBox("error","Please entry your Full Name")
            return false
          }
          
          if(formFields.email==="")
            {
              context.openAlertBox("error","Please entry your Email")
              return false
            }
            
            if(formFields.mobile==="")
              {
                context.openAlertBox("error","Please entry your Mobile")
                return false
              }
        
          editData(`/auth/${userId}`,formFields,{withCredentials:true}).then((res)=>{
     console.log(res)
         
         
         
          if(res?.error !== true){
            setIsLoading(false)
            context.openAlertBox("success",res?.data?.message);      
            
          }else{
            context.openAlertBox("error",res?.message);
            setIsLoading(false);
           
          }
         
        })
      }
      
      
      
      
      const handleSubmitchangepassword=(e)=>{     
        e.preventDefault();
        setIsLoading2(true)
        
        if(changePassword.oldpassword==="")
          {
            context.openAlertBox("error","Please entry your old Password")
            return false
          }
          
          if(changePassword.newPassword==="")
            {
              context.openAlertBox("error","Please entry your NewPassword")
     setIsLoading2(false);
              return false
                   
            }
            
            if(changePassword.confirmPassword==="")
              {
                context.openAlertBox("error","Please entry your ConfirmPassword")
                 setIsLoading2(false);
                return false
                     
              }
              
          
          postData(`/auth/resetpasswordaccont`, changePassword, { withCredentials: true }).then((res)=>{
   
          if (res?.error !== true){
            setIsLoading2(false)
            context.openAlertBox("success", res?.message);      
            
          }else{
            context.openAlertBox("error", res?.message);
            setIsLoading2(false);
           
          }
         
        })
      }
  return (
    
<section className='py-10 w-full'>
<div className='container flex gap-3'>
<div className='col1 w-[20%]'>
<AccountSidebar/>
</div>


<div className='col2 w-[50%]'>
<div className='card bg-white p-5 shadow-md rounded-md !mb-5'>
<div className='flex items-center pb-0'>
<h2 className='pb-3 !text-[14px]'>My Profile</h2>
<Button className='!ml-auto !text-[14px]' onClick={()=>setIsChangePasswordFormShow(!ischangePasswordFormShow)}>Change Password</Button>
</div>
<hr className='text-[rgba(0,0,0,0.2)]'/>


<form className='!mt-5' onSubmit={handleSubmit}>
<div className='flex items-center gap-5'>

<div className='w-50%'>
<TextField
label="Full Name"
variant="outlined"
size='small'
className='w-full !text-[10px]'
name='name'
value={formFields.name}
disabled={isLoading===true ? true : false}
onChange={onchangeInput}
/>
</div>

<div className='w-50% '>
<TextField
label="Email"

variant="outlined"
size='small'
className='w-full'
name='email'
value={formFields.email}
disabled={true}
onChange={onchangeInput}
/>
</div>

</div>

<div className='flex items-center !mt-4 gap-5'>
<div className='w-50%'>
<PhoneInput
defaultCountry='bd'
value={phone}
disabled={isLoading === true ? true : false}
onChange={(phone) => {
  setPhone(phone);
setFormFields(prev => ({
  ...prev,
  mobile: phone
}));
  
  
}}


/>

</div>

</div>
<br/>

<div className='flex items-center gap-4 '>
<Button type='submit' disabled={!valideValue} className='btn-org btn-lg w-[210px] cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Update Profile'
}

</Button>

</div>

</form>

</div>









     <Collapse isOpened={ischangePasswordFormShow}>
 
  <div className='card bg-white p-5 shadow-md rounded-md'>

<div className='flex items-center pb-3'>

<h2 className='pb-0 !text-[14px]'>Change Password</h2>

</div>
<hr className='text-[rgba(0,0,0,0.2)]'/>






<form className='!mt-5' onSubmit={handleSubmitchangepassword}>
<div className='flex items-center gap-5'>


<div className='w-50% '>
<TextField
type='text'
label="Old Password"
variant="outlined"
size='small'
className='w-full'
name='oldpassword'
value={changePassword.oldpassword}
disabled={isLoading2 === true ? true : false}
onChange={onchangeInput}
/>
</div>
<div className='w-50% '>
<TextField
type='text'
label="New Password"
variant="outlined"
size='small'
className='w-full'
name='newPassword'
value={changePassword.newPassword}
disabled={isLoading2 === true ? true : false}
onChange={onchangeInput}
/>
</div>

</div>

<div className='flex items-center !mt-4 gap-5'>
<div className='w-50%'>
<TextField
label="Confirm Password"
variant="outlined"
size='small'
className="w-full"
name='confirmPassword'
value={changePassword.confirmPassword}
disabled={isLoading2 === true ? true : false}
onChange={onchangeInput}
/>
</div>
</div>
<br/>

<div className='flex items-center gap-4 '>
<Button type='submit' disabled={!valideValue2} className='btn-org btn-lg w-[210px] cursor-pointer flex gap-3'>
{
  
  isLoading2 === true ? <CircularProgress color="inherit"/>
  
  :
  'Change Password'
}

</Button>

</div>

</form>




</div>
</Collapse>





</div>
</div>
</section>

  )
}
export default MyAccount;

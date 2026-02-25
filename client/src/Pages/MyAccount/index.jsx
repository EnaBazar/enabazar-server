
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
              
          
          postData(`/auth/reset-password-account`, changePassword, { withCredentials: true }).then((res)=>{
   
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
    
<section className="py-10 w-full">
  <div className="container mx-auto flex flex-col lg:flex-row gap-5 px-4">

    {/* Sidebar */}
    <div className="col1 w-full lg:w-1/4">
      <AccountSidebar />
    </div>

    {/* Main Content */}
    <div className="col2 w-full lg:w-3/4 flex flex-col gap-5">

      {/* Profile Card */}
      <div className="card bg-white p-5 shadow-md rounded-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
          <h2 className="text-[14px] font-medium">My Profile</h2>
          <Button
            className="!text-[14px]"
            onClick={() => setIsChangePasswordFormShow(!ischangePasswordFormShow)}
          >
            Change Password
          </Button>
        </div>
        <hr className="text-[rgba(0,0,0,0.2)]" />

        {/* Profile Form */}
        <form className="!mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              label="Full Name"
              variant="outlined"
              size="small"
              className="flex-1"
              name="name"
              value={formFields.name}
              disabled={isLoading}
              onChange={onchangeInput}
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              className="flex-1"
              name="email"
              value={formFields.email}
              disabled={true}
              onChange={onchangeInput}
            />
          </div>

          <PhoneInput
            defaultCountry="bd"
            value={phone}
            disabled={isLoading}
            onChange={(phone) => {
              setPhone(phone);
              setFormFields((prev) => ({ ...prev, mobile: phone }));
            }}
            className="w-full"
          />

          <div className="flex justify-start mt-4">
            <Button
              type="submit"
              disabled={!valideValue}
              className="btn-org btn-lg w-full sm:w-[210px] flex gap-3 justify-center"
            >
              {isLoading ? <CircularProgress color="inherit" size={20} /> : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Collapse */}
      <Collapse isOpened={ischangePasswordFormShow}>
        <div className="card bg-white p-5 shadow-md rounded-md">
          <div className="flex items-center pb-3">
            <h2 className="text-[14px] font-medium">Change Password</h2>
          </div>
          <hr className="text-[rgba(0,0,0,0.2)]" />

          <form className="!mt-5 flex flex-col gap-4" onSubmit={handleSubmitchangepassword}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {context?.userData?.signUpWithGoogle === false && (
                <TextField
                  type="password"
                  label="Old Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="oldpassword"
                  value={changePassword.oldpassword}
                  disabled={isLoading2}
                  onChange={onchangeInput}
                />
              )}

              <TextField
                type="password"
                label="New Password"
                variant="outlined"
                size="small"
                className="w-full"
                name="newPassword"
                value={changePassword.newPassword}
                disabled={isLoading2}
                onChange={onchangeInput}
              />

              <TextField
                type="password"
                label="Confirm Password"
                variant="outlined"
                size="small"
                className="w-full"
                name="confirmPassword"
                value={changePassword.confirmPassword}
                disabled={isLoading2}
                onChange={onchangeInput}
              />
            </div>

            <div className="flex justify-start mt-4">
              <Button
                type="submit"
                className="btn-org btn-lg w-full sm:w-[210px] flex gap-3 justify-center"
              >
                {isLoading2 ? <CircularProgress color="inherit" size={20} /> : "Change Password"}
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

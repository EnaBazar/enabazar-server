



import React, { useContext, useEffect, useState } from 'react'
import { FaCloudDownloadAlt } from 'react-icons/fa';

import { MyContext } from '../../App';
import {  editData, fetchDataFromApi, postData, uploadImage } from '../../utils/api';
import  CircularProgress  from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { Button, TextField} from '@mui/material';
import {Collapse} from 'react-collapse';
import Radio from '@mui/material/Radio';
import {PhoneInput} from 'react-international-phone';
import 'react-international-phone/style.css'




const label = { inputProps:{ 'aria-label': 'Checkbox demo' }};


 const Profile = () => {
     
  const [previews, setPreviews] = useState([]);
  const [uploading,setUploading] = useState(false);
   const [address ,setAddress] = useState([]);
       const [phone, setPhone] = useState('');
  const context = useContext(MyContext)

  const [isLoading,setIsLoading]= useState(false);
    const [isLoading2,setIsLoading2]= useState(false);
    
    const [userId,setUserId] =useState();
   const [ischangePasswordFormShow,setIsChangePasswordFormShow]= useState(false);

   
   
    const [formFields, setFormFields]= useState({
         
         name:"",

         mobile:""
         
      });
  
  
      const [changePassword, setChangePassword] = useState({
 
        oldpassword: '',
        newPassword: '',
        confirmPassword: ''
        
     });
  
        


  const history = useNavigate();
  
  const [selectedValue,setSelectedValue] = useState('');
  
  const handleChange = (event) => {

    setSelectedValue(event.target.value);
    if(event.target.checked===true){
      editData(`/address/selectAddress/${event.target.value}`,{selected:true})
    }else{
      editData(`/address/selectAddress/${event.target.value}`,{selected:false})
    }
  
    
  };
  
useEffect(() => {
  const token = localStorage.getItem("accesstoken");
  if(token===null){
    history("/login");
  }
  
}, [context?.isLogin])
  
  
    useEffect(()=>{
    if(context?.userData?._id!=="" && context?.userData?._id!==undefined){


 fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res)=>{
         
         setAddress(res.data)
          context?.setAddress(res.data)
         
       })
       

      setUserId(context?.userData?._id)  
      setFormFields({
        
        name:context?.userData?.name,
        mobile:context?.userData?.mobile
      })
       const ph = `"${context?.userData?.mobile}"`
      setPhone(ph)
  
      setChangePassword({
        
        mobile: context?.userData?.mobile
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
          
      
            
            if(formFields.mobile==="")
              {
                context.openAlertBox("error","Please entry your Mobile")
                return false
              }
        
          editData(`/auth/${userId}`,formFields,{withCredentials:true}).then((res)=>{
          console.log(res)
         
         
         
          if (res?.error !== true){
                setIsLoading(false)
            context.openAlertBox("success", res?.data?.message);      
         
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

  useEffect(() => {
  const userAvatar = [];
  if(context?.userData?.avatar !== "" && context?.userData?.avatar !== undefined){
    userAvatar.push(context?.userData?.avatar);
    setPreviews(userAvatar)  
    
  } 
  },[context?.userData])
  

  let selectedImage = [];
  
  
  const formdata = new FormData();
  
    const onChangeFile = async (e, apiEndPoint) =>{
      try {
        setPreviews([]);
        const files = e.target.files;
        setUploading(true);
      
        
        for (var i =0; i < files.length; i++){
          if (
            
            files[i] && 
            (
              files[i].type === "image/jpeg" ||
              files[i].type === "image/jpg"  ||
              files[i].type === "image/png" ||
              files[i].type === "image/webp"   )
              
            ){
              
              const file = files[i];
              selectedImage.push(file);
              formdata.append(`avatar`,file);
     
         
              }else{
                context.openAlertBox("error","Please select a vaild JPG ,Png or webp image file")
                setUploading(false);
                return false;
              }
              }
        
              uploadImage("/auth/user-avatar",formdata).then((res)=>{
                setUploading(false);
                let avatar=[];
                console.log(res?.data?.avtar)
                avatar.push(res?.data?.avtar);
                setPreviews(avatar);
               
              })
      } catch (error) {
        console.log(error);
      }
    }
     
     
     
  return (
 <>
<div className='card my-5 pt-5 w-full max-w-4xl mx-auto shadow-md sm:rounded-lg bg-white px-5 pb-5'>
  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
    <h2 className='text-[20px] font-semibold'>User Profile</h2>
    <Button className='btn-blue !text-[12px]' onClick={() => setIsChangePasswordFormShow(!ischangePasswordFormShow)}>Change Password</Button>
  </div>
  <br />

  {/* Avatar */}
  <div className='relative w-[110px] h-[110px] rounded-full overflow-hidden mb-4 mx-auto sm:mx-0 group flex items-center justify-center bg-gray-200'>
    {uploading ? <CircularProgress /> : (previews?.length ? <img src={previews[0]} className='w-full h-full object-cover' /> : <img src="/user.png" className='w-full h-full object-cover' />)}

    <div className='absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 cursor-pointer transition'>
      <FaCloudDownloadAlt className='text-white text-[22px]' />
      <input
        type='file'
        className='absolute inset-0 opacity-0 cursor-pointer'
        accept='image/*'
        onChange={(e) => onChangeFile(e, "/auth/user-avatar")}
        name='avatar'
      />
    </div>
  </div>

  <hr className='border-gray-200' />

  {/* Profile Form */}
  <form className='mt-5 flex flex-col gap-5' onSubmit={handleSubmit}>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      <TextField
        label="Full Name"
        variant="outlined"
        size='small'
        className='w-full'
        name='name'
        value={formFields.name}
        disabled={isLoading}
        onChange={onchangeInput}
      />
  
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      <PhoneInput
        defaultCountry='bd'
        value={phone}
          className='w-full'
        disabled={isLoading}
        onChange={(phone) => {
          setPhone(phone);
          setFormFields(prev => ({ ...prev, mobile: phone }));
        }}
      />
    </div>

    {/* Add Address Button */}
    <div
      className='border border-dashed p-3 rounded-md hover:bg-[#e7f3f9] cursor-pointer text-center font-medium w-full sm:w-[210px]'
      onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: "AddNewAddress" })}
    >
      Add Address
    </div>

    {/* Address List */}
    <div className='flex flex-col gap-2 mt-4 max-h-60 overflow-y-auto'>
      {context?.address?.map(address => (
        <label key={address._id} className='flex items-center gap-2 border border-dashed p-2 rounded-md cursor-pointer bg-gray-100'>
          <Radio
            {...label}
            name='address'
            size='small'
            checked={selectedValue === address._id}
            value={address._id}
            onChange={handleChange}
          />
          <span className='text-sm'>
            {`${address.address_line}, ${address.city}, ${address.country}, ${address.state}, ${address.pincode}`}
          </span>
        </label>
      ))}
    </div>

    <div className='flex items-center gap-4 mt-4'>
      <Button type='submit' disabled={!valideValue} className='btn-blue w-full md:w-[210px] flex justify-center gap-3'>
        {isLoading ? <CircularProgress size={20} /> : 'Update Profile'}
      </Button>
    </div>
  </form>
</div>





     <Collapse isOpened={ischangePasswordFormShow}>
 
  <div className='card w-full max-w-4xl bg-white p-5 shadow-md rounded-md mx-auto'>
  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3'>
    <h2 className='text-[16px] font-semibold'>Change Password</h2>
  </div>
  <hr className='border-gray-200'/>

  <form className='mt-5 flex flex-col gap-5' onSubmit={handleSubmitchangepassword}>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      <TextField
        type='password'
        label="Old Password"
        variant="outlined"
        size='small'
        className='w-full'
        name='oldpassword'
        value={changePassword.oldpassword}
        disabled={isLoading2}
        onChange={onchangeInput}
      />
      <TextField
        type='password'
        label="New Password"
        variant="outlined"
        size='small'
        className='w-full'
        name='newPassword'
        value={changePassword.newPassword}
        disabled={isLoading2}
        onChange={onchangeInput}
      />
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-4'>
      <TextField
        type='password'
        label="Confirm Password"
        variant="outlined"
        size='small'
        className='w-full'
        name='confirmPassword'
        value={changePassword.confirmPassword}
        disabled={isLoading2}
        onChange={onchangeInput}
      />
    </div>

    <div className='flex items-center gap-4 mt-4'>
      <Button
        type='submit'
        disabled={!valideValue2}
        className='btn-blue w-full md:w-[210px] flex justify-center gap-3'
      >
        {isLoading2 ? <CircularProgress size={20} /> : 'Change Password'}
      </Button>
    </div>
  </form>
</div>

    </Collapse>

 </>
  )
}

export default Profile;


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



 const RegisterPanel = () => {
    const [isLoading,setIsLoading]= useState(false);
    const navigate = useNavigate();
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

      const [errors, setErrors] = useState({
        name: "",
        mobile: "",
        password:""
      });
    
      const bdMobileRegex = /^01[3-9]\d{8}$/;
    
      const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "mobile") {
          const numericValue = value.replace(/\D/g, "");
    
          if (numericValue.length <= 11) {
            setFormFields((prev) => ({
              ...prev,
              mobile: numericValue,
            }));
    
            if (!bdMobileRegex.test(numericValue)) {
              setErrors((prev) => ({
                ...prev,
                mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন",
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                mobile: "",
              }));
            }
          }
        }
    
        if (name === "name") {
          setFormFields((prev) => ({
            ...prev,
            name: value,
          }));
    
          if (value.trim().length < 3) {
            setErrors((prev) => ({
              ...prev,
              name: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              name: "",
            }));
          }
        }

  if (password === "password") {
          setFormFields((prev) => ({
            ...prev,
            password: value,
          }));
    
          if (value.trim().length < 3) {
            setErrors((prev) => ({
              ...prev,
              password: "আপনার পাসওয়াড দিন",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              password: "",
            }));
          }
        }



      };
    const valideValue = Object.values(formFields).every(el => el)
    
const handleSubmit=(e)=>{
  
  e.preventDefault();
  setIsLoading(true)
  
 if (!bdMobileRegex.test(formFields.mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন",
      }));
      return;
    }

    if (formFields.name.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        name: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
      }));
      return;
    }
  
    if (formFields.password.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        password: "আপনার পাসওয়াড দিন",
      }));
      return;
    }
    
   
  postData("/auth/register",formFields).then((res)=>{
    console.log(res)


    // Register.jsx এর handleSubmit function এর মধ্যে
if(res?.error !== true){
  setIsLoading(false)
  context.openAlertBox("success",res?.message);
  localStorage.setItem("userEmail",formFields.mobile)

  // ✅ Add this line for OTP redirect

  context?.openOtpPanel({
  mobile: formFields.mobile,  // যেই মোবাইল দিয়ে register করছে
});


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



  return (
   <section className="w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
  <div>
  <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="!text-[10px] text-gray-500 mt-1">
          আপনার নাম ও মোবাইল নাম্বার দিয়ে রেজিস্টেশন করুন !!
          </p>
        </div>

<form className='w-full !mt-5'onSubmit={handleSubmit}>


 <TextField
            fullWidth
             className='!mb-4'
             size='small'
            type='text'
            id="name"
            label="আপনার নাম"
            name="name"
            value={formFields.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          disabled={isLoading===true ? true : false}
          />




 <TextField
            fullWidth
              size='small'
             className='!mb-4'
            type='number'
            id="mobile"
            label="মোবাইল নাম্বার"
            name="mobile"
            value={formFields.mobile}
            onChange={handleChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
          disabled={isLoading===true ? true : false}
          />
<div className='form-group w-full !mb-5 relative'>
<TextField 
type={IsShowPassword===false ? 'password': 'text'}
id="Password"
size='small'
 label="পাসওয়াড*"
 name="password"
 value={formFields.password}
 disabled={isLoading===true ? true : false}
  variant="outlined"
  className='w-full' 
  onChange={onchangeInput}
  />
<Button className='!absolute !top-[4px] !right-[10px] z-50 !w-[35x]
 !h-[35px] !min-w-[35px] !rounded-full 
 !text-black' onClick={()=>{setIsShowPassword(!IsShowPassword)}}>
 {
    IsShowPassword===true ?  <IoMdEye className="text-[18px] opacity-75"/> :  <IoMdEyeOff className="text-[18px] opacity-75"/>
 }
</Button>
</div>




<div className='flex items-center w-full !mt-3 !mb-3'>

<Button
onClick={context.closeragisterPanel}
  size='small'
type='submit' disabled={!valideValue} 
className='btn-org btn-lg w-full cursor-pointer flex gap-3'>
{
  
  isLoading === true ? <CircularProgress color="inherit"/>
  
  :
  'Register'
}

</Button>

</div>
   <p className="text-center !text-[8px] text-gray-600">
            আপনার আগের রেজিস্টেশন থাকলে! {" "}
            <span
              onClick={() => {
                context?.setOpenLoginPanel(true);
                context?.setOpenRegisterPanel(false);
              }}
              className="font-semibold !text-[12px] text-red-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

</form>
   </div>
    
   </section>
  )
}
export default RegisterPanel;











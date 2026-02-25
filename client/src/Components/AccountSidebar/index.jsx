import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import {NavLink, useNavigate} from 'react-router' 
import {MyContext} from '../../App';
import  CircularProgress  from '@mui/material/CircularProgress';
import { fetchDataFromApi, uploadImage } from '../../utils/api';
import { LuMapPinCheck } from 'react-icons/lu';








const AccountSidebar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading,setUploading] = useState(false);
  
  const context = useContext(MyContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
 
    const history = useNavigate();     
      const logout=()=>{
        setAnchorEl(null);
        fetchDataFromApi(`/auth/logout?token=${localStorage.getItem('accesstoken')}`,{withCredentials:true}).then((res)=>{
          
       
          
          if(res?.error === false){
            context.setIsLogin(false);
            localStorage.removeItem("accesstoken")     
             localStorage.removeItem("refreshtoken")
             context?.setCartData([]);
             history("/");
          }
          
          
        })
      }
      
  
  useEffect(()=>{
  const userAvatar = [];
  if(context?.userData?.avatar!=="" && context?.userData?.avatar!==undefined){
    userAvatar.push(context?.userData?.avatar);
    setPreviews(userAvatar)  
    
  } 
  },[context?.userData])
  
  let img_arr = [];
  let uniqueAarray = [];
  let selectedImage = [];
  
  
  const formdata = new FormData();
  
    const onChangeFile = async (e,apiEndPoint) =>{
      try {
        setPreviews([]);
        const files = e.target.files;
        setUploading(true);
        console.log(files)
        
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
<div className='card bg-white shadow-md rounded-md !sticky !top-[170px]'>
<div className='w-full p-5 flex items-center justify-center flex-col'>
<div className='w-[110px] h-[110px] rounded-full overflow-hidden !mb-4 relative group flex items-center justify-center bg-gray-200'>

{
 
  uploading === true ? <CircularProgress color="inherit"/> :
  
  <>
  {
    
    previews?.length !== 0 ? previews?.map((img, index) => {
      
      return (
        
        <img
        src={img}
        key={index}
        className='w-full h-full object-cover'
        />
      )
    })
    :
    
    <img src={"/user.png"}
     className='w-full h-full object-cover'
    
    />
  }
 
  </>
 
}






<div className='overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 
bg-[rgba(0,0,0,0.4)] flex items-center justify-center 
cursor-pointer opacity-0 transition-all group-hover:opacity-100'>
<FaCloudDownloadAlt className='text-[#fff] text-[22px]'/>
<input type='file' className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
accept='image/*'
onChange={(e) =>
onChangeFile(e, "/auth/user-avatar")
          }

/>
</div>
</div>

<h3>{context?.userData?.name}</h3>
<h6 className='text-[12px] font-[500]'>{context?.userData?.email}</h6>
</div>

<ul className='list-none pb-5 bg-[#f1f1f1] myAccountTabs'>
<li className='w-full'>
<NavLink to="/my-account" exact={"true"} activeclassname="isActive">
<Button className='flex w-full !rounded-none
 !text-[rgba(0,0,0,0.6)] !text-left py-2 !px-5 
 !justify-start !capitalize ] items-center gap-2'
          ><FaRegUser className='text-[17px]'/>
          User Profile
          </Button>
          </NavLink>
</li>

<li className='w-full'>
<NavLink to="/address" exact={"true"} activeclassname="isActive">
<Button className='flex w-full !rounded-none
 !text-[rgba(0,0,0,0.6)] !text-left py-2 !px-5 
 !justify-start !capitalize ] items-center gap-2'
          ><LuMapPinCheck className='text-[17px]'/>
       Address
          </Button>
          </NavLink>
</li>


<li className='w-full'>
<NavLink to="/my-list" exact={true} activeClassName="isActive">
<Button className='flex w-full py-2 !rounded-none
 !text-[rgba(0,0,0,0.6)] !text-left !px-5 
 !justify-start !capitalize ] items-center gap-2'
          ><IoMdHeartEmpty className='text-[17px]'/>
          My List
          </Button>
          </NavLink>
</li>

<li className='w-full'>
<NavLink to="/oders" exact={true} activeClassName="isActive">
<Button className='flex w-full !rounded-none
 !text-[rgba(0,0,0,0.6)] !text-left !px-5 
 !justify-start !capitalize ] items-center gap-2'
          ><IoBagCheckOutline className='text-[17px]'/>
      My Orders
          </Button>
          </NavLink>
</li>


<li className='w-full'>
<NavLink to="/logout" exact={true} activeClassName="isActive">
<Button onClick={logout} className='flex w-full !rounded-none
  !text-left !px-5 
 !justify-start !capitalize ]  items-center gap-2 !text-[#ff5252]'
          ><IoIosLogOut className='text-[17px] '/>
         Logout
          </Button>
          </NavLink>
</li>


</ul>
</div>
  )
}
export default AccountSidebar;
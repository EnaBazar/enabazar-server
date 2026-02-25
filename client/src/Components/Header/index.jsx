import React, { useContext, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Search from "../Search";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import {IoGitCompareOutline} from "react-icons/io5";
import {MdOutlineShoppingCart} from "react-icons/md";
import {FaRegHeart} from "react-icons/fa6";
import Tooltip from '@mui/material/Tooltip';
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import Button from "@mui/material/Button";
import { FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { fetchDataFromApi} from "../../utils/api";
import { HiOutlineMenu } from "react-icons/hi";


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));


const Header =() => {
 
    
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const context = useContext(MyContext);
  const history = useNavigate();
  const [isOpenCatPanel,setisOpenCatPanel] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    
    
    const logout=()=>{
      setAnchorEl(null);
      fetchDataFromApi(`/auth/logout?token=${localStorage.getItem('accesstoken')}`,
      {withCredentials:true}).then((res)=>{
        if(res?.error === false){
          context.setIsLogin(false);
          localStorage.removeItem("accesstoken")     
           localStorage.removeItem("refreshtoken")
           context.setUserData(null);
           context?.setCartData([]);
           context?.setMyListData([]);
         
           history("/");
        }
 
      })
    }

    return(
        
        <header className="bg-white sticky -top-[47px] z-100"> 
       <div className="top-strip py-2 !bg-[#FC8934] text-white border-t-[1px] border-gray-100 border-b-[1px]  ">
        <div className="container">
        <div className="flex items-center justify-between ">
        <div className="col1 w-[50%] hidden lg:block">
        <p className="text-[12px] font-[500]">Get up to 50% off new season styles, limited time</p>
        </div>
        
        <div className="col2 flex items-center justify-between w-full lg:w-[50%] lg:justify-end">  
        
        <ul className="flex items-center gap-3 w-full justify-between lg:w-[200px]">
        <li className="list-none">
        <Link to="/helpCenter" className="text-[13px] lg:text-[15px] link font-[500] transition">HelpCenter{""}</Link>
        </li>
        <li className="list-none">
        <Link to="/Order-tracking" className="text-[13px] lg:text-[15px]  link font-[500] transition">OrderTracking{""}</Link>
        </li>
        </ul>
        
        </div>
             
        </div>  
        </div>
        </div>
        
        
        
        
        <div className="header py-2 pt-3 lg:py-4 pb-3  border-b-[1px] 
         bg-[#dfd7d7] border-gray-400 ">
        <div className="container flex items-center justify-between">
         
          <div className="col1 w-[30%] lg:w-[0]  ">
          {
            context?.windowWidth < 992 &&    
            <Button className="!w-[45px] !min-w-[45px] !h-[45px]
             !min-h-[45px] !rounded-full !text-gray-400 "
             onClick={()=> setisOpenCatPanel(true)}
             > 
            <HiOutlineMenu className="text-[30px] text-gray-600 "/> 
            </Button>
          }
      </div>
      
  <div className="col1 w-[30%] lg:w-[10%] flex items-center 
     justify-end lg:justify-start">
  <Link to={"/"}> 
    <img src="/logo.png" className="" />
  </Link>
</div>
   {
            context?.windowWidth > 992 && 
 <div className="fixed  h-full p-2 bg-white z-50 block lg:w-[40%] lg:static lg:p-0 ">
  <div className=" h-full flex items-start justify-center">
    <Search />
  </div>
</div>
}

{/* Overlay + Search Panel */}
<div
  className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden
  ${context.isOpenSearchPanel ? "opacity-100 visible" : "opacity-0 invisible"}`}
>
  {/* Overlay */}
  <div
    className="absolute inset-0 bg-black/40"
    onClick={() => context.setIsOpenSearchPanel(false)}
  ></div>

  {/* Search Panel */}
  <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[90%] max-w-md 
    bg-white rounded-2xl shadow-lg p-4 animate-slideDown">
    <Search className="w-full" />
  </div>
</div>



      <div className="Reginfo col3 w-[50%] lg:w-[35%] flex items pl-8">
    
      <ul className="flex items-center justify-end gap-0 lg:gap-3 w-full">
        
        {
        context.isLogin === false ?
        <li className="list-none">
        <Link to="/login" className="link transition text-[14px] font-[500] lgn">Login</Link> | &nbsp;  <Link to="/Register"  className="link transition text-[14px] font-[500] lgn">Register</Link>
           
      </li>
      : (
 <>
 <li>
      <Button className="myAccountWrap !text-black flex items-center gap-3 cursor-pointer" onClick={handleClick}>

      <div className='rounded-full w-[30px] h-[30px] overflow-hidden cursor-pointer'>
         
         <img src={context?.userData?.avatar} className='w-full h-full object-cover'/>
         </div> 


         {
            context?.windowWidth > 992 && 
            
                 <div className="info flex flex-col">
      <h4 className="text-[14px] leading-3 mb-0 capitalize text-left font-[500]
       justify-start text-[rgba(0,0,0,0.6)]">{context?.userData?.name}</h4>
      <span className="text-[13px] capitalize text-left font-[400] 
      justify-start text-[rgba(0,0,0,0.6)]">{context?.userData?.email}</span>
      </div>
         }
 
      
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
      <Link to="/my-account " className="w-full block">
        <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
        <FaRegUser className="text-[18px]"/> <span className="text-[14px]">My Account</span>
        </MenuItem>
        
        </Link>
        <Link to="/oders " className="w-full block">
        <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
        <IoBagCheckOutline className="text-[18px]"/><span className="text-[14px]">Oders</span>
        </MenuItem>
        </Link>
     
     
        <Link to="/my-list " className="w-full block">
        <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
        <IoMdHeartEmpty className="text-[18px]"/> <span className="text-[14px]">My List</span>
        </MenuItem>  
        </Link>
        
     
        <MenuItem onClick={logout} className="flex gap-2 !py-2">
        <IoIosLogOut className="text-[18px]"/> <span className="text-[14px] text-[#ff5252]">LogOut</span>
        </MenuItem>
      </Menu>
</li>
 </>
        
      )}
        
 
{
  context?.windowWidth > 992 && 
      <li>
      <Tooltip title="WishList">
      <Link to="/my-list">
      <IconButton aria-label="cart" >
      <StyledBadge  badgeContent={context?.myListData?.length !==0 ?
      context?.myListData?.length : '0'} color="secondary">
      <FaRegHeart />
      </StyledBadge>
      </IconButton>
      </Link>
      </Tooltip>
      </li>  
}
{
 context?.windowWidth > 992 && 
 <li className="infocart">
      <Tooltip title="Compare">
      <IconButton aria-label="cart">
      <StyledBadge badgeContent={1} 
      color="secondary">
      <IoGitCompareOutline />
      </StyledBadge>
      </IconButton>
      </Tooltip>
  </li>    
}
 <li>
      <Tooltip title="Cart">
      <IconButton aria-label="cart" onClick={()=>context.setOpenCartPanel(true)}>
      <StyledBadge badgeContent={context?.cartData?.length !==0 ? context?.cartData?.length : '0'} color="secondary">
      <MdOutlineShoppingCart />
      </StyledBadge>
      </IconButton>
      </Tooltip>
      </li>
      </ul>  
      </div>  
      </div>
      </div>
        
     <Navigation setisOpenCatPanel={setisOpenCatPanel} isOpenCatPanel={isOpenCatPanel}/>
    </header>
    );
};
export default Header;

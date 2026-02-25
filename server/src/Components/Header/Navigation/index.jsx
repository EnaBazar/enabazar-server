import React, { useState } from "react"
import Button from '@mui/material/Button';
import {RiMenu2Fill} from "react-icons/ri";
import {LiaAngleDownSolid} from "react-icons/lia";
import { Link } from "react-router-dom";
import {GoRocket} from "react-icons/go";
import CategoryPanel from "./CategoryPanel"
import "../Navigation/style.css"

const Navigation =() => {
  
  const [isOpenCatPanel,setisOpenCatPanel] = useState(false);
  
  const openCategoryPanel =() =>{
    setisOpenCatPanel(true);
  }
  
    return(
        <>
        <nav className="py-2">
        <div className="container flex items-center  justify-end gap-8">
        <div className="CatMenu col_1 w-[20%]">
        <Button className="!text-black gap-2 min-w-auto  justify-start" onClick={openCategoryPanel}>
        <RiMenu2Fill className="text-[18px]"/>
        catagories 
        <LiaAngleDownSolid className="text-[13px] ml-auto font-bold " />
        </Button>
        
        </div>
        <div className="col_2 w-[60%]">
        <ul className="flex items-center gap-3 nav">
 
        
        <li className="list-none">
        <Link to="/" className="link transition text-[14px] !font-[600]">
        <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#f58822]">Home</Button> 
        </Link>
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]">
        <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#f58822]">Fashion
        </Button>
        </Link>
        <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        

        </li>
        
        
        
        
        
        
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]">
        <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Electronics</Button></Link>
        
        <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]">
        <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Bags</Button></Link>
        <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]"><Button className="link transition !font-[500]
         !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Footwear</Button>
         
         <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </Link>
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]"><Button className="link transition !font-[500]
         !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Grocoris</Button>
          <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
          
         </Link>
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]"><Button className="link transition !font-[500]
         !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Bueaty</Button>
          <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
         </Link>
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]"><Button className="link transition !font-[500]
         !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Weliness</Button>
          <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
         </Link>
        </li>
        
        <li className="list-none relative">
        <Link to="/" className="link transition text-[14px] font-[500]"><Button className="link transition !font-[500]
         !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]">Jewellery</Button>
          <div className="submenu absolute !top-[125 %] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
         <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
        <ul>    
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Men</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Women</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Kids</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Girls</Button>
        </Link>
        </li> 
        <li className="list-none w-full">
       <Link to="/" className="w-full">
        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left 
        !justify-start rounded-none">Boys</Button>
        </Link>
        </li>     
        </ul>
        </div>
        
         </Link>
        </li> 
        
        </ul>
        
        </div>
       
        <div className="FreeDel col_2 w-[20%]">
        <p className="text-[13px] font-[500] flex items-center gap-3 mb-0 mt-0"><GoRocket className="text-[18px] !ml-auto"/>Free International Delivery</p>
        </div>
        </div>
        
        </nav>
        
        {/* category Panel Component */}
        <CategoryPanel isOpenCatPanel={isOpenCatPanel} setisOpenCatPanel={setisOpenCatPanel}/>
        </>
    )
}
export default Navigation;
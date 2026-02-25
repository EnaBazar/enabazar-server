import React,{useState} from 'react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import {FaRegSquarePlus} from "react-icons/fa6";
import {FiMinusSquare} from "react-icons/fi";

const CategoryCollapse =() =>{
  
  const [submenuindex,setsubmenuindex] =useState(null);
const [Innersubmenuindex,setInnersubmenuindex] =useState(null);

const openSubmenu=(index)=>{
  if (submenuindex===index){
     
  setsubmenuindex(null);
  }
  else{
    setsubmenuindex(index);
  }  
  
};

const openInnerSubmenu=(index)=>{
  if (Innersubmenuindex===index){
     
    setInnersubmenuindex(null);
  }
  else{
    setInnersubmenuindex(index);
  }  
  
};




    return(
      <>
      
      <div className='scroll'>
      <ul className='w-full' >    
      <li className='list-none flex items-center relative flex-col '>
      <Link to="/" className='w-full'>
      <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Fashion</Button>
       </Link>
      
      {submenuindex === 0 ? (        
        <FiMinusSquare className='absolute top-[10px] right-[15px] cursor-pointer'  
         onClick={()=>openSubmenu(0)}/>     
      ):(    
        <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer'
        onClick={()=>openSubmenu(0)}/>     
      )}
 
      {
        submenuindex===0 && (
        <ul className='Submenu w-full pl-3 '>
        <li className='list-none relative'>
        <Link to="/" className='w-full'>
        <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>female</Button>
        </Link>
        
        {Innersubmenuindex === 0 ? (
        
        <FiMinusSquare className='absolute top-[10px] right-[15px] cursor-pointer' 
      
      onClick={()=>openInnerSubmenu(0)}/>
        
        
      ):(
        
        <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer'
        onClick={()=>openInnerSubmenu(0)}/>
         
      )}
        
       {
        Innersubmenuindex===0 && (
        
        <ul className='inner_Submenu  w-full pl-3 '>
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Kamiz</Link>
        </li>
        
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Tops</Link>  
        </li>
        
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Salower</Link>
        </li>
        
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Gens</Link>
        </li>
        
        
        </ul>
        
)}
        
        </li>
      
        </ul>      
      )}
        
      </li>
    
      <li className='list-none flex items-center relative flex-col'>
      <Link to="/" className='w-full'>
      <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Electronics</Button>
       </Link>
      
      {submenuindex === 1 ? (        
      <FiMinusSquare className='absolute top-[10px] right-[15px] cursor-pointer' 
      onClick={()=>openSubmenu(1)}/>
             
      ):(
        
      <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer'
      onClick={()=>openSubmenu(1)}/>
              
      )}
      
   
      
      {
        submenuindex===1 && (
        <ul className='Submenu w-full pl-3 '>
        <li className='list-none relative'>
        <Link to="/" className='w-full'>
        <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Home</Button>
        </Link>
        
        {Innersubmenuindex === 1 ? (
        
        <FiMinusSquare className='absolute top-[10px] right-[15px] cursor-pointer' 
      
      onClick={()=>openInnerSubmenu(1)}/> 
      ):(
        
        <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer' 
        onClick={()=>openInnerSubmenu(1)}/>
        
      )}
        
       {
        Innersubmenuindex===1 && (   
        <ul className='inner_Submenu w-full pl-3 '>   
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>AirCondition</Link>
        </li>
    
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Refrezator</Link>  
        </li>
        
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Washing</Link>
        </li>
        
        <li className='list-none relative !mb-1'>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>Iron</Link>
        </li>
               
        </ul>      
)}      
       
       
        </li>     
        </ul>       
      )}  
      </li>   
      </ul>   
         
      </div>
      
      
      </>
       
        
    )
    
    
}

export default CategoryCollapse;
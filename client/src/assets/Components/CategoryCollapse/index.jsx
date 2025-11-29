import React,{useState} from 'react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import {FaRegSquarePlus} from "react-icons/fa6";
import {FiMinusSquare} from "react-icons/fi";

const CategoryCollapse =(props) =>{
  
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
      
           {
          
          props?.data?.length !== 0 && props?.data?.map((cat, index)=>{
      return(
         <li className='list-none flex items-center relative flex-col '>
      <Link to="/" className='w-full'>
      <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>{cat?.name}</Button>
       </Link>
      
      {submenuindex === index ? (        
        <FiMinusSquare className='absolute top-[10px] right-[15px] cursor-pointer'  
         onClick={()=>openSubmenu(index)}/>     
      ):(    
        <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer'
        onClick={()=>openSubmenu(index)}/>     
      )}
 
      {
        submenuindex === index && (
        <ul className='Submenu w-full pl-3 '>
        
        
        {
           cat?.children?.length!==0 &&    cat?.children?.map((subCat, index_) =>{
           
           return(
             <li className='list-none relative'>
        <Link to="/" className='w-full'>
        <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>{subCat?.name}</Button>
        </Link>
        
        {Innersubmenuindex === index_ ? (
        
        <FiMinusSquare className='absolute top-[10px] right-[15px] cursor-pointer' 
      
      onClick={()=>openInnerSubmenu(index_)}/>
        
        
      ):(
        
        <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer'
        onClick={()=>openInnerSubmenu(index_)}/>
         
      )}
        
       {
        Innersubmenuindex=== index_ && (
        
        <ul className='inner_Submenu  w-full pl-3 '>
        
          {
           cat?.children?.length!==0 &&    subCat?.children?.map((thirdLavelCat, index_) =>{
             
             return(
        <li className='list-none relative !mb-1' key={index_}>
        <Link to="/" className='link w-full !text-left !justify-start !px-3 transition text-[14px]'>{thirdLavelCat?.name}</Link>
        </li>
             )
           })
           
           }
                                                                 
                                                                 
       
        
      
        
        
        </ul>
        
)}
        
        </li>
           )
           })
           }
                                                              
                                                              
        
      
        </ul>      
      )}
        
      </li>
        
      )
      })
    }    
             
     
    
      
      </ul>   
         
      </div>
      
      
      </>
       
        
    )
    
    
}

export default CategoryCollapse;
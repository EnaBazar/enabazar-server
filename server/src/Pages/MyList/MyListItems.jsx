import React from 'react'
import { Link } from 'react-router-dom';
import {IoCloseSharp} from 'react-icons/io5';
import  Button  from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import {BsFillBagCheckFill} from 'react-icons/bs';
  




const MyListItems = (props) => {
    
    
    

  return (
      
    <div className='cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.2)]'>
    <div className='img w-[15%] rounded-md overflow-hidden'>
    <Link to="/product/7845 "className='group'>
    <img src='/src/assets/Images/fashion2.jpg' className='w-full group hover:scale-105 transition-all'/>
    </Link>
    </div>
    
    
    <div className='info w-[85%] relative'>
    <IoCloseSharp className='cursor-pointer absolute top-[0px] right-[0px] text-[22px] link transition-all'/>
    <span className='text-[13px]'>Sangria</span>
    <h3 className='text-[15px]'><Link to="/product/7845" className='link'>A-Lina Kurti with Sharar & Dupatta</Link></h3>
    
    <Rating name="size-small" defaultValue={3} size="small" readOnly/>
  
    <div className='flex items-center gap-4 !mt-2 !mb-2'>
    
     <span className='Price text-black text-[14px] font-[600]'>$58.00</span>
     <span className='oldPrice line-through text-gray-500 text-[14px] font-[500]'>$58.00</span>
     <span className='Price text-pink-700 text-[14px] font-[600]'>55% OFF</span>
     </div>
     
     <br/>
     <Button className='btn-org h-[25px] !text-[11px] gap-2'>Add to Cart</Button>
    </div>
    </div>
 
    
  )
}
export default MyListItems;

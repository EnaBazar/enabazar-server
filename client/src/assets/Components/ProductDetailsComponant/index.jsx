import React, { useState } from 'react'
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import QtyBox from '../QtyBox';
import {MdOutlineShoppingCart} from "react-icons/md";
import {FaRegHeart} from "react-icons/fa";
import {IoGitCompareOutline} from "react-icons/io5";


const ProductDetailsComponant = () => {
     const [ProductActionIndex,setProductActionIndex] = useState(null);
          
        
    
  return (
    <>


         <h1 className='text-[24px] font-[600] !mb-2'>Chikankari Woven Kurta</h1>
         <div className='flex items-center  gap-3 '>
         <span className='text-gray-400 text-[13px]'>
         Brands : <span className='font-[500] text-black opacity-75'>
         House Of Chikenkari</span>
         
         </span>
         <Rating name="size-small" defaultValue={3} size="small" readOnly/>
         
         <span className='text-[13px] cursor-pointer'>Review (5)</span>
         </div>
         
   <div className='flex items-center gap-4 !mt-4'>
    <span className='oldPrice line-through text-gray-500 text-[20px] font-[500]'>$58.00</span>
    <span className='Price text-pink-700 text-[20px] font-[600]'>$58.00</span>
    
    <span className='text-[14px]'>Available In stock: <span className='text-green-600 font-bold'>147 Items</span></span>
    </div>
    
    <br/>
    <p className='text-[14px] !mb-5 !mt-3 pr-10'>Lorem Ipsum is simply dummy text of the 
    printing and typesetting
     industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took  has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took when an unknown printer took  has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took ... </p>
    
    
    <div className='flex items-center gap-3'>
    <span className='text-[14px]'>Size:</span>
   <div className='flex items-center gap-1 actions'>
   <Button className={`${ProductActionIndex === 0 ? '!bg-[#ff5252] !text-white ' : ''}`} onClick={()=>setProductActionIndex(0)}>S</Button>
   <Button className={`${ProductActionIndex === 1 ? '!bg-[#ff5252] !text-white ' : ''}`} onClick={()=>setProductActionIndex(1)}>M</Button>
   <Button className={`${ProductActionIndex === 2 ? '!bg-[#ff5252] !text-white ' : ''}`} onClick={()=>setProductActionIndex(2)}>L</Button>
   <Button className={`${ProductActionIndex === 3 ? '!bg-[#ff5252] !text-white ' : ''}`} onClick={()=>setProductActionIndex(3)}>XL</Button>
   </div>
    </div>
    
    <p className='!text-[12px] !mt-4 !mb-2 font-[500]'>Free shipping (Est. delivery Time 2-3 Days)</p>
    
  <div className='flex items-center !mt-4 gap-4 py-4'> 
   <div className='qtyBoxWrapper w-[80px]'>
   <QtyBox/>
   </div>
   <Button className='btn-org flex gap-2 h-[36px]'>
    <MdOutlineShoppingCart className='text-[22px]'/>
     Add to cart</Button>
   
    </div>
    
    <div className='flex items-center gap-4 !mt-4'>
    
  <span className='flex items-center gap-2 text-[15px] font-[500]  link cursor-pointer'><FaRegHeart className='text-[18px]'/>Add to WishList</span>
  <span className='flex items-center gap-2 text-[15px] font-[500]  link cursor-pointer'><IoGitCompareOutline className='text-[18px]'/>Add to Compare</span>
  </div>
  
  
  
         
      
    
    </>
    

  )
}
export default ProductDetailsComponant;

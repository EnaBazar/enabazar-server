import React, {useContext, useState } from 'react'
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {MdOutlineShoppingCart} from "react-icons/md";
import {FaRegHeart} from "react-icons/fa";
import {IoGitCompareOutline} from "react-icons/io5";
import { QtcBox } from '../QtyBox';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { Link } from 'react-router-dom';


const ProductDetailsComponant = (props) => {
    const [ProductActionIndex,setProductActionIndex] = useState(null);
    const [quantity, setquantity] = useState(1);
    const [selectedTabName, setSelectedTabName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tabError, setTabError] = useState(false);

    const context = useContext(MyContext);


const handleSelecteQty=(qty)=>{
  setquantity(qty)
}

const addToCart = (products, userId, quantity) => {
    if(userId===undefined){
        context?.openAlertBox("error","You are not login Please login again!");
        return false;
    }
  const productItem ={
            productId:products?._id,
            productTitle:products?.name,
            image:products?.images[0],
            rating:products?.rating,
            price:products?.price, 
            oldprice:products?.oldPrice,
            discount:products?.discount,
            brand:products?.brand,
            quantity:quantity,
            subTotal:parseInt(products?.price * quantity),
            countInStock:products?.countInStock,
            weight:props?.item?.productWeight?.length !== 0  ? selectedTabName : '',
            size:props?.item?.size?.length !== 0  ? selectedTabName : '',
            Ram:props?.item?.productRam?.length !== 0  ? selectedTabName : '',
            userId:userId,
  }
  
  if(props?.item?.size?.length !== 0 || 
    props?.item?.productWeight?.length !== 0 || 
    props?.item?.productRam?.length !== 0){
  if (selectedTabName !== null){
     setIsLoading(true);
  postData("/cart/create", productItem).then((res)=>{
    
  if(res?.error===false){   
  context?.openAlertBox("success", res?.message);  
  context?.getCartItems();
  setTimeout(()=>{
 setIsLoading(false);
  },1000)
 
  }else{  
  context?.openAlertBox("error", res?.message);
      setTimeout(()=>{
 setIsLoading(false);
 
  },1000)
  } 
  })
  }else{
    setTabError(true);
  }
    
  }else{
     postData("/cart/create", productItem).then((res)=>{
    
  if(res?.error===false){   
  context?.openAlertBox("success", res?.message);  
  context?.getCartItems();
  setTimeout(()=>{
 setIsLoading(false);
  },1000)
 
  }else{  
  context?.openAlertBox("error", res?.message);
      setTimeout(()=>{
 setIsLoading(false);
  },1000)
  } 
  })
  }

};

const handleClickActiveTab=(index, name)=>{
setProductActionIndex(index)
  setSelectedTabName(name)
}
    
  return (
    <>


         <h1 className='text-[24px] font-[600] !mb-2'>{props?.item?.name}</h1>
         <div className='flex items-center  gap-3 '>
         <span className='text-gray-400 text-[13px]'>
         Brands : <span className='font-[500] text-black opacity-75'>
        {props?.item?.brand}</span>
         
         </span>
         <Rating name="size-small" defaultValue={props?.item?.rating} size="small" readOnly/>
         
         <span className='text-[13px] cursor-pointer' onClick={props.gotoreviews}>Review ({props.reviewsCount})</span>
         </div>
         
   <div className='flex items-center gap-4 !mt-4'>
    <span className='oldPrice line-through text-gray-500 text-[20px] font-[500]'>&#2547; {props?.item?.oldPrice}</span>
    <span className='Price text-pink-700 text-[20px] font-[600]'>&#2547; {props?.item?.price}</span>
    
    <span className='text-[14px]'>Available In stock: <span className='text-green-600 font-bold'>{props?.item?.countInStock}</span></span>
    </div>
    
    <br/>
    <p className='text-[14px] !mb-5 !mt-3 pr-10'>{props?.item?.description} </p>
    
    {
     props?.item?.productRam?.length !== 0 && 
         <div className='flex items-center gap-3'>
    <span className='text-[14px]'>RAME:</span>
   <div className='flex items-center gap-1 actions'>
   
{  props?.item?.productRam?.map((item,index)=>{
  
  return(
      <Button 
      className={`${ProductActionIndex === index ? 
        '!bg-[#ff5252] !text-white ' : ''}${tabError===true && '!border !border-[#ff5252]' }`} 
     onClick={()=>handleClickActiveTab(index, item)}
     >
    {item}
      </Button>
  )
})}
 
  
   </div>
    </div>
      
    }
    
    {
     props?.item?.productWeight?.length !== 0 && 
         <div className='flex items-center gap-3'>
    <span className='text-[14px]'>WEIGHT:</span>
   <div className='flex items-center gap-1 actions'>
   
{  props?.item?.productWeight?.map((item,index)=>{
  
  return(
      <Button 
      className={`${ProductActionIndex === index ? '!bg-[#ff5252] !text-white ' : ''}${tabError===true && '!border !border-[#ff5252]' }`} 
      onClick={()=>handleClickActiveTab(index, item)}>{item}
      </Button>
  )
  })}
    </div>
    </div>  
    }    
    {
     props?.item?.size?.length !== 0 && 
    <div className='flex items-center gap-3'>
    <span className='text-[14px]'>SIZE:</span>
    <div className='flex items-center gap-1 actions'>
    {props?.item?.size?.map((item, index)=>{
  
  return(
      <Button 
      className={`${ProductActionIndex === index ? '!bg-[#ff5252] !text-white ' : ''}${tabError===true && 
        '!border !border-[#ff5252]' }`} 
      onClick={()=>handleClickActiveTab(index, item)}>{item}
      </Button>
)
})}
 
  
   </div>
    </div>
      
    }
    
    <p className='!text-[12px] !mt-4 !mb-2 font-[500]'>Free shipping (Est. delivery Time 2-3 Days)</p>
    
  <div className='flex items-center !mt-4 gap-4 py-4'> 
   <div className='qtyBoxWrapper w-[100px]'>
   <QtcBox handleSelecteQty={handleSelecteQty} item={props?.item}/>
   </div>


   <Button className='btn-org flex gap-2 h-[36px] !min-w-[150px]'
    onClick={()=>addToCart(props?.item,
     context?.userData?._id, quantity)}>
    {
      isLoading === true ? <CircularProgress/> : 
      <>
      <MdOutlineShoppingCart className='text-[22px]'/>
     Add to cart
      </>
    }
  </Button>
 
   
    </div>
    
    <div className='flex items-center gap-4 !mt-4'>
    
  <span className='flex items-center gap-2 text-[15px] font-[500]  link cursor-pointer'><
    FaRegHeart className='text-[18px]'/>Add to WishList</span>
  <span className='flex items-center gap-2 text-[15px] font-[500]  link cursor-pointer'><
    IoGitCompareOutline className='text-[18px]'/>Add to Compare</span>
  </div>
  
  
  
         
      
    
    </>
    

  )
}
export default ProductDetailsComponant;

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
 import { useNavigate } from "react-router-dom";

const ProductDetailsComponant = (props) => {
    const [ProductActionIndex,setProductActionIndex] = useState(null);
    const [quantity, setquantity] = useState(1);
    const [selectedTabName, setSelectedTabName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tabError, setTabError] = useState(false);
const navigate = useNavigate();
    const context = useContext(MyContext);


const handleSelecteQty=(qty)=>{
  setquantity(qty)
}

const addToCart = async (product, userId, quantity) => {

  // 1️⃣ User not logged in
  if (!userId) {
    context?.openAlertBox("error", "আপনি প্রথমবার ব্যবহার করছেন, মোবাইল নাম্বার দিয়ে প্রবেশ করুন!");
    setTimeout(() => {
      context?.setOpenLoginPanel(true);
    }, 800);
    return { success: false };
  }

  // 2️⃣ Required variation validation
  const variationRequired =
    props?.item?.size?.length ||
    props?.item?.productWeight?.length ||
    props?.item?.productRam?.length;

  if (variationRequired && !selectedTabName) {
    setTabError(true);
    return { success: false };
  }

  // 3️⃣ Prepare Product Payload
  const payload = {
    productId: product?._id,
    productTitle: product?.name,
    image: product?.images?.[0],
    rating: product?.rating,
    price: product?.price,
    oldprice: product?.oldPrice,
    discount: product?.discount,
    brand: product?.brand,
    quantity: quantity,
    subTotal: parseInt(product?.price * quantity),
    countInStock: product?.countInStock,
    weight: product?.productWeight?.length ? selectedTabName : "",
    size: product?.size?.length ? selectedTabName : "",
    Ram: product?.productRam?.length ? selectedTabName : "",
    userId,
  };

  setIsLoading(true);

  try {
    const res = await postData("/cart/create", payload);
    setIsLoading(false);

    if (res?.error === false) {
      context?.openAlertBox("success", res?.message);
      context?.getCartItems();
      return { success: true };
    } else {
      context?.openAlertBox("error", res?.message || "Failed to add cart");
      return { success: false };
    }

  } catch (err) {
    setIsLoading(false);
    context?.openAlertBox("error", "Something went wrong!");
    return { success: false };
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
    
    <p className='!text-[12px] !mt-4 !mb-2 font-[500]'>
      Free shipping (Est. delivery Time 2-3 Days)</p>
    
  <div className="py-4 w-full">

  {/* Row: Qty + Add to Cart */}
  <div className="flex items-center gap-4 mb-4">

    {/* Qty Box */}
    <div className="w-[100px] ">
      <QtcBox handleSelecteQty={handleSelecteQty} 
      item={props?.item} />
    </div>

    {/* Add to Cart */}
    <Button
     
      className="btn-org btn-border !h-[40px] rounded-md flex 
      items-center justify-center gap-2 
             !text-[15px] font-[600] transition-all"
      onClick={async () => {
        const result = await addToCart(
          props?.item,
          context?.userData?._id,
          quantity
        );
      }}
    >
      {isLoading ? (
        <CircularProgress size={22} />
      ) : (
        <>
          <MdOutlineShoppingCart className="text-[22px]" />
          Add Cart
        </>
      )}
    </Button>

  </div>

{/* Checkout Button — Always Below */}
  
<button
 className="btn-org flex gap-2 h-[40px] !text-[15px] 
 !mt-3 font-[600] flex items-center justify-center rounded-md !min-w-[160px]"
  onClick={async () => {
    const result = await addToCart(
      props?.item,
      context?.userData?._id,
      quantity
    );
    if (result?.success) navigate("/checkout");
  }}
>
BUY NOW
</button>

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

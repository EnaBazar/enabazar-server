import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import {MdOutlineDeleteOutline} from "react-icons/md"
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { deleteData } from '../../utils/api';

 
 
 
 
 
 const CartPanel = (props) => {
      const context = useContext(MyContext);

 const removeItem = (id) =>{
        deleteData(`/cart/delete-cart-item/${id}`).then((res)=>{   
            context?.openAlertBox("success", "Remove Cart Item");      
              context?.getCartItems();
              })
 }
 
 
  return (
    <>
    
    <div className='scroll w-full max-h-[500px] overflow-y-scroll overflow-x-hidden py-3 px-4 '>
   
   {
     props?.data?.map((item, index)=>{
       return(
      <div className='cartitem w-full flex items-center gap-4 pb-4 border-b border-[rgba(0,0,0,0.2)] '>
      <div className='img w-[25%] overflow-hidden h-70px] rounded-md'>
      <Link to={`/product/${item?.productId}`} className='block group'> <img src={item?.image} className='w-full group-hover:scale-105 ' alt='pictue'/></Link>
      </div>
      
      
      <div className='info w-[75%] relative pt-3'>
      <h4> <Link to={`/product/${item?.productId}`} className='link transition-all'>{item?.productTitle?.substr(0,40)+'...'}
      </Link>
      </h4>
      <p className='flex items-center gap-5 mt-2 mb-2'>
      <span>Qty : <span>{item?.quantity}</span></span>
      <span className='text-[#ff5252] !font-[bold]'> {item?.subTotal}  &#2547;</span>
      </p>
      <MdOutlineDeleteOutline className='absolute top-[40px] right-[0px] cursor-pointer text-[20px] link transition-all' onClick={()=>removeItem(item?._id)}/>
      </div>
      </div> 
       )
     })
   }
    </div>
    <br/>
    <br/>        
<div className='bottomSec w-full absolute bottom-[10px] pr-5 overflow-hidden '>
   <div className='bottomInfo py-3  px-4 w-full border-t border-[rgba(0,0,0,0.2)] flex items-center justify-between flex-col'>
   <div className='flex items-center justify-between w-full'>
   <span className='text-[14px] font-[600]'>{context?.cartData?.length} item</span>
   <span className='text-[#ff5252] font-bold'>   {
     (
       context.cartData?.length !== 0 ?
       context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0)
        : 0)?.toLocaleString('en-BD', {style:'currency', currency: 'BDT'})
     
    }</span>
   </div>
                                

  
    
    <div className='bottomInfo py-3  px-4 w-full border-t border-[rgba(0,0,0,0.2)] flex items-center justify-between flex-col'> 
    <div className='flex items-center justify-between w-[110%]'>
    <span className='text-[14px] font-[600]'>Total (tax excl.)</span>
    <span className='text-[#ff5252] font-bold'> {
     (
       context.cartData?.length !== 0 ?
       context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0)
        : 0)?.toLocaleString('en-BD', {style:'currency', currency: 'BDT'})
     
   }</span>   
    </div>   

    <br/>
    
    <div className='flex items-center justify-between w-full gap-5'>
    <Link to="/Cart" className='w-[50%] d-block'><Button className='btn-org btn-lg w-full' onClick={()=>context.setOpenCartPanel(false)}>View Cart</Button></Link>
    <Link to="/checkout" className='w-[50%] d-block'><Button className='btn-org btn-lg w-full btn-border' onClick={()=>context.setOpenCartPanel(false)}>Check Out</Button></Link>
    </div>
    </div>
    </div>
    </div>
    </>
  )
}
export default CartPanel;
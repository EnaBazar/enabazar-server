import React, { useContext, useEffect, useState } from 'react'

import  Button  from '@mui/material/Button';
import {BsFillBagCheckFill} from 'react-icons/bs';
import CartItems from '../Cart/cartItems';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';


const CartPage = () => {
  
      const [productSizeData, setProductSizeData]= useState([]);
      const [productRamsData, setProductRamsData]= useState([]);
      const [productWeightData, setProductWeightData]= useState([]);  

      const  context = useContext(MyContext);
        const navigate = useNavigate();
      
  
      useEffect(()=>{    
        window.scrollTo(0,0);
  
        fetchDataFromApi("/product/productSize/get").then((res)=>{ 
             if (res?.error === false)     {
               setProductSizeData(res?.products)
             }                                               
            } )                                                 
                                                                 
                fetchDataFromApi("/product/productWieght/get").then((res)=>{ 
             if (res?.error === false)     {
               setProductWeightData(res?.products)
             }   
            })
                  fetchDataFromApi("/product/productRAMS/get").then((res)=>{ 
             if (res?.error === false)     {
               setProductRamsData(res?.products)
             }   
                                                                    })
      },[])
      
      const selectedSize = (item) =>{
        if(item?.size !== ""){
          return item?.size;
        }
        
            if(item?.weight !== ""){
          return item?.weight;
        }
            
                if(item?.Ram !== ""){
          return item?.Ram;
        }
      }
      
      
  return (
      
 <section className="section py-10 pb-10">
  <div className="container w-[95%] md:w-[80%] max-w-[1200px] flex flex-col md:flex-row gap-5">
    
    {/* Left Part - Cart Items */}
    <div className="leftPart w-full md:w-[70%]">
      <div className="shadow-md rounded-md p-5 bg-white">
        <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <p className="text-sm">
            There are{" "}
            <span className="font-bold text-[#ff5252]">
              {context?.cartData?.length}
            </span>{" "}
            products in your Cart
          </p>
        </div>

        {context?.cartData?.length !== 0 ? (
          context?.cartData?.map((item, index) => (
            <CartItems
              selected={() => selectedSize(item)}
              qty={item?.quantity}
              item={item}
              key={index}
              productSizeData={productSizeData}
              productRamsData={productRamsData}
              productWeightData={productWeightData}
            />
          ))
        ) : (
          <div className="flex items-center justify-center flex-col py-10 gap-5">
            <img src="/empty-cart.png" className="w-[150px]" alt="Empty Cart" />
            <h4 className="text-base font-medium">Your Cart is currently empty</h4>
            <Link to="/">
              <Button className="btn-org btn-sm">Continue Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>

    {/* Right Part - Cart Totals */}
    <div className="rightPart w-full md:w-[30%]">
      <div className="shadow-md rounded-md bg-white p-5 md:sticky md:top-[165px] z-50">
        <h3 className="text-lg font-semibold">Cart Totals</h3>
        <hr className="text-[rgba(0,0,0,0.2)] mb-5" />

        {/* Subtotal */}
        <p className="flex items-center justify-between mb-2">
          <span className="text-[14px] font-[500]">Subtotal</span>
          <span className="text-[#ff5252] font-bold">
            {(
              context.cartData?.length !== 0
                ? context.cartData
                    ?.map((item) => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                : 0
            )?.toLocaleString("en-BD", {
              style: "currency",
              currency: "BDT",
            })}
          </span>
        </p>

        {/* Shipping */}
        <p className="flex items-center justify-between mb-2">
          <span className="text-[14px] font-[500]">Shipping</span>
          <span className="font-bold">Free</span>
        </p>

        {/* Estimate */}
        <p className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-[500]">Estimate for</span>
          <span className="font-bold">Bangladesh</span>
        </p>

        <hr className="text-[rgba(0,0,0,0.2)] mb-4" />

        {/* Total */}
        <p className="flex items-center justify-between mb-5">
          <span className="text-[14px] font-[500]">Total</span>
          <span className="text-[#ff5252] font-bold">
            {(
              context.cartData?.length !== 0
                ? context.cartData
                    ?.map((item) => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                : 0
            )?.toLocaleString("en-BD", {
              style: "currency",
              currency: "BDT",
            })}
          </span>
        </p>

        <Button
          className="btn-org btn-lg w-full flex gap-2"
          onClick={() => {
            navigate("/checkout");
          }}
        >
          <BsFillBagCheckFill className="text-[20px]" /> Check Out
        </Button>
      </div>
    </div>
  </div>
</section>

  )
}
export default CartPage;

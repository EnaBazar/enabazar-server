
import React, { useContext, useEffect } from 'react'
import { MyContext } from '../../App';
import "../ProductItem/style.css";
import  Button  from '@mui/material/Button'
import { useState } from 'react';
import {FaMinus, FaPlus} from "react-icons/fa6";
import { deleteData, editData } from '../../utils/api';




export const QtcBox = (props) => {
  
    const [qtyVal, setQtyVal] = useState(1);
   
     const [cartItem, setCartItem] = useState([]);
      const [activeTab, setActiveTab] = useState(null);
         const [isShowTab, setIsShowTab] = useState(false);
             const [selectedTabName, setSelectedTabName] = useState(null);
         
         
  const context = useContext(MyContext);

  useEffect(() => {
    const item = context?.cartData?.filter(
      (cartItem) => cartItem.productId === props?.item?._id
    );

    if (item && item.length > 0) {
      setCartItem(item);
   
      setQtyVal(item[0]?.quantity || 1);
    } else {
      setQtyVal(1);
    }

  }, [context?.cartData, props?.item?._id]);
console.log(context?.cartData)


  const minusQty = () => {
    if (qtyVal !== 1 && qtyVal > 1) {
                setQtyVal(qtyVal -1)
                 props.handleSelecteQty(1)
    } else {
   setQtyVal(1)
  props.handleSelecteQty(qtyVal-1)
    }

    if (qtyVal === 1) {
      deleteData(`/cart/delete-cart-item/${cartItem[0]?._id}`).then((res) => {
    
        context.openAlertBox("success", "Removed from Cart");
        context?.getCartItems();
       
     
      });
    } else {
      const obj = {
        _id: cartItem[0]?._id,
        qty: qtyVal - 1,
        subTotal: props?.item?.price * (qtyVal - 1),
      };

      editData(`/cart/update-qty`, obj).then((res) => {
        context.openAlertBox("success", res?.data?.message);
        context?.getCartItems();
      });
    }
  };

  const addQty = () => {
    setQtyVal(qtyVal + 1)
    props.handleSelecteQty(qtyVal + 1)     

    const obj = {
      _id: cartItem[0]?._id,
      qty: qtyVal + 1,
      subTotal: props?.item?.price * (qtyVal + 1),
    };

    editData(`/cart/update-qty`, obj).then((res) => {
      context.openAlertBox("success", res?.data?.message);
      context?.getCartItems();
    });
  };


    
  return (
     <div className='flex items-center  justify-between overflow-hidden rounded-md !mt-3 !mb-3  gap-2 border border-[rgba(0,0,0,0.1)] '>
          <Button
                type="button"   // ✅ Fix
                className="!min-w-[30px] !w-[30px] !h-[30px] !bg-gray-400 !rounded-none"
                onClick={minusQty}
              >
                <FaMinus className="text-white" />
              </Button>
              <span>{qtyVal}</span>
              <Button
                type="button"   // ✅ Fix
                className="!min-w-[30px] !w-[30px] !h-[30px] !bg-red-400 !rounded-none"
                onClick={addQty}
              >
                <FaPlus className="text-white" />
              </Button>
     </div>
        
  )
}

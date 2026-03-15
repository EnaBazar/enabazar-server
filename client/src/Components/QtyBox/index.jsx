import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import "../ProductItem/style.css";
import Button from '@mui/material/Button';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { deleteData, editData } from '../../utils/api';

export const QtcBox = (props) => {
  const [qtyVal, setQtyVal] = useState(1);
  const [cartItem, setCartItem] = useState([]);
  const context = useContext(MyContext);

  const stock = props?.stock || props?.item?.countInStock || 0; // stock value

  useEffect(() => {
    const item = context?.cartData?.filter(
      (cartItem) => cartItem.productId === props?.item?._id
    );

    if (item && item.length > 0) {
      setCartItem(item);
      const initQty = Math.min(item[0]?.quantity || 1, stock);
      setQtyVal(initQty);
      props.handleSelecteQty(initQty);
    } else {
      setQtyVal(stock > 0 ? 1 : 0);
      props.handleSelecteQty(stock > 0 ? 1 : 0);
    }
  }, [context?.cartData, props?.item?._id, stock]);

  const minusQty = () => {
    if (qtyVal <= 1) return;

    const newQty = qtyVal - 1;
    setQtyVal(newQty);
    props.handleSelecteQty(newQty);

    const obj = {
      _id: cartItem[0]?._id,
      qty: newQty,
      subTotal: props?.item?.price * newQty,
    };

    if (newQty === 0) {
      deleteData(`/cart/delete-cart-item/${cartItem[0]?._id}`).then((res) => {
        context.openAlertBox("success", "Removed from Cart");
        context?.getCartItems();
      });
    } else {
      editData(`/cart/update-qty`, obj).then((res) => {
        context.openAlertBox("success", res?.data?.message);
        context?.getCartItems();
      });
    }
  };

  const addQty = () => {
    if (qtyVal >= stock) return; // Prevent exceeding stock

    const newQty = qtyVal + 1;
    setQtyVal(newQty);
    props.handleSelecteQty(newQty);

    const obj = {
      _id: cartItem[0]?._id,
      qty: newQty,
      subTotal: props?.item?.price * newQty,
    };

    editData(`/cart/update-qty`, obj).then((res) => {
      context.openAlertBox("success", res?.data?.message);
      context?.getCartItems();
    });
  };

  return (
    <div className='flex items-center justify-between overflow-hidden rounded-md !mt-3 !mb-3 gap-2 border border-[rgba(0,0,0,0.1)]'>
      <Button
        type="button"
        disabled={qtyVal <= 1 || stock <= 0}
        className={`!min-w-[30px] !w-[30px] !h-[30px] !bg-gray-400 !rounded-none ${qtyVal <= 1 || stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
        onClick={minusQty}
      >
        <FaMinus className="text-white" />
      </Button>

      <span>{qtyVal}</span>

      <Button
        type="button"
        disabled={qtyVal >= stock || stock <= 0}
        className={`!min-w-[30px] !w-[30px] !h-[30px] !bg-red-400 !rounded-none ${qtyVal >= stock || stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
        onClick={addQty}
      >
        <FaPlus className="text-white" />
      </Button>
    </div>
  );
};
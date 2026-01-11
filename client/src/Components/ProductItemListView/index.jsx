
import "../ProductItem/style.css";
import React, { useContext, useEffect, useState } from 'react';
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdClose, MdOutlineShoppingCart, MdZoomOutMap } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";

import { MyContext } from '../../App';
import { deleteData, editData, postData } from '../../utils/api';
const ProductItem =(props) =>{
        const [quantity, setQuantity] = useState(1);
        const [isAdded, setIsAdded] = useState(false);
        const [isAddedInMyList, setIsAddedInMyList] = useState(false);
        const [cartItem, setCartItem] = useState([]);
        const [activeTab, setActiveTab] = useState(null);
        const [isShowTab, setIsShowTab] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [selectedTabName, setSelectedTabName] = useState(null);
      
        const context = useContext(MyContext);
      
        const addToCart = (products, userId, qty) => {
          const productItem = {
            _id: products?._id,
            name: products?.name,
            image: products?.images[0],
            rating: products?.rating,
            price: products?.price,
            oldprice: products?.oldPrice,
            discount: products?.discount,
            brand: products?.brand,
            quantity: qty,
            subTotal: parseInt(products?.price * qty),
            countInStock: products?.countInStock,
            weight: props?.item?.productWeight?.length !== 0 ? selectedTabName : '',
            size: props?.item?.size?.length !== 0 ? selectedTabName : '',
            Ram: props?.item?.productRam?.length !== 0 ? selectedTabName : '',
            userId: userId,
          };
      
          setIsLoading(true);
      
          if (
            props?.item?.size?.length !== 0 ||
            props?.item?.productRam?.length !== 0 ||
            props?.item?.productWeight?.length !== 0
          ) {
            setIsShowTab(true);
          } else {
            context?.addToCart(productItem, userId, qty);
            setIsAdded(true);
            setIsShowTab(false);
          }
      
          if (activeTab !== null) {
            context?.addToCart(productItem, userId, qty);
            setIsAdded(true);
            setIsShowTab(false);
          }
        };
      
        const handleClickActiveTab = (index, name) => {
          setActiveTab(index);
          setSelectedTabName(name);
        };
      
        useEffect(() => {
          const item = context?.cartData?.filter(
            (cartItem) => cartItem.productId === props?.item?._id
          );
      
          const myListItem = context?.myListData?.filter(
            (i) => i.productId === props?.item?._id
          );
      
          if (item && item.length > 0) {
            setCartItem(item);
            setIsAdded(true);
            setQuantity(item[0]?.quantity || 1);
          } else {
            setQuantity(1);
          }
      
          if (myListItem?.length !== 0) {
            setIsAddedInMyList(true);
          } else {
            setIsAddedInMyList(false);
          }
        }, [context?.cartData, context?.myListData, props?.item?._id]);
      
        const minusQty = () => {
          if (quantity !== 1 && quantity > 1) {
            setQuantity(quantity - 1);
          } else {
            setQuantity(1);
          }
      
          if (quantity === 1) {
            deleteData(`/cart/delete-cart-item/${cartItem[0]?._id}`).then((res) => {
              setIsAdded(false);
              context.openAlertBox("success", "Removed from Cart");
              context?.getCartItems();
              setActiveTab(null);
              setIsShowTab(false);
            });
          } else {
            const obj = {
              _id: cartItem[0]?._id,
              qty: quantity - 1,
              subTotal: props?.item?.price * (quantity - 1),
            };
      
            editData(`/cart/update-qty`, obj).then((res) => {
              context.openAlertBox("success", res?.data?.message);
              context?.getCartItems();
            });
          }
        };
      
        const addQty = () => {
          setQuantity(quantity + 1);
      
          const obj = {
            _id: cartItem[0]?._id,
            qty: quantity + 1,
            subTotal: props?.item?.price * (quantity + 1),
          };
      
          editData(`/cart/update-qty`, obj).then((res) => {
            context.openAlertBox("success", res?.data?.message);
            context?.getCartItems();
          });
        };
      
        const handleAddToMyList = (item) => {
          if (context?.userData === null) {
            context?.openAlertBox("error", "Your session expired, please login again!");
            return false;
          } else {
            const obj = {
              productId: item?._id,
              userId: context?.userData?._id,
              productTitle: item?.name,
              image: item?.images[0],
              rating: item?.rating,
              price: item?.price,
              oldPrice: item?.oldPrice,
              brand: item?.brand,
              discount: item?.discount,
            };
      
            postData("/myList/add", obj).then((res) => {
              if (res?.error === false) {
                context?.openAlertBox("success", res?.message);
                setIsAddedInMyList(true);
                context?.getMyListData();
              } else {
                context?.openAlertBox("error", res?.message);
              }
            });
          }
        };
      
    return(
<div className="ProductItem shadow-md rounded-md overflow-hidden border border-[rgba(0,0,0,0.2)] hover:scale-105 transition flex flex-col">
  {/* Image Section */}
  <div className="group imgWrapper w-full h-[200px] sm:h-[220px] md:h-[250px] overflow-hidden relative bg-white">
    <Link to={`/product/${props?.item?._id}`}>
      <div className="img relative w-full h-full">
        <img
          src={props?.item?.images[0]}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        {props?.item?.images[1] && (
          <img
            src={props?.item?.images[1]}
            className="w-full h-full object-contain absolute top-0 left-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
          />
        )}
      </div>
    </Link>

    {/* Size / RAM / Weight Tab */}
    {isShowTab && (
      <div className="flex flex-wrap items-center justify-center absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] z-50 p-3 gap-2">
        <Button
          type="button"
          className="!absolute top-2 right-2 !min-w-[28px] !w-[28px] !h-[28px] !rounded-full !bg-white"
          onClick={() => setIsShowTab(false)}
        >
          <MdClose className="text-black text-[18px]" />
        </Button>

        {props?.item?.size?.map((size, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs bg-[rgba(255,255,255,0.9)] rounded-sm cursor-pointer hover:bg-white ${
              activeTab === index && "!bg-amber-600 text-white"
            }`}
            onClick={() => handleClickActiveTab(index, size)}
          >
            {size}
          </span>
        ))}

        {props?.item?.productRam?.map((ram, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs bg-[rgba(255,255,255,0.9)] rounded-sm cursor-pointer hover:bg-white ${
              activeTab === index && "!bg-amber-600 text-white"
            }`}
            onClick={() => handleClickActiveTab(index, ram)}
          >
            {ram}
          </span>
        ))}

        {props?.item?.productWeight?.map((weight, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-[10px] bg-[rgba(255,255,255,0.9)] rounded-sm cursor-pointer hover:bg-white ${
              activeTab === index && "!bg-amber-600 text-white"
            }`}
            onClick={() => handleClickActiveTab(index, weight)}
          >
            {weight}
          </span>
        ))}
      </div>
    )}

    {/* Discount Badge */}
    {props?.item?.discount > 0 && (
      <span className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 text-xs font-semibold rounded-md shadow">
        -{props?.item?.discount}%
      </span>
    )}

    {/* Hover Action Buttons */}
    <div className="actions absolute -top-32 right-2 z-50 flex items-center gap-2 flex-col w-[40px] transition-all duration-300 group-hover:top-3 opacity-0 group-hover:opacity-100">
      <Button
        type="button"
        className="!w-8 !h-8 !min-w-8 !rounded-full !bg-white hover:!bg-red-500 text-black hover:text-white shadow-sm"
        onClick={() => context.handleOpenProductDetailsModel(true, props?.item)}
      >
        <MdZoomOutMap className="text-[18px]" />
      </Button>

      <Button
        type="button"
        className="!w-8 !h-8 !min-w-8 !rounded-full !bg-white hover:!bg-red-500 text-black hover:text-white shadow-sm"
      >
        <IoGitCompareOutline className="text-[18px]" />
      </Button>

      <Button
        type="button"
        className="!w-8 !h-8 !min-w-8 !rounded-full !bg-white hover:!bg-red-500 text-black hover:text-white shadow-sm"
        onClick={() => handleAddToMyList(props?.item)}
      >
        {isAddedInMyList ? (
          <IoMdHeart className="text-[18px] text-red-500" />
        ) : (
          <FaRegHeart className="text-[18px]" />
        )}
      </Button>
    </div>
  </div>

  {/* Info Section */}
  <div className="info flex-1 p-3 bg-[#f9f9f9] flex flex-col justify-between">
    {/* Brand */}
    <h6 className="text-xs text-gray-500 uppercase tracking-wide">
      {props?.item?.brand}
    </h6>

    {/* Title */}
    <h3 className="text-sm font-semibold text-gray-800 mt-1 mb-2 line-clamp-2">
      <Link
        to={`/product/${props?.item?._id}`}
        className="hover:text-pink-600 transition-colors"
      >
        {props?.item?.name}
      </Link>
    </h3>

    {/* Rating */}
    <Rating name="size-small" value={props?.item?.rating} size="small" readOnly />

    {/* Price */}
    <div className="flex items-center gap-2 mt-2">
      {props?.item?.oldPrice && (
        <span className="line-through text-gray-400 text-xs sm:text-sm">
          ৳ {props?.item?.oldPrice}
        </span>
      )}
      <span className="text-pink-600 text-base sm:text-lg font-bold">
        ৳ {props?.item?.price}
      </span>
    </div>
<Link to={`/product/${props?.item?._id}`}>
            <Button
              type="button"   // ✅ Fix
              className="w-full btn-orgs btn-borders text-black py-2 rounded-lg 
              shadow-md flex items-center justify-center gap-2"
              size="small"
             
            >
              <MdOutlineShoppingCart className="text-[14px] font-[500]" /> Order Now
            </Button>


            </Link>

  
    
  </div>
</div>


    );
};
export default ProductItem;
import React, { useContext, useEffect, useState } from 'react';
import "../ProductItem/style.css";
import { Link, useNavigate } from "react-router-dom";
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdClose, MdOutlineShoppingCart, MdZoomOutMap } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { MyContext } from '../../App';
import { deleteData, editData, postData } from '../../utils/api';

const ProductItem = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isShowTab, setIsShowTab] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const history = useNavigate();
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
         history("/login");
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

  return (
    <div className="ProductItem shadow-md rounded-md overflow-hidden border border-[rgba(0,0,0,0.2)] hover:scale-105 transition">
      <div className="group imgWrapper w-full h-[200px] overflow-hidden rounded-md relative">
        <Link to={`/product/${props?.item?._id}`}>
          <div className="img relative w-full h-full">
            <img
              src={props?.item?.images[0]}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <img
              src={props?.item?.images[1]}
              className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-110"
            />
          </div>
        </Link>

        {isShowTab && (
          <div className="flex items-center justify-center absolute top-0 left-0 w-full 
          h-full bg-[rgba(0,0,0,0.4)] z-50 p-3 gap-2">
            <Button
              type="button"
              className="!absolute bottom-[40px] right-[15px] !min-w-[30px] !w-[30px] !h-[30px] 
              !rounded-full !bg-[rgba(255,255,255,0.2)]"
              onClick={() => setIsShowTab(false)}
            >
              <MdClose className="text-black text-[20px]" />
            </Button>

            {props?.item?.size?.map((size, index) => (
              <span
                key={index}
                className={`flex items-center justify-center p-1 px-2 text-[12px] 
                  bg-[rgba(255,255,255,0.8)] w-[25px] h-[20px] rounded-sm cursor-pointer hover:bg-white ${
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
                className={`flex items-center justify-center p-1 px-2 text-[12px] 
                  bg-[rgba(255,255,255,0.8)] w-[45px] h-[20px] rounded-sm cursor-pointer hover:bg-white ${
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
                className={`flex items-center justify-center p-1 px-2 text-[10px] 
                  bg-[rgba(255,255,255,0.8)] w-[45px] h-[20px] rounded-sm cursor-pointer hover:bg-white ${
                  activeTab === index && "!bg-amber-600 text-white"
                }`}
                onClick={() => handleClickActiveTab(index, weight)}
              >
                {weight}
              </span>
            ))}
          </div>
        )}

        <span className="discount absolute top-[10px] left-[10px] z-50 bg-pink-600 text-white
         px-2 py-1 text-xs font-semibold rounded-md shadow">
          {props?.item?.discount}%
        </span>

        {/* Action buttons */}
        <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center
         gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px]
          opacity-0 group-hover:opacity-100">
          <Button
            type="button"
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-white 
            hover:!bg-red-500
             text-black hover:text-white"
            onClick={() => context.handleOpenProductDetailsModel(true, props?.item)}
          >
            <MdZoomOutMap className="text-[20px]" />
          </Button>

          <Button
            type="button"
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-white hover:!bg-red-500 
            text-black hover:text-white"
          >
            <IoGitCompareOutline className="text-[20px]" />
          </Button>

          <Button
            type="button"
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full 
            !bg-white hover:!bg-red-500 text-black hover:text-white"
            onClick={() => handleAddToMyList(props?.item)}
          >
            {isAddedInMyList ? (
              <IoMdHeart className="text-[20px] text-red-500" />
            ) : (
              <FaRegHeart className="text-[20px]" />
            )}
          </Button>
        </div>
      </div>


      <div className="info p-3 py-2 !mt-3 bg-[#f1f1f1]">
        <h6 className="text-xs text-gray-500 uppercase tracking-wide">{props?.item?.brand}</h6>
        <h3 className="text-sm font-semibold text-gray-800 mt-1 mb-2 line-clamp-2">
          <Link to={`/product/${props?.item?._id}`} className="hover:text-pink-600">
            {props?.item?.name}
          </Link>
        </h3>

        <Rating name="size-small" value={props?.item?.rating} size="small" readOnly />

        <div className="flex items-center gap-4 mt-2">
          <span className="oldPrice line-through text-gray-400 text-sm">
            &#2547; {props?.item?.oldPrice}
          </span>
          <span className="Price text-pink-600 text-lg font-bold">
            &#2547; {props?.item?.price}
          </span>
        </div>

        <div className="!mt-5">
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
    </div>
  );
};

export default ProductItem;

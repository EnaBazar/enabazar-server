import React, { useContext, useState } from "react";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { QtcBox } from "../QtyBox";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ProductDetailsComponant = (props) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [productActionIndex, setProductActionIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tabError, setTabError] = useState(false);

  // ================= QTY =================
  const handleSelecteQty = (qty) => {
    setQuantity(qty);
  };

  // ================= VARIATION =================
  const handleClickActiveTab = (index, name) => {
    setProductActionIndex(index);
    setSelectedTabName(name);
    setTabError(false);
  };

  // ================= JWT LOGIN CHECK =================
  const checkLogin = () => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      context?.openAlertBox("error", "অনুগ্রহ করে আগে লগইন করুন");
      context?.setOpenLoginPanel(true);
      return false;
    }
    return true;
  };

  // ================= USER ID GETTER =================
  const getUserId = () => {
    if (context?.userData?._id) return context.userData._id;

    const localUser = localStorage.getItem("user");
    if (localUser) return JSON.parse(localUser)?._id;

    return null;
  };

  // ================= ADD TO CART =================
  const addToCart = async (product, qty) => {
    if (!checkLogin()) return { success: false };

    const userId = getUserId();
    if (!userId) {
      context?.openAlertBox("error", "User তথ্য পাওয়া যায়নি, আবার লগইন করুন");
      context?.setOpenLoginPanel(true);
      return { success: false };
    }

    const variationRequired =
      product?.size?.length ||
      product?.productWeight?.length ||
      product?.productRam?.length;

    if (variationRequired && !selectedTabName) {
      setTabError(true);
      context?.openAlertBox("error", "অনুগ্রহ করে একটি অপশন নির্বাচন করুন");
      return { success: false };
    }

    const payload = {
      productId: product?._id,
      productTitle: product?.name,
      image: product?.images?.[0],
      rating: product?.rating,
      price: product?.price,
      oldprice: product?.oldPrice,
      discount: product?.discount,
      brand: product?.brand,
      quantity: qty,
      subTotal: product?.price * qty,
      countInStock: product?.countInStock,
      weight: product?.productWeight?.length ? selectedTabName : "",
      size: product?.size?.length ? selectedTabName : "",
      Ram: product?.productRam?.length ? selectedTabName : "",
      userId,
    };

    try {
      setIsLoading(true);
      const res = await postData("/cart/create", payload);
      setIsLoading(false);

      if (res?.message === "Item already in cart") {
        context?.openAlertBox("info", "পণ্যটি ইতিমধ্যেই কার্টে আছে");
        return { success: true };
      }

      if (res?.error === false) {
        context?.openAlertBox("success", res?.message);
        context?.getCartItems();
        return { success: true };
      }

      context?.openAlertBox("error", res?.message || "Failed to add cart");
      return { success: false };
    } catch (error) {
      setIsLoading(false);
      context?.openAlertBox("error", "Something went wrong!");
      return { success: false };
    }
  };

  // ================= BUY NOW =================
  const handleBuyNow = async () => {
    const result = await addToCart(props?.item, quantity);
    if (result?.success) {
      navigate("/checkout");
    }
  };

  return (
    <>
      <h1 className="text-[24px] font-[600] !mb-2">
        {props?.item?.name}
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-[13px]">
          Brands :
          <span className="font-[500] text-black opacity-75">
            {props?.item?.brand}
          </span>
        </span>

        <Rating
          name="size-small"
          defaultValue={props?.item?.rating}
          size="small"
          readOnly
        />

        <span
          className="text-[13px] cursor-pointer"
          onClick={props.gotoreviews}
        >
          Review ({props.reviewsCount})
        </span>
      </div>

      <div className="flex items-center gap-4 !mt-4">
        <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
          ৳ {props?.item?.oldPrice}
        </span>
        <span className="Price text-pink-700 text-[20px] font-[600]">
          ৳ {props?.item?.price}
        </span>
        <span className="text-[14px]">
          Available In stock :
          <span className="text-green-600 font-bold">
            {props?.item?.countInStock}
          </span>
        </span>
      </div>

      {/* RAM */}
      {props?.item?.productRam?.length > 0 && (
        <div className="flex items-center gap-3 !mt-3">
          <span className="text-[14px]">RAM:</span>
          <div className="flex gap-1 actions">
            {props.item.productRam.map((item, index) => (
              <Button
                key={index}
                className={`${productActionIndex === index ? "!bg-[#ff5252] !text-white" : ""} ${
                  tabError ? "!border !border-[#ff5252]" : ""
                }`}
                onClick={() => handleClickActiveTab(index, item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* WEIGHT */}
      {props?.item?.productWeight?.length > 0 && (
        <div className="flex items-center gap-3 !mt-3">
          <span className="text-[14px]">WEIGHT:</span>
          <div className="flex gap-1 actions">
            {props.item.productWeight.map((item, index) => (
              <Button
                key={index}
                className={`${productActionIndex === index ? "!bg-[#ff5252] !text-white" : ""} ${
                  tabError ? "!border !border-[#ff5252]" : ""
                }`}
                onClick={() => handleClickActiveTab(index, item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* SIZE */}
      {props?.item?.size?.length > 0 && (
        <div className="flex items-center gap-3 !mt-3">
          <span className="text-[14px]">SIZE:</span>
          <div className="flex gap-1 actions">
            {props.item.size.map((item, index) => (
              <Button
                key={index}
                className={`${productActionIndex === index ? "!bg-[#ff5252] !text-white" : ""} ${
                  tabError ? "!border !border-[#ff5252]" : ""
                }`}
                onClick={() => handleClickActiveTab(index, item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[12px] !mt-2 mb-2 font-[700]">
        Free shipping (Est. delivery Time 2-3 Days)
      </p>

      {/* QTY + ADD CART */}
      <div className="flex items-center gap-4 !mt-4">
        <div className="w-[100px]">
          <QtcBox handleSelecteQty={handleSelecteQty} item={props?.item} />
        </div>

        <Button
          className="btn-org btn-border !h-[30px] flex !gap-2"
          onClick={() => addToCart(props?.item, quantity)}
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

      {/* BUY NOW */}
      <button
        className="btn-org h-[30px] text-[12px] !mt-3 font-[600] min-w-[160px] rounded-md"
        onClick={handleBuyNow}
      >
        BUY NOW
      </button>

      <div className="flex items-center !gap-4 !mt-4">
        <span className="flex items-center gap-2 cursor-pointer">
          <FaRegHeart /> Add to WishList
        </span>
        <span className="flex items-center gap-2 cursor-pointer">
          <IoGitCompareOutline /> Add to Compare
        </span>
      </div>
    </>
  );
};

export default ProductDetailsComponant;

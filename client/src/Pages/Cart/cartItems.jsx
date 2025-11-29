import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from 'react-icons/go';
import Rating from '@mui/material/Rating';
import { deleteData, editData, fetchDataFromApi} from '../../utils/api';
import { MyContext } from '../../App';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const CartItems = (props) => {
  // Size
  const [sizeanchorEl, setSizeAnchorEl] = useState(null);
  const [selectedSize, setSelectedSize] = useState(props.selected);
    const context = useContext(MyContext);
  const openSize = Boolean(sizeanchorEl);

  const handleClickSize = (event) => {
    setSizeAnchorEl(event.currentTarget);
    };
  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value !== null) {
      setSelectedSize(value);

    }
  };

  // Qty
  const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
      const [selectedQty, setSelectedQty] = useState(props.qty);
  const openQty = Boolean(qtyAnchorEl);

  const handleClickQty = (event) => {
    setQtyAnchorEl(event.currentTarget);
  };
  const handleCloseQty = (value) => {
    setQtyAnchorEl(null);
    if (value !== null) {
      setSelectedQty(value);
      
      const qtyObj ={
    _id:props?.item?._id,
    qty:value,
    subTotal:props?.item?.price * value,

      }
      
        editData("/cart/update-qty",qtyObj).then((res)=>{
    if(res?.data?.error===false){
       context.openAlertBox("success", "Update Qty Item");
       context?.getCartItems() ;     
    }
  })
    }
  };
   
   const removeItem = (id) =>{
          deleteData(`/cart/delete-cart-item/${id}`).then((res)=>{   
              context.openAlertBox("success", "Remove Cart Item");      
                context?.getCartItems();
                })
   }
   
  const updateCart=(selectedVal,qty, field)=>{
    handleCloseSize(selectedVal)
    

  const cartObj ={
    _id:props?.item?._id,
    qty:qty,
    subTotal:props?.item?.price * qty,
    size:props?.item?.size!=="" ? selectedVal : '',
     weight:props?.item?.weight!=="" ? selectedVal : '',
      Ram:props?.item?.Ram!=="" ? selectedVal : '',
  }
  
  // If Product Size A vailable
if(field === "size"){
fetchDataFromApi(`/product/${props?.item?.productId}`).then((res)=> {

  const product = res?.products;

    const item = product?.size?.filter(
    (size) => size?.includes(selectedVal)
  );
  if (item?.length !== 0) {
     editData("/cart/update-qty",cartObj).then((res)=>{
    if(res?.data?.error===false){
       context.openAlertBox("success", "Update Cart Item");
       context?.getCartItems() ;     
    }
  })
  }else{  
 context.openAlertBox("error",  `Sorry This Product Size ${selectedVal} Not avilable!`);
  }
})
  }

 
  // If Product Weight A vailable

if(field === "weight"){
fetchDataFromApi(`/product/${props?.item?.productId}`).then((res)=> {

  const product = res?.products;
  console.log(product)


    const item = product?.productWeight?.filter(
    (weight) => weight?.includes(selectedVal)
  );

  if (item?.length !== 0) {
     editData("/cart/update-qty",cartObj).then((res)=>{
    if(res?.data?.error===false){
       context.openAlertBox("success", "Update Cart Item");
       context?.getCartItems() ;     
    }
  })
  }else{
      context.openAlertBox("error",  `Sorry This Product Weight ${selectedVal} Not avilable!`);
  }
})
  }

// If Product Rams A vailable

if(field === "ram"){
fetchDataFromApi(`/product/${props?.item?.productId}`).then((res)=> {

  const product = res?.products;
  console.log(product)


    const item = product?.productRam?.filter(
    (ram) => ram?.includes(selectedVal)
  );

  if (item?.length !== 0) {
     editData("/cart/update-qty",cartObj).then((res)=>{
    if(res?.data?.error===false){
       context.openAlertBox("success", "Update Rams Item");
       context?.getCartItems() ;     
    }
  })
  }else{
      context.openAlertBox("error", `Sorry This Product Rams ${selectedVal} Not avilable!`);
  }
})
  }
  }


  return (
  <div className="cartItem w-full p-3 flex flex-col md:flex-row items-start md:items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.2)]">
  {/* Image */}
  <div className="img w-full md:w-[15%] rounded-md overflow-hidden">
    <Link to={`/product/${props?.item?.productId}`} className="group block">
      <img
        src={props?.item?.image}
        alt={props?.item?.productTitle}
        className="w-full h-auto object-cover group-hover:scale-105 transition-all"
      />
    </Link>
  </div>

  {/* Info */}
  <div className="info w-full md:w-[85%] relative">
    {/* Delete button */}
    <MdOutlineDeleteOutline
      className="cursor-pointer absolute top-2 right-2 text-[22px] link transition-all"
      onClick={() => removeItem(props?.item?._id)}
    />

    {/* Brand */}
    <span className="text-[12px] font-[600] bg-sky-600 text-white rounded-md px-2 py-1 inline-block mt-2 md:mt-0">
      {props?.item?.brand}
    </span>

    {/* Title */}
    <h3 className="link text-[15px] !mb-2 !mt-2 md:mt-1">
      <Link to={`/product/${props?.item?.productId}`} className="link">
        {props?.item?.productTitle}
      </Link>
    </h3>

    {/* Rating */}
    <Rating name="size-small" value={props?.item?.rating}
     size="small" readOnly />

    {/* Size / Ram / Weight / Qty Selectors */}
    <div className="flex flex-wrap items-center gap-3 !mt-3">
      {/* Size Selector */}
      {props?.item?.size !== "" && props?.productSizeData?.length !== 0 && (
        <div className="relative">
          <span
            className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] p-1 rounded-md px-2 cursor-pointer"
            onClick={handleClickSize}
          >
            Size: {selectedSize} <GoTriangleDown />
          </span>
          <Menu
            id="size-menu"
            anchorEl={sizeanchorEl}
            open={openSize}
            onClose={() => handleCloseSize(null)}
          >
            {props?.productSizeData?.map((item, index) => (
              <MenuItem
                key={index}
                className={`${item?.name === selectedSize && "selected"} font-bold text-[12px]`}
                onClick={() => updateCart(item?.name, props?.item?.quantity, "size")}
              >
                {item?.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}

      {/* Ram Selector */}
      {props?.item?.Ram !== "" && props?.productRamsData?.length !== 0 && (
        <div className="relative">
          <span
            className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] p-1 rounded-md px-2 cursor-pointer"
            onClick={handleClickSize}
          >
            Ram: {selectedSize} <GoTriangleDown />
          </span>
          <Menu
            id="ram-menu"
            anchorEl={sizeanchorEl}
            open={openSize}
            onClose={() => handleCloseSize(null)}
          >
            {props?.productRamsData?.map((item, index) => (
              <MenuItem
                key={index}
                className={`${item?.name === selectedSize && "selected"} font-bold text-[12px]`}
                onClick={() => updateCart(item?.name, props?.item?.quantity, "ram")}
              >
                {item?.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}

      {/* Weight Selector */}
      {props?.item?.weight !== "" && props?.productWeightData?.length !== 0 && (
        <div className="relative">
          <span
            className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] p-1 rounded-md px-2 cursor-pointer"
            onClick={handleClickSize}
          >
            Weight: {selectedSize} <GoTriangleDown />
          </span>
          <Menu
            id="weight-menu"
            anchorEl={sizeanchorEl}
            open={openSize}
            onClose={() => handleCloseSize(null)}
          >
            {props?.productWeightData?.map((item, index) => (
              <MenuItem
                key={index}
                className={`${item?.name === selectedSize && "selected"} font-bold text-[12px]`}
                onClick={() => updateCart(item?.name, props?.item?.quantity, "weight")}
              >
                {item?.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}

      {/* Qty Selector */}
      <div className="relative">
        <span
          className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] p-1 rounded-md px-2 cursor-pointer"
          onClick={handleClickQty}
        >
          Qty: {selectedQty} <GoTriangleDown />
        </span>
        <Menu
          id="Qty-menu"
          anchorEl={qtyAnchorEl}
          open={openQty}
          onClose={() => handleCloseQty(null)}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <MenuItem key={num} onClick={() => handleCloseQty(String(num))}>
              {num}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>

    {/* Prices */}
    <div className="flex flex-wrap items-center gap-3 !mt-4">
      <span className="Price text-black text-[14px] font-[600]">
        &#2547; {props?.item?.price}
      </span>
      <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
        &#2547; {props?.item?.oldprice}
      </span>
      <span className="Price text-pink-700 text-[14px] font-[600]">
        {props?.item?.discount}% OFF
      </span>
    </div>
  </div>
</div>

  );
};

export default CartItems;

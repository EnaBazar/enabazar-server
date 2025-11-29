import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import {IoCloseSharp} from 'react-icons/io5';
import  Button  from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import {BsFillBagCheckFill} from 'react-icons/bs';
import { deleteData } from '../../utils/api';
import { MyContext } from '../../App';
  




const MyListItems = (props) => {
             
     const context = useContext(MyContext);

     
    const removeItem=(_id)=>{
      deleteData(`/myList/${_id}`).then((res)=>{
           context?.openAlertBox("success", "Remove MyList Item"); 
           context?.getMyListData([]); 
      })
    }
    

  return (
      
   <div className="cartItem w-full !mb-3 p-3 flex flex-col 
   sm:flex-row items-start sm:items-center !gap-3
    sm:gap-4 border-b border-[rgba(0,0,0,0.2)]">

  {/* Product Image */}
  <div className="img w-full sm:w-[15%] h-[150px] rounded-md overflow-hidden">
    <Link to={`/product/${props?.item?.productId}`} className="group">
      <img
        src={props?.item?.image}
        className="w-full h-full object-cover group-hover:scale-105 transition-all"
        alt={props?.item?.productTitle}
      />
    </Link>
  </div>

  {/* Product Info */}
  <div className="info w-full sm:w-[85%] relative flex flex-col gap-2">

    {/* Remove Icon */}
    <IoCloseSharp
      className="cursor-pointer absolute top-2 right-2 text-[22px] sm:text-[22px] text-gray-600 hover:text-red-500 transition-all"
      onClick={() => removeItem(props?.item?._id)}
    />

    {/* Brand */}
    <span className="text-[12px] sm:text-[13px] font-[600] bg-sky-600 text-white rounded-md px-2 py-1">
      {props?.item?.brand}
    </span>

    {/* Product Title */}
    <h3 className="text-[14px] sm:text-[15px] font-medium">
      <Link to={`/product/${props?.item?.productId}`} className="link">
        {props?.item?.productTitle?.length > 60
          ? props?.item?.productTitle.substr(0, 60) + "..."
          : props?.item?.productTitle}
      </Link>
    </h3>

    {/* Rating */}
    <Rating name="size-small" value={props?.item?.rating} size="small" readOnly />

    {/* Price Section */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
      <span className="Price text-black text-[13px] sm:text-[14px] font-[600]">
        &#2547; {props?.item?.price}
      </span>
      <span className="oldPrice line-through text-gray-500 text-[12px] sm:text-[14px] font-[500]">
        &#2547; {props?.item?.oldPrice}
      </span>
      <span className="Price text-pink-700 text-[12px] sm:text-[14px] font-[600]">
        {props?.item?.discount} % OFF
      </span>
    </div>

    {/* View Details Button */}
    <Link to={`/product/${props?.item?.productId}`} className="link mt-2 sm:mt-0">
      <Button className="btn-org h-[28px] !text-[11px] sm:!text-[12px] gap-2">
        View Details
      </Button>
    </Link>

  </div>
</div>

    
  )
}
export default MyListItems;

import React, { useContext } from 'react'
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import  Button  from '@mui/material/Button';
import {FaRegHeart} from "react-icons/fa";
import {IoGitCompareOutline} from "react-icons/io5";
import {MdZoomOutMap} from "react-icons/md";
import {MdOutlineShoppingCart} from "react-icons/md";
import { MyContext } from '../../App';

const ProductItem =() =>{
        const context =useContext(MyContext);
    return(
     <div className='ProductItem shadow-md rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.2)] group  flex items-center'>
     <div className=' group imgWrapper w-[25%] h-[200px] overflow-hidden rounded-md  relative'>
     <img src='/src/assets/Images/ProductItems/0347377_frogy-slider_300.jpeg' className='w-full group-hover:scale-115'/>
     
     <span className='discount flex items-center absolute top-[10px] left-[10px] z-50
     bg-blue-300 text-white h-7 rounded-lg p-2 text-[12px] font-[500]'>-$20</span>   
     
     <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] 
     transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100 ">
     
     <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full
     !bg-white hover:!bg-[red] text-black hover:text-white group" onClick={()=>context.setOpenProductDetailsModel(true)}>
     <MdZoomOutMap className='text-[20px] !text-black group-hover:text-white hover:!text-white'/>
     </Button>
     
     <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full
     !bg-white hover:!bg-[red] text-black hover:text-white group">
     <IoGitCompareOutline className='text-[20px] !text-black group-hover:text-white hover:!text-white'/>
     </Button>
     
     <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full
     !bg-white hover:!bg-[red] text-black hover:text-white group">
     <FaRegHeart className='text-[20px] !text-black group-hover:text-white hover:!text-white'/>
     </Button>
     
     </div>
     
     
     </div>
     
     <div className="info  p-8 py-5 !px-8 w-[75%]">
     <h6 className="text-[15px] !font-[500]"><Link to="/" className="link transition-all">SleeperToyes</Link></h6>
     <h3 className='text-[18px] title !mt-3 font-[500] !mb-3 text-[#000]'><Link to="/" className='link transition-all'>Very Nice Frogy Slepper for babys..</Link></h3>
     
     
     <p className='text-[14px] mb-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took </p>
      
    <Rating name="size-small" defaultValue={3} size="small" readOnly/>
    
    <div className='flex items-center gap-4'>
    <span className='oldPrice line-through text-gray-500 text-[14px] font-[500]'>$58.00</span>
    <span className='Price text-pink-700 text-[16px] font-[600]'>$58.00</span>
    </div>
    
    <div>
    <Button className='btn-org !mt-3 flex gap-2'><MdOutlineShoppingCart className='text-[20px]'/>Add to Cart</Button>
    
    </div>
     </div>
       
     </div>   
    );
};
export default ProductItem;
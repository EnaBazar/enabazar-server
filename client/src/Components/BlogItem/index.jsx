import React from 'react'
import {IoMdTime} from "react-icons/io";
import {IoIosArrowForward} from "react-icons/io";
import { Link } from 'react-router-dom';




const getPlainText = (html, maxLength = 150) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || '';
  return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
};

const BlogItem = (props) =>{
    return(
        
      <div className='blogItem group mb-5'>
      <div className="imgwrapper w-full overflow-hidden rounded-md cursor-pointer relative">
      <img src={props?.item?.images[0]} className='w-full transition-all group-hover:scale-105 group-hover:rotate-1' alt='Blog'/>
      
      <span className='flex itemicenter justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[red]
       rounded-md p-1 text-[11px] font-[500] gap-1 '><IoMdTime className='text-[16px]'/>{props?.item?.createdAt?.split("T")[0]}</span>
      </div>
      
      
      <div className="info py-4">
      <h2 className='text-[16px] font-[600] text-black'><Link to="/" className='link'>{props?.item?.blogtitle?.substr(0,70)+'...'}</Link></h2>
      <p className='text-[13px] font-[400] text-[rgba(0,0,0,0.8)] !mb-4'>   {getPlainText(props?.item?.description?.substr(0,700)+'...')}</p>
      
      <Link to={`/blog/${props?.item._id}`} className='link font-[500] flex items-center gap-1'>Read More <IoIosArrowForward/></Link>
      </div>
      </div>  
    )
    
    
    
}
export default BlogItem;
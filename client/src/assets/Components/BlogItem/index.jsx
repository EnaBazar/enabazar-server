import React from 'react'
import {IoMdTime} from "react-icons/io";
import {IoIosArrowForward} from "react-icons/io";
import { Link } from 'react-router-dom';

const BlogItem = () =>{
    return(
        
      <div className='blogItem group'>
      <div className="imgwrapper w-full overflow-hidden rounded-md cursor-pointer relative">
      <img src='/src/assets/Images/AdsBanner/AdsBanner5.jpeg' className='w-full transition-all group-hover:scale-105 group-hover:rotate-1' alt='Blog'/>
      
      <span className='flex itemicenter justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[red]
       rounded-md p-1 text-[11px] font-[500] gap-1 '><IoMdTime className='text-[16px]'/>25 February 2025</span>
      </div>
      
      
      <div className="info py-4">
      <h2 className='text-[16px] font-[600] text-black'><Link to="/" className='link'>Nullam Ullamcoper ornare molestie</Link></h2>
      <p className='text-[13px] font-[400] text-[rgba(0,0,0,0.8)] !mb-4'>Oral Tablets and Extended-Release Oral Capsules. Lorazepam oral tablets and extended-release oral capsules should be 
      stored at room temperature. Store in a cool, dry place....</p>
      
      <Link className='link font-[500] flex items-center gap-1'>Read More <IoIosArrowForward/></Link>
      </div>
      </div>  
    )
    
    
    
}
export default BlogItem;
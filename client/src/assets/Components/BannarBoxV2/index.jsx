import React from 'react'
import "../BannarBoxV2/style.css";
import { Link } from 'react-router-dom';


const BannerBoxV2 =(props) =>{
    
    return(
      <div className='bannerBoxV2 w-full overflow-hidden rounded-[10px] group relative' >
      <img src={props.image} className='w-full transition-all duration-150 group-hover:scale-105'/>
   
   
   <div className={`info absolute p-5 top-0 ${props.info==="left" ? 'left-0' : 'right-0'} w-[70%] h-[100%] 
   !z-100 flex items-center justify-center flex-col gap-2 ${props.info==="left" ?'' : 'pl-16' }`}>
   
   <h2 className='text-[18px] font-[600] text-[#dfdede]'>Samsung Gear VR Camera</h2>
   <span className='text-[20px] w-full text-[red] font-[600]'>$129.00</span>
   
   <div className='w-full text-white  !h-[23%] '>
   <Link to="/" className='text-[12px] font-[600] link'>SHOP NOW</Link>
   </div>
   
   </div>
   
   
      
      </div>
        
        
    )
    
}
export default BannerBoxV2;
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {EffectFade,Pagination,Navigation,Autoplay } from 'swiper/modules';
import Button  from '@mui/material/Button';




const HomeSliderV2 =() => {
    
    return(
        
        <Swiper
        loop={true}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
       
        spaceBetween={30}
        effect={'fade'}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[EffectFade,Pagination,Navigation,Autoplay]}
       className="sliderHome" 
        >
            
            
             <SwiperSlide>
             <div className='item w-full rounded-md overflow-hidden relative'>
             <img src="/src/assets/Images/HomeSlider1.jpg"  alt='HomeSlider1'/>   
             
             <div className='info absolute top-0 -right-[100%] opacity-0 w-[40%] h-[100%]
              z-50 p-8 flex items-center flex-col justify-center transition-all duration-700'>
             <h4 className='text-[18px] font-[500] w-full text-left !mb-3 relative -right-[100%] opacity-0'>Big Saving Days Sale</h4>
             <h2 className='text-[28px] font-[700] w-full relative -right-[100%] opacity-0'>Women Solid Round <br/>
            Green T-Shirt</h2>
            
            <h3 className='text-[18px] font-[600] w-full text-left mt-3 mb-3 flex items-center gap-3 relative -right-[100%] opacity-0'>Satrting At Only 
            <span className='text-[white] text-[30px]'>$59.00</span></h3>
            
            <div className='w-full relative -right-[100%] opacity-0 btn_'>
            <Button className='!bg-blue-500 !text-white btn-org h-[70%] '>SHOP NOW</Button>
        
            </div>
             </div>    
         </div>
             </SwiperSlide>
             
   
             <SwiperSlide>
             
             <div className='item rounded-[20px] overflow-hidden relative'>
             <img src="/src/assets/Images/HomeSlider1.1.jpg"  alt='HomeSlider1'/>  
             
             <div className='info2 absolute top-0 -left-[100%] opacity-0 w-[90%] h-[100%]
              z-50 p-8 flex items-center flex-col justify-center transition-all duration-700'>
             <h4 className='text-[18px] font-[500] w-full text-left !mb-3 relative -left-[100%] opacity-0'>Big Saving Days Sale</h4>
             <h2 className='text-[28px] font-[700] w-full relative -left-[100%] opacity-0'>Women Solid Round <br/>
            Green T-Shirt</h2>
            
            <h3 className='text-[18px] font-[600] w-full text-left mt-3 mb-3 flex items-center gap-3 relative -left-[100%] opacity-0'>Satrting At Only 
            <span className='text-[white] text-[30px]'>$59.00</span></h3>
            
            <div className='w-full  relative -left-[100%] opacity-0 btn_'>
            <Button className='!bg-blue-500 !text-white btn-org h-[70%]'>SHOP NOW</Button>
        
            </div>
             </div>     
         </div>     
         
             </SwiperSlide>
           
           </Swiper>
        
        
        
        
        
          
        
    );
    
};
export default HomeSliderV2;

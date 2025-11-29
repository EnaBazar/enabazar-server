import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Autoplay,Pagination, Navigation } from 'swiper/modules';

const HomeSlider = () => {
    
    return(
        
<div className='homeslider '>
  <div className='container py-4 '>
  <Swiper
   spaceBetween={30}
   loop={true}
   centeredSlides={true}
   autoplay={{
     delay: 2500,
     disableOnInteraction: false,
   }}
   pagination={{
     clickable: true,
   }}
   navigation={false}
   modules={[Autoplay, Pagination, Navigation]}
  className="sliderHome" 
   >
       
       
        <SwiperSlide>
        <div className='item rounded-[20px] overflow-hidden'>
        <img src="/src/assets/Images/HomeSlider1.2.jpg" 
        alt='HomeSlider1' className='w-full' />       
        </div>
     
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item rounded-[20px] overflow-hidden'>
        <img src="/src/assets/Images/HomeSlider1.1.jpg" alt='HomeSlider2' className='w-full'/> 
        </div>  
        </SwiperSlide>
      
        <SwiperSlide>
        <div className='item rounded-[20px] overflow-hidden'>
        <img src="/src/assets/Images/HomeSlider1.jpg" alt='HomeSlider3' className='w-full'/> 
        </div>
        </SwiperSlide>
      
      </Swiper>
      </div>
</div>
    )
}

export default HomeSlider;
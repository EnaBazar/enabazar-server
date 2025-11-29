import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Navigation } from 'swiper/modules';
import ProductItem from '../../Components/ProductItem';
import { Container } from '@mui/material';





const ProductsSlider =() =>{
    
    return(
        <div className='Productsslider py-7 pr-4'>
          <Swiper 
        breakpoints={{
          340: {          
              slidesPerView: 2,
              spaceBetween:10
              
            },
            820: {
              slidesPerView: 4,
              spaceBetween:10
              
            },
            1280: {
                slidesPerView: 7,
                spaceBetween:10
                
              },
          }}
    
        navigation={true}    
        modules={[FreeMode,Navigation]}
        className="mySwiper"    
      >
      
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
       
       
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
   
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <ProductItem/> 
    </SwiperSlide>
    
    
    </Swiper>
        
        
</div>
        
    )
}
export default ProductsSlider;
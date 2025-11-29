import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Navigation } from 'swiper/modules';


const HomeCatSlider = ()=> {
      
    return(
    <div className='homeCatSlider pt-4 py-8 '>
    <div className='container py-6'>
    <h3 className=''>Featureas Catagories :</h3>
    <Swiper 
        breakpoints={{
            340: {          
              slidesPerView: 3,
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
    <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/FoodItem.webp' className='rounded-[50%]'/> 
    <h3 className='p-4'>Food & Vabarage</h3>
    </div>         
        </SwiperSlide>
       
        <SwiperSlide>
    <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Electronics.webp' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Electronics</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/fashion.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Fashion</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Bage.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Bage Collection</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/jewelleries.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'>jewelleries</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Home-living.webp' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Home Accosories</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Baby.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Baby Collection</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Pharmacy.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'> Drug & Pharmacy</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Special.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Special Offer</h3>
        </div>
          
        </SwiperSlide>
        
        <SwiperSlide>
        <div className='item p-3 bg-none  text-center flex items-center justify-center flex-col'>
    <img src='/src/assets/Images/CatSliderImg/Building.jpeg' className='rounded-[50%]'/>
    
    <h3 className='p-4'>Building</h3>
        </div>
          
        </SwiperSlide>
      </Swiper>
    </div>
        
        </div>
        
    )
    
    
}
export default HomeCatSlider;

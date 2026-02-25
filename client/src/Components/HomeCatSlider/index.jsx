import React, { useContext } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Navigation } from 'swiper/modules';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';


const HomeCatSlider = (props)=> {
        const context = useContext(MyContext);
    return(
    <div className='homeCatSlider pt-0 lg:pt-4 py-4 lg:py-8 pb-0 lg:pb-4'>
    <div className='container'>
  
    <Swiper 
 
        breakpoints={{
            340: {          
              slidesPerView: 4,
              spaceBetween:5
              
            },
            820: {
              slidesPerView: 8,
              spaceBetween:5
              
            },
            1280: {
                slidesPerView: 10,
                spaceBetween:5
                
              },
          }}
    
        navigation={context?.windowWidth < 992 ? false : true}    
        modules={[FreeMode,Navigation]}
        className="mySwiper"
      
      >
      {
    props?.data?.map((cat, index)=>{
    return(
   <SwiperSlide key={index}>
  <div className="item p-3 text-center flex items-center justify-center flex-col">
    <Link to={`/product?catId=${cat?._id}`}>
      <img
        src={cat?.images[0]}
        alt={cat?.name}
        className="w-[70px] h-[70px] lg:w-[100px] lg:h-[100px] rounded-full object-cover border border-gray-200 shadow-sm"
      />
      <h3 className="!mt-3 text-[14px] lg:text-[16px] font-medium">{cat?.name}</h3>
    </Link>
  </div>
</SwiperSlide>

      )
       
          })
      }
      
      </Swiper>
    </div>
        
        </div>
        
    )
    
    
}
export default HomeCatSlider;

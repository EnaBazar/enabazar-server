import React, { useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {EffectFade,Pagination,Navigation,Autoplay } from 'swiper/modules';
import Button  from '@mui/material/Button';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';




const HomeSliderV2 =(props) => {
      const context = useContext(MyContext);
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
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[EffectFade,Pagination,Navigation,Autoplay]}
       className="sliderHome" 
        >
            {
              props?.data?.lenght!==0 &&   props?.data?.map((item, index)=>{
                if(item?.isDisplayOnHomeBanner===true){
                     return(
                          <SwiperSlide key={index}>
               <Link to={`/product/${item?._id}`} className="block w-full h-full">
             <div className='item w-full  rounded-md overflow-hidden lg:h-[320px]  relative'>
           <img
                    src={item?.bannerimages[0]}
                    alt="HomeSlider"
                    className="w-full h-full object-cover"
                  /> 
             
             <div className='info absolute top-0 -right-[100%] opacity-0 w-[40%] h-[100%]
              z-50 p-8 flex items-center flex-col justify-center transition-all duration-700'>
             <h4 className='text-[15px] lg:text-[18px] font-[500] w-full 
             text-left !mb-3 relative -right-[100%] opacity-0'>{item?.bannerTitlename}</h4>
            
            
            
            <h2 className='text-[12px] lg:text-[14px] font-[700] w-full
             relative -right-[100%] opacity-0'>{item?.name?.length > 70 ? 
             item?.name?.substr(0,70)+'...' : item?.name}</h2>
            
            <h3 className='text-[15px] lg:text-[18px] font-[600] w-full
             text-left mt-3 mb-3 flex items-center gap-3 relative -right-[100%] opacity-0'>Satrting At Only 
            <span className='text-[white] text-[30px]'>{item?.discount}</span></h3>
            
            <div className='w-full relative -right-[100%] opacity-0 btn_'>
              <Link
            to=  {`/product/${item?._id}`}>
            <Button className='!bg-blue-500 !text-white btn-org h-[70%] '>SHOP NOW</Button>
     </Link>
            </div>
             </div>    
         </div>
         </Link>
             </SwiperSlide> 
            )
                }
      
              })
            }
            
    
     
   
           
           
           </Swiper>
        
        
        
        
        
          
        
    );
    
};
export default HomeSliderV2;

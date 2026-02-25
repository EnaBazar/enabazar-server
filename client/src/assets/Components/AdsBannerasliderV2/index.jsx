
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Navigation } from 'swiper/modules';
import BannerBoxV2 from '../BannarBoxV2';



  const AdsBannerSliderV2 =() =>{
      return(
          <div className='py-5 w-full '>
           <Swiper 
        breakpoints={{
            340: {          
              slidesPerView: 2,
              spaceBetween:10
              
            },
            820: {
              slidesPerView: 3,
              spaceBetween:10
              
            },
            1280: {
                slidesPerView: 4,
                spaceBetween:5
                
              },
          }}
    
        navigation={true}    
        modules={[FreeMode,Navigation]}
        className="mySwiper smlBtn "   
      >
      
    <SwiperSlide>
     <BannerBoxV2  info="left" image={'/src/assets/Images/AdsBanner/Bannar5.avif'} link={'/'}/>
    </SwiperSlide>
    
       
    <SwiperSlide>
     <BannerBoxV2  info="Right" image={'/src/assets/Images/AdsBanner/Bannar8.avif'} link={'/'}/>
     
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBoxV2  info="left" image={'/src/assets/Images/AdsBanner/Bannar7.avif'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBoxV2  info="lrighteft" image={'/src/assets/Images/AdsBanner/Bannar8.avif'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBoxV2  info="left" image={'/src/assets/Images/AdsBanner/Bannar7.avif'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBoxV2  info="left" image={'/src/assets/Images/AdsBanner/Bannar8.avif'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBoxV2  info="left" image={'/src/assets/Images/AdsBanner/Bannar7.avif'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBoxV2 info="left" image={'/src/assets/Images/AdsBanner/Bannar5.avif'} link={'/'}/>
    </SwiperSlide>
    
    
    
    
    
    
    
    
    
    
  
          </Swiper>
          </div>
      )
      
  }
  export default AdsBannerSliderV2;
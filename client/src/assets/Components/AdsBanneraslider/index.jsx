
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Navigation } from 'swiper/modules';
import BannerBox from '../BannerBox';

  const AdsBannerSlider =() =>{
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
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner3.jpeg'} link={'/'}/>
    </SwiperSlide>
    
       
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner4.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner3.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner4.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner3.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner4.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner3.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
        
    <SwiperSlide>
     <BannerBox img={'/src/assets/Images/AdsBanner/AdsBanner4.jpeg'} link={'/'}/>
    </SwiperSlide>
    
    
    
    
    
    
    
    
    
    
  
          </Swiper>
          </div>
      )
      
  }
  export default AdsBannerSlider;
import React, { useRef, useState } from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const ProductZoom =() =>{

const [slideIndex,setslideIndex] = useState(0);
const zoomSliderBig = useRef();
const zoomSliderSml = useRef();



const goto =(index) => {
  
  setslideIndex(index);
  zoomSliderBig.current.swiper.slideTo(index);
  zoomSliderSml.current.swiper.slideTo(index);
  
}
  
    return(
      <>
  <div className='flex gap-3'>
  <div className='slider w-[15%]'>
  
  <Swiper
  ref={zoomSliderSml}
        direction={'vertical'}
        slidesPerView={4}
        spaceBetween={10}
        navigation={
        true
        } 
        modules={[Navigation]}
        className="productslidezoom !h-[500px]"
      >
        <SwiperSlide>
        <div className={`item rounded-md overflow-hidden cursor-pointer 
        group ${slideIndex ===0 ? 'opacity-60' : 'opacity-100'}`} onClick={() => goto(0)}>
        <img src='/src/assets/Images/fashion 1.jpg ' className='w-full transition-all group-hover:scale-105' alt='pictue'/>
        </div> 
        </SwiperSlide>
       
        <SwiperSlide>
        <div className={`item rounded-md overflow-hidden cursor-pointer 
        group ${slideIndex ===1 ? 'opacity-60' : 'opacity-100'}`} onClick={() => goto(1)}>
        <img src='/src/assets/Images/fashion2.jpg' className='w-full transition-all group-hover:scale-105' alt='pictue'/>
        </div> 
        </SwiperSlide>
        
      
        <SwiperSlide>
        <div className={`item rounded-md overflow-hidden cursor-pointer 
        group ${slideIndex ===2 ? 'opacity-60' : 'opacity-100'}`} onClick={() => goto(2)}>
        <img src='/src/assets/Images/fashion3.jfif ' className='w-full transition-all group-hover:scale-105' alt='pictue'/>
        </div> 
        </SwiperSlide>
        
        <SwiperSlide>
        <div className={`item rounded-md overflow-hidden cursor-pointer 
        group ${slideIndex ===3 ? 'opacity-60' : 'opacity-100'}`} onClick={() => goto(3)}>
        <img src='/src/assets/Images/fashion4.jpg' className='w-full transition-all group-hover:scale-105' alt='pictue'/>
        </div> 
        </SwiperSlide>
        
  </Swiper>
  </div>
  
  
  <div className='zoomContainer w-[85%] !h-[500px] overflow-hidden'>
  <Swiper
     ref={zoomSliderBig}
        slidesPerView={1}
        spaceBetween={0}
        navigation={false} 
       >
       
    
        
        
        <SwiperSlide> 
        <InnerImageZoom 
    zoomType='hover'
    zoomScale={1}
    src="/src/assets/Images/fashion 1.jpg"  />
 
        </SwiperSlide>       
        <SwiperSlide> 
        <InnerImageZoom 
    zoomType='hover'
    zoomScale={1}
    src="/src/assets/Images/fashion2.jpg"  />
 
        </SwiperSlide>  
        <SwiperSlide> 
        <InnerImageZoom 
    zoomType='hover'
    zoomScale={1}
    src="/src/assets/Images/fashion3.jfif"  />

        </SwiperSlide>     
        <SwiperSlide> 
        <InnerImageZoom 
    zoomType='hover'
    zoomScale={1}
    src="/src/assets/Images/fashion4.jpg"  />
 
        </SwiperSlide>
 </Swiper>
  </div> 
  </div>
      </>  
        
    )
}
export default ProductZoom;
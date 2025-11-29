import React, { useRef, useState } from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const ProductZoom =(props) =>{

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
  <div className='flex gap-3 !mb-5'>

  <div className='zoomContainer w-[90%]   rounded-xl overflow-hidden'>
  <Swiper
     ref={zoomSliderBig}
        slidesPerView={1}
        spaceBetween={0}
        navigation={false} 
       >
        {
        props?.images?.map((item, index)=>{
    return(
    <SwiperSlide key={index} className='!w-full  !rounded-md shadow-md border border-[rgba(0,0,0,0.2)] !mb-3'> 
    
    <InnerImageZoom 
    zoomType='hover'
    zoomScale={1}
    src={item}/>
    
    </SwiperSlide> 
    )
    })
    }

 </Swiper>


  <div className='slider !w-[100%]'>
  
  <Swiper
  ref={zoomSliderSml}
        direction={'horizontal'}
        slidesPerView={4}
        spaceBetween={10}
        navigation={
        true
        } 
        modules={[Navigation]}
        className={`productslidezoom !w-[350px] overflow-hidden ${props?.images?.length > 5 && 'space'}`}
      >
      
      {
        props?.images?.map((item, index)=>{
          return(
        <SwiperSlide key={index}>
        <div className={`item rounded-md w-[80px] gap-3 shadow-md border border-[rgba(0,0,0,0.2)] overflow-hidden cursor-pointer 
        group ${slideIndex === index ? 'opacity-60' : 'opacity-100'}`} onClick={() => goto(index)}>
        <img src={item} alt='pictue'/>
        </div> 
        </SwiperSlide>
          )
          
        })
      }
   
        
  </Swiper>
  </div>
  </div> 
  </div>
      </>  
        
    )
}
export default ProductZoom;
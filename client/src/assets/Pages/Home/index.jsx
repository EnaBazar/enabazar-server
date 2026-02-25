import React from "react";

import HomeCatSlider from "../../components/HomeCatSlider";
import {LiaShippingFastSolid} from "react-icons/lia"
import AdsBannerSlider from "../../components/AdsBanneraslider";
import AdsBannerSliderV2 from "../../components/AdsBannerasliderV2";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductsSlider from "../../components/ProductsSlider";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Navigation } from 'swiper/modules';
import BlogItem from "../../components/BlogItem";
import HomeSliderV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/BannarBoxV2";




const Home =() => {
    
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    
    return(
        
        <>
      
       <section className="py-6">
       <div className="container flex  gap-5" >
      <div className="part1 w-[75%]">
      <HomeSliderV2/>
      </div>
      
      
    <div className="part2 w-[25%]  flex items-center  justify-between flex-col ">
     <BannerBoxV2 info="left" image={'/src/assets/Images/AdsBanner/Bannar5.avif'}/>
     <BannerBoxV2 info="right" image={'/src/assets/Images/AdsBanner/Bannar8.avif'}/>
      </div>
      
       </div>
       </section>
       
       
        <HomeCatSlider/>   
            
        <section className="bg-white py-8">
        <div className="container">
        <div className="flex items-center justify-between">
        <div className="lefysec">
        <h2 className="text-[20px] font-[600]">Popular Products</h2>
        <p className="text-[14px] font-[400]">Do Not miss this current offers until the end of March..</p>
        
        </div>
        
        <div className="rightsec w-[60%] ">
        <Tabs 
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
       
      >
        <Tab  label="Food &Vabarge" />
        <Tab label="Electronics" />
        <Tab label="Fashion" />
        <Tab label="Bag Collection" />
        <Tab label="Jewllary" />
        <Tab label="Home Accosories" />
        <Tab label="baby Collection" />
      </Tabs>
        
        </div>
        </div>
        
        <ProductsSlider/>
        
    
        </div>    
        </section>
        
  
        <section className="py-16 bg-white">
        <div className="container">
        <div className="freeShipping w-full m-auto py-4 p-4 border-2 border-[#ff5252] flex items-center  justify-between rounded-md mb-7">
        <div className="col1 flex items-center gap-4">
        <LiaShippingFastSolid className="text-[50px]"/>
        <span className="text-[15px] font-[600] uppercase" > Free Shipping</span>
        </div> 
        
        <div className="col2">
        <p className="mb-0 font-[500]">Free Delivery Now On Your First Order and Over $200</p>     
        </div>
        
         <p className="font-bold text-[30px]"> -Only $200*</p>
         
        </div>
       
       <div className="bg-none py-8 pl-4 pr-4">
    <AdsBannerSliderV2/>
    </div>
        </div>    
        </section>   
        
        
        
        <section className="py-5 pt-0 bg-white">
        <div className="container">
        <h2 className="text-[20px] font-[600]">Latest Products</h2>
        <p className="text-[14px] font-[400]">Do Not miss this current offers until the end of March..</p>
        <ProductsSlider/>
        <AdsBannerSlider/>
        </div>
        </section>
        
         
         
        <section className="py-5 pt-0 bg-white">
        <div className="container">
        <h2 className="text-[20px] font-[600]">Featured Products</h2>
        <p className="text-[14px] font-[400]">Do Not miss this current offers until the end of March..</p>
        <ProductsSlider/>

        </div>
        </section>
        
        
        <section className="py-5 pt-0 bg-white blogSection">
        <div className="container">
        <h2 className="text-[20px] font-[600]  !mb-4">From The Blog</h2>
        <Swiper 
        breakpoints={{
            340: {          
              slidesPerView: 1,
              spaceBetween:10
              
            },
            820: {

              slidesPerView: 3,
              spaceBetween:10
              
            },
            1280: {
                slidesPerView: 4,
                spaceBetween:10
                
              },
          }}
    
        navigation={true}    
        modules={[FreeMode,Navigation]}
        className="BlogSlider"     
      >
      
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    <SwiperSlide>
    <BlogItem/> 
    </SwiperSlide>
    
    </Swiper>
        
        </div>
        </section>
        
       
        </>
    )
}
export default Home;
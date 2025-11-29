import React, { useEffect, useRef, useState} from 'react'
import  { useNavigate, useParams } from 'react-router-dom';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import {fetchDataFromApi } from '../../utils/api';
import {MdBrandingWatermark} from 'react-icons/md';
import {BiSolidCategoryAlt} from 'react-icons/bi';
import {MdFilterVintage} from 'react-icons/md';
import {MdRateReview} from 'react-icons/md';
import {BsPatchCheckFill} from 'react-icons/bs';
import Rating from '@mui/material/Rating';
import { Button, CircularProgress } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';



const ProductDetails =() => {
    
    const [product, setProduct] = useState();
const [slideIndex,setslideIndex] = useState(0);
const zoomSliderBig = useRef();
const zoomSliderSml = useRef();
const history = useNavigate();
const {id} = useParams();
const [loading, setLoading] = useState(false);
const goto =(index) => {
  
  setslideIndex(index);
  zoomSliderBig.current.swiper.slideTo(index);
  zoomSliderSml.current.swiper.slideTo(index);
  
}
    
    
      useEffect(() => {
    setLoading(true);
    fetchDataFromApi(`/product/${id}`)
      .then((res) => {
        if (res?.error === false) {
          setProduct(res.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-red-500">
        No Product Found
      </div>
    );
  }

    
    
     return(
     <>
       <div className='flex items-center  justify-between  py-0 mt-3'>
       <h2 className='text-[20px] font[600]'>Products Deatils  <span className='text-[12px] font-[600]'></span></h2>
       </div>
     <br/>
     
     
     <div className='productDetails flex gap-10'> 
     <div className='w-[40%]'>
     
     {
       product?.images?.length!==0 &&
       
  <div className='flex gap-3'>
      
  <div className='zoomContainer w-[85%] !h-[500px]  rounded-md overflow-hidden'>
  <Swiper
     ref={zoomSliderBig}
        slidesPerView={1}
        spaceBetween={0}
        navigation={false} 
       >
        {
        
         product?.images?.map((item,index)=>{
           
        return(
    
        
        
        <SwiperSlide key={index}> 
        <InnerImageZoom 
    zoomType='hover'
    zoomScale={1}
    src={
      
      item
    }  />
 
        </SwiperSlide>      
        
            )
           
         })
        
        
      }
 </Swiper>
  </div> 

  <div className='slider w-[15%]'>
  <br/>
  <Swiper
  ref={zoomSliderSml}
        direction={'vertical'}
        slidesPerView={4}
        spaceBetween={10}
        navigation={
        true
        } 
        modules={[Navigation]}
        className="productslidezoom !h-[400px]"
      >
      
      {
        
         product?.images?.map((item,index)=>{
           
        return(
              <SwiperSlide key={index}>
        <div className={`item rounded-md overflow-hidden cursor-pointer 
        group ${slideIndex === index? 'opacity-60' : 'opacity-100'}`} onClick={() => goto(index)}>
        <img src={item} className='w-full transition-all group-hover:scale-105' alt='pictue'/>
        </div> 
        </SwiperSlide>
        )
           
         })
        
        
      }
       
       
        
  </Swiper>
  </div>


  
  </div>
     }
   
     </div>
     
     
       
     <div className='w-[60%]'>
     <br/>
     <h1 className='text-[25px] font-[500] mb-5'>{product?.name}</h1>
     
     
     
     <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <MdBrandingWatermark className='opacity-55'/>Brand :</span>
     <span className='text-[12px]'>{product?.brand}</span>
     </div>
     
         <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <BiSolidCategoryAlt className='opacity-55'/>Category :</span>
     <span className='text-[12px]'>{product?.catName}</span>
     </div>
         <div className='flex items-center py-2 gap-2'>
         <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <BiSolidCategoryAlt className='opacity-55'/>Price :</span>
                       
                    <span className='text-blue-700 text-[15px] font-[600] inline-block p-1 shadow-sm bg-gray-300 rounded-md'>&#2547; {product?.price}</span>
                     <span className='line-through text-[15px]  font-[600] inline-block p-1 shadow-sm bg-red-300 rounded-md'>&#2547; {product?.oldPrice}</span>
     </div>
   
     
  {
    product?.productRam?.length !== 0 && 
      <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <MdFilterVintage className='opacity-55'/>Ram :</span>
     <div className='flex items-center gap-2'>
     {
       product?.productRam?.map((ram, index) =>{
         
         return(
             <span className='text-[12px] inline-block p-1 shadow-sm bg-gray-300 rounded-md' key={index}>{ram}</span>
         )
       })
     }
     </div>
   
     </div>
  }
   
     
       {
    product?.size?.length !== 0 && 
      <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <MdFilterVintage className='opacity-55'/>Size :</span>
     <div className='flex items-center gap-2'>
     {
       product?.size?.map((size, index) =>{
         
         return(
             <span className='text-[12px] inline-block p-1 shadow-sm bg-gray-300 rounded-md' key={index}>{size}</span>
         )
       })
     }
     </div>
   
     </div>
  }
     
     
       {
    product?.productWeight?.length !== 0 && 
      <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <MdFilterVintage className='opacity-55'/>Weight :</span>
     <div className='flex items-center gap-2'>
     {
       product?.productWeight?.map((weight, index) =>{
         
         return(
             <span className='text-[12px] inline-block p-1 shadow-sm bg-gray-300 rounded-md' key={index}>{weight}</span>
         )
       })
     }
     </div>
   
     </div>
  }
      
      
             <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <MdRateReview className='opacity-55'/>Reviews :</span>
     <span className='text-[12px]'>({product?.reviws?.length>0 ? product?.reviws?.length : 0}) Reviews</span>
     </div> 
     
     
     
             <div className='flex items-center py-2'>
     <span className='w-[30%] font-[500] flex items-center gap-2 text-[14px]'> 
     <BsPatchCheckFill className='opacity-55'/>Publish :</span>
     <span className='text-[12px]'>{product?.createdAt?.split("T")[0]}</span>
     </div> 
     <br/>

     
        <br/>
     <h2 className='text-[20px] font-[500] mb-3'>Product Discription</h2>
   
   {
     product?.description && <p className=' text-[14px]'>{ product?.description}</p>
   }
     </div>
     

     </div>
     


     <br/>
     <br/>
     
          <br/>
   <div className='w-[80%] flex items-center justify-end'>
  <Button 
  type='button' 
  className='btn-blue btn-sm' 
  onClick={() => history('/Products')}
>
  Back
</Button>
</div>

     <h2 className='text-[18px] font-[500]'>Customer Reviews</h2>
     
     <div className='reviewsWrap mt-3'>
     <div className='reviews w-full h-auto p-4 rounded-md mb-3 bg-white shadow-sm flex 
     items-center justify-between border  border-[#bebaba]'>
     
     <div className='flex items-center gap-8'
     >
     <div className='img w-[75px] h-[75px] rounded-full overflow-hidden border-2 border-[#a09f9f] '>
     
     <img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='w-full h-full object-cover'/>
     </div>
     
     
     
     <div className='info w-[80%]'>
     <div className='flex items-center justify-between'>
      <h4 className='text-[15px] font-[500]'>Ibrahim Khalil</h4>
     <Rating name='half-rating' defaultValue={1} precision={0.5} size='small'/>
     
     </div>
    
     <span className='text-[12px] font-[500]'>2025-01-08</span>
     <p className='text-[12px] mt-2'>প্রাকৃতিক চিনির উৎস হওয়ায় এটি শিশু থেকে বৃদ্ধ—সবার জন্য নিরাপদ ও উপকারী। স্বাদটা কেমন? বাজারের খেজুরের মতো চিপচিপে বা শুকনা না তো?</p>
     </div>
     </div>
     
     </div>
     
     
     
       <div className='reviews w-full h-auto p-4 rounded-md mb-3 bg-white shadow-sm flex 
     items-center justify-between border  border-[#bebaba]'>
     
     <div className='flex items-center gap-8'
     >
     <div className='img w-[75px] h-[75px] rounded-full overflow-hidden border-2 border-[#a09f9f] '>
     
     <img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='w-full h-full object-cover'/>
     </div>
     
     
     
     <div className='info w-[80%]'>
     <div className='flex items-center justify-between'>
      <h4 className='text-[15px] font-[500]'>Ibrahim Khalil</h4>
     <Rating name='half-rating' defaultValue={1} precision={0.5} size='small'/>
     
     </div>
    
     <span className='text-[12px] font-[500]'>2025-01-08</span>
     <p className='text-[12px] mt-2'>প্রাকৃতিক চিনির উৎস হওয়ায় এটি শিশু থেকে বৃদ্ধ—সবার জন্য নিরাপদ ও উপকারী। স্বাদটা কেমন? বাজারের খেজুরের মতো চিপচিপে বা শুকনা না তো?</p>
     </div>
     </div>
     
     </div>
     </div>

   
  
     
     
     </>
     ) 
      
   
}
export default ProductDetails;
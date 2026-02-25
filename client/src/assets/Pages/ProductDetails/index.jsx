import React, { useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductZoom from '../../Components/ProductZoom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import ProductsSlider from '../../components/ProductsSlider';
import ProductDetailsComponant from '../../Components/ProductDetailsComponant';


const ProductDetails =() => {
    
      
      
      const [activeTab,setActiveTab] = useState(0);
      
    return (
   
        <>
         <div className='py-5'>
        <div className='container '>
        <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" className='link transition !text-[14px]'>
         Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/"
          className='link transition !text-[14px]'
        >
          Fashion
        </Link>
        
        
        <Link
          underline="hover"
          color="inherit"
        
          className='link transition !text-[14px]'
        >
          Best shirts
        </Link>
        </Breadcrumbs>
        </div>
        
        </div>
        
        
        
        <section className='bg-white py-5'>
        <div className='container flex gap-8 items-center'>
         <div className='productZoomContainer w-[40%] '>
         <ProductZoom/>
         </div>
      
         <div className='productContent w-[60%] pr-10 '>
          <ProductDetailsComponant/>
         </div>
         </div>
         
         
         <div className='container pt-10'>
         <div className='flex items-center gap-8 mb-5'>
         <span 
         className={`link text-[17px] cursor-pointer font-[500] ${activeTab===0 && 'text-[#ff5252]'}`}
          onClick={() =>setActiveTab(0)}
          >
          Discription
          </span>
          
         <span 
          className={`link text-[17px] cursor-pointer font-[500] ${activeTab===1 && 'text-[#ff5252]'}`}
          onClick={() =>setActiveTab(1)}
          >
          Product Details
          </span>
          
         <span
           className={`link text-[17px] cursor-pointer font-[500] ${activeTab===2 && 'text-[#ff5252]'}`}
           onClick={() =>setActiveTab(2)}
           >
           Reviews (5)
           </span>
           
         </div>
         
         {
           
           activeTab===0 && (
           
           <div className='shadow-md py-5 px-8 w-full p-8 rounded-md border-1  border-[rgba(0,0,0,0.2)]'>
         
         <p>Lorem Ipsum is simply dummy text of the 
    printing and typesetting
     industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took  has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took when an unknown printer took  has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took ...</p>
     
     <h4 className='pt-4 pb-2'>Lightweight Design:</h4>
     
     <p>Lorem Ipsum is simply dummy text of the 
    printing and typesetting
     industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took  has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took when an unknown printer took  has been the industry's standard dummy text ever since the 1500s, 
     when an unknown printer took ...</p>
     
     <h4 className='pt-4 pb-2'>Free Shipping & Return:</h4>
     <p> industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s,</p>
     
     <h4 className='pt-4 pb-2'>money Back Guaranty:</h4>
     <p> industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s,</p>
     
     <h4 className='pt-4 pb-2'>Online support:</h4>
     <p> industry. Lorem Ipsum 
     has been the industry's standard dummy text ever since the 1500s,</p>
     
     
     
         </div>
         
           
        ) }
         
           {
             
             activeTab === 1 && (
               <div className='shadow-md py-5 px-8 w-full p-8 rounded-md border-1  border-[rgba(0,0,0,0.2)]'>
              <div class="relative overflow-x-auto">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-[#fff]">
                      <tr>
                          <th scope="col" class="px-6 py-3">
                           Stand Up
                          </th>
                          <th scope="col" class="px-6 py-3">
                             Folded(W/Wheels)
                          </th>
                          <th scope="col" class="px-6 py-3">
                             Door Pass Through
                          </th>
                          <th scope="col" class="px-6 py-3">
                          Door Pass Through
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                         
                      <td class="px-6 py-4">
                              35"L*24"W*37-45"H(font to Back whell)
                          </td>
                          <td class="px-6 py-4">
                          35"L*24"W*37-45"H(font to Back whell)
                          </td>
                          <td class="px-6 py-4">
                          35"L*24"W*37-45"H(font to Back whell)
                          </td>
                          <td class="px-6 py-4">
                              24
                          </td>
                      </tr>
                      
                      <tr class="bg-white border-b border-[rgba(0,0,0,0.2)]">
                         
                         <td class="px-6 py-4">
                                 35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                                 24
                             </td>
                         </tr>
                         
                         <tr class="bg-white border-b border-[rgba(0,0,0,0.2)]">
                         
                         <td class="px-6 py-4">
                                 35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                                 24
                             </td>
                         </tr>
                         
                         <tr class="bg-white border-b border-[rgba(0,0,0,0.2)]">
                         
                         <td class="px-6 py-4">
                                 35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                                 24
                             </td>
                         </tr>
                         
                         <tr class="bg-white border-b border-[rgba(0,0,0,0.2)]">
                         
                         <td class="px-6 py-4">
                                 35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                                 24
                             </td>
                         </tr>
                         
                         <tr class="bg-white border-b border-[rgba(0,0,0,0.2)]">
                         
                         <td class="px-6 py-4">
                                 35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                                 24
                             </td>
                         </tr>
                         
                         <tr class="bg-white border-b border-[rgba(0,0,0,0.2)]">
                         
                         <td class="px-6 py-4">
                                 35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                             35"L*24"W*37-45"H(font to Back whell)
                             </td>
                             <td class="px-6 py-4">
                                 24
                             </td>
                         </tr>
                  
                               </tbody>
              </table>
          </div>
          </div>
               
               
             )
           }
{
  activeTab === 2 && (
   <div className='shadow-md py-5 px-8 w-[80%] p-8 rounded-md border-1  border-[rgba(0,0,0,0.2)]'>
    <div className='w-full productReviewContainer'>
    
    
    <h2 className='text-[14px]'>Customer questions & answers</h2>
    
    
    <div className='scroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden !mt-5'> 
    
    <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    
    <img src='/src/assets/Images/seller.png' className='w-full'/>
    
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>Ibrahim Khlil</h4>
    <h5 className='text-[13px] !mb-0' >2025/05/05</h5>
    <p className='!mt-0 !mb-0'>Lorem Ipsum is simply dummy 
    text of the printing and typesetting industry. Lorem Ipsum
     has been the industry's standard dummy text ever since the 150</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={4}  readOnly/>
    </div>
    
    
    <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    
    <img src='/src/assets/Images/seller.png' className='w-full'/>
    
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>Ibrahim Khlil</h4>
    <h5 className='text-[13px] !mb-0' >2025/05/05</h5>
    <p className='!mt-0 !mb-0'>Lorem Ipsum is simply dummy 
    text of the printing and typesetting industry. Lorem Ipsum
     has been the industry's standard dummy text ever since the 150</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={4}  readOnly/>
    </div>
    
    
    <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    
    <img src='/src/assets/Images/seller.png' className='w-full'/>
    
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>Ibrahim Khlil</h4>
    <h5 className='text-[13px] !mb-0' >2025/05/05</h5>
    <p className='!mt-0 !mb-0'>Lorem Ipsum is simply dummy 
    text of the printing and typesetting industry. Lorem Ipsum
     has been the industry's standard dummy text ever since the 150</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={4}  readOnly/>
    </div>
    
    
    
    <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    
    <img src='/src/assets/Images/seller.png' className='w-full'/>
    
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>Ibrahim Khlil</h4>
    <h5 className='text-[13px] !mb-0' >2025/05/05</h5>
    <p className='!mt-0 !mb-0'>Lorem Ipsum is simply dummy 
    text of the printing and typesetting industry. Lorem Ipsum
     has been the industry's standard dummy text ever since the 150</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={4}  readOnly/>
    </div>
    
    
    <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    
    <img src='/src/assets/Images/seller.png' className='w-full'/>
    
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>Ibrahim Khlil</h4>
    <h5 className='text-[13px] !mb-0' >2025/05/05</h5>
    <p className='!mt-0 !mb-0'>Lorem Ipsum is simply dummy 
    text of the printing and typesetting industry. Lorem Ipsum
     has been the industry's standard dummy text ever since the 150</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={4}  readOnly/>
    </div>
    
    
    <div className='review w-full pt-5 pb-5 border-b border-[rgba(0,0,0,0.2)] flex items-center justify-between'>
    <div className='info w-[60%] flex items-center gap-3'>
    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
    
    <img src='/src/assets/Images/seller.png' className='w-full'/>
    
    </div>
    <div className='w-[80%]'>
    <h4 className='text-[16px]'>Ibrahim Khlil</h4>
    <h5 className='text-[13px] !mb-0' >2025/05/05</h5>
    <p className='!mt-0 !mb-0'>Lorem Ipsum is simply dummy 
    text of the printing and typesetting industry. Lorem Ipsum
     has been the industry's standard dummy text ever since the 150</p>
    </div> 
    </div>
    <Rating name="size-small" defaultValue={4}  readOnly/>
    </div>
    
   
    
    
    </div>
    
    
    <br/>
    
    <div className='reviewForm bg-[#f1f1f1] p-4 rounded-md'>
    <h2 className='text-[18px] pb-3'>Add a review</h2>
    <form className='w-full'>
    <TextField
          id="outlined-multiline-flexible"
          label="Write a Review"
          className='w-full !mb-5'
          multiline
          rows={5}
        />
          <Rating name="size-small" defaultValue={4}/>
          
          <div className='flex items-center !mt-5'>
          <Button className='btn-org'>Submit Reviw</Button>
          
          </div>
    </form>
    </div>
    </div>
    </div>
    
  )
}
         </div>
         
         
         <div className='container !pt-6'>
         <h2 className='text-[20px] font-[600]'>Related Products</h2>
         <p className="text-[14px] font-[400]">Do Not miss this current offers until the end of March..</p>
         <ProductsSlider/>
         </div>
        </section>
        </>
    )
}
export default ProductDetails;
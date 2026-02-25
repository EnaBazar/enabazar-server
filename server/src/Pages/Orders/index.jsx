import React, { useState } from 'react'
import AccountSidebar from '../../Components/AccountSidebar'
import Button from '@mui/material/Button'
import { FaAngleDown } from 'react-icons/fa6'
import Badge from '../../Components/Badge'
import { FaAngleUp } from 'react-icons/fa6'






 const Orders = () => {
   
   const [isOpenOrderProduct,setIsOpenOrderProduct] = useState(null);
   
   const isShowOrderProduct=(index)=>{
   if(isOpenOrderProduct===index){
     
    setIsOpenOrderProduct(null);
   }else{
    setIsOpenOrderProduct(index);
     
   }
    
     
   }
  return (
      
    <section className='py-10 w-full'>
    <div className='container flex gap-3'>
    <div className='col1 w-[20%]'>
    <AccountSidebar/>
    </div>
    
    
    <div className='col2 w-[80%]'>
    <div className='shadow-md rounded-md p-5 bg-white'>
   
   <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.2)]'>
   <h2>My Order</h2>
   <p>There are <span className='font-bold text-[#ff5252]'>2</span> products your List</p>
   
   <div class="relative overflow-x-auto !mt-5">
              <table class="w-full text-sm text-left rtl:text-right ">
                  <thead class=" uppercase bg-[rgba(0,0,0,0.1)] border-b-[2px] border-b-[gray]  ">
                      <tr>
                      <th scope="col" class="px-6 py-3">
                           &nbsp;
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                           Order Id
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                           Payment Id
                          </th>
                        
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Name
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Phone Number
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Address
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Pincode
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Total Amount
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                       Email
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                         User Id
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                         Order status
                          </th>
                          <th scope="col" className="px-6 py-3 whitespace-nowrap">
                         Date
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                 
                      <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                         
                      <td className="px-6 py-4 wh">
                      <Button className='!w-[30px] 
                           !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]' onClick={()=>isShowOrderProduct(0)}>
                           
                           {
                             
                             isOpenOrderProduct === 0 ?  <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.6)]'/> 
                             : <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.6)]'/>
                           }
                           
                           
                          
                           
                           
                           </Button>
                          </td>
                          
                          <td className="px-6 py-4">
                           <span className='text-[#ff5252]'>7567hf756756hfh</span>
                          </td>
                         
                          <td className="px-6 py-4">
                          <span className='text-[#ff5252]'>py7567hf756756hfh</span>
                          </td>
                         
                          <td className="px-6 py-4 w whitespace-nowrap">
                           Ibrahim Khalil
                          </td>
                         
                          <td className="px-6 py-4">
                     01674847446
                          </td>
                         
                          <td className="px-6 py-4">
                              <span className='block w-[300px]'>Ibrahim khalil H.No 222 Street No. 
                              32 Islampur Road ,Feni 3900</span>
                          </td>
                       
                         
                          <td className="px-6 py-4">
                            110053
                          </td>
                         
                          <td className="px-6 py-4">
                        3800
                          </td>
                         
                          <td className="px-6 py-4">
                          ikhalil7446@gmail.com
                          </td>
                         
                          <td className="px-6 py-4">
                          <span className='text-[#ff5252]'>uid7567hf756756hfh</span>
                          </td>
                         
                        
                          <td className="px-6 py-4"><Badge status="pending"/>
                         
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        23/05/25
                          </td>
                      
                      </tr>
                     
                     {
                       
                       isOpenOrderProduct===0 && (
                       
                       <tr>
                       <td className='pl-18'  colSpan="6">
                       <div class="relative overflow-x-auto">
               <table class="w-full text-sm text-left rtl:text-right ">
               <thead class=" capitalize bg-[rgba(0,0,0,0.1)] border-b-[2px] border-b-[gray]  ">
                       <tr>
                      
                           <th scope="col" className="px-6 py-3 whitespace-nowrap">
                     ProductId
                           </th>
                           <th scope="col" className="px-6 py-3 whitespace-nowrap">
                       Product 
                           </th>
                         
                           <th scope="col" className="px-6 py-3 whitespace-nowrap">
                       image
                           </th>
                           <th scope="col" className="px-6 py-3 whitespace-nowrap">
                      Quantity
                           </th>
                           <th scope="col" className="px-6 py-3 whitespace-nowrap">
                       Price
                           </th>
                           <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Sub Total
                           </th>
                     
                       </tr>
                   </thead>
                   <tbody>
                       <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                          
                  
                          
                           <td className="px-6 py-4">
                           <span className='text-[#ff5252]'>py7567hf756756hfh</span>
                           </td>
                          
                           <td className="px-6 py-4 w whitespace-nowrap">
                           SleeperToyes
                           </td>
                          
                           <td className="px-6 py-4">
                  <img src='/src/assets/Images/fashion2.jpg' className='w-[50px] h-[50px] object-cover rounded-md'/>
                           </td>
                          
                            
                           <td className="px-6 py-4">
                   3
                           </td>
                          
                           <td className="px-6 py-4">
                           1280
                           </td>
                          
                                       
                           <td className="px-6 py-4 whitespace-nowrap">
                       13455
                           </td>
                                       
               </tr>   
               
               <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                          
                  
                          
                          <td className="px-6 py-4">
                          <span className='text-[#ff5252]'>py7567hf756756hfh</span>
                          </td>
                         
                          <td className="px-6 py-4 w whitespace-nowrap">
                          SleeperToyes
                          </td>
                         
                          <td className="px-6 py-4">
                 <img src='/src/assets/Images/fashion2.jpg' className='w-[50px] h-[50px] object-cover rounded-md'/>
                          </td>
                         
                           
                          <td className="px-6 py-4">
                  3
                          </td>
                         
                          <td className="px-6 py-4">
                          1280
                          </td>
                         
                                      
                          <td className="px-6 py-4 whitespace-nowrap">
                      13455
                          </td>
                                      
              </tr>           
               </tbody>
               </table>
               </div>
                </td>
                </tr>
                    ) }
                     
                     
                     
                     
                     <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                         
                         <td className="px-6 py-4 wh">
                         <Button className='!w-[30px] 
                              !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]' onClick={()=>isShowOrderProduct(1)}>
                              
                              {
                                
                                isOpenOrderProduct === 1 ?  <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.6)]'/> 
                                : <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.6)]'/>
                              }
                              
                              
                             
                              
                              
                              </Button>
                             </td>
                             
                             <td className="px-6 py-4">
                              <span className='text-[#ff5252]'>7567hf756756hfh</span>
                             </td>
                            
                             <td className="px-6 py-4">
                             <span className='text-[#ff5252]'>py7567hf756756hfh</span>
                             </td>
                            
                             <td className="px-6 py-4 w whitespace-nowrap">
                              Ibrahim Khalil
                             </td>
                            
                             <td className="px-6 py-4">
                        01674847446
                             </td>
                            
                             <td className="px-6 py-4">
                                 <span className='block w-[300px]'>Ibrahim khalil H.No 222 Street No. 
                                 32 Islampur Road ,Feni 3900</span>
                             </td>
                          
                            
                             <td className="px-6 py-4">
                               110053
                             </td>
                            
                             <td className="px-6 py-4">
                           3800
                             </td>
                            
                             <td className="px-6 py-4">
                             ikhalil7446@gmail.com
                             </td>
                            
                             <td className="px-6 py-4">
                             <span className='text-[#ff5252]'>uid7567hf756756hfh</span>
                             </td>
                            
                           
                             <td className="px-6 py-4"><Badge status="pending"/>
                            
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                           23/05/25
                             </td>
                         
                         </tr>
                        
                        {
                          
                          isOpenOrderProduct===1 && (
                          
                          <tr>
                          <td className='pl-18'  colSpan="6">
                          <div class="relative overflow-x-auto">
                  <table class="w-full text-sm text-left rtl:text-right ">
                  <thead class=" capitalize bg-[rgba(0,0,0,0.1)] border-b-[2px] border-b-[gray]  ">
                          <tr>
                         
                              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        ProductId
                              </th>
                              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Product 
                              </th>
                            
                              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          image
                              </th>
                              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                         Quantity
                              </th>
                              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Price
                              </th>
                              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                       Sub Total
                              </th>
                        
                          </tr>
                      </thead>
                      <tbody>
                          <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                             
                     
                             
                              <td className="px-6 py-4">
                              <span className='text-[#ff5252]'>py7567hf756756hfh</span>
                              </td>
                             
                              <td className="px-6 py-4 w whitespace-nowrap">
                              SleeperToyes
                              </td>
                             
                              <td className="px-6 py-4">
                     <img src='/src/assets/Images/fashion2.jpg' className='w-[50px] h-[50px] object-cover rounded-md'/>
                              </td>
                             
                               
                              <td className="px-6 py-4">
                      3
                              </td>
                             
                              <td className="px-6 py-4">
                              1280
                              </td>
                             
                                          
                              <td className="px-6 py-4 whitespace-nowrap">
                          13455
                              </td>
                                          
                  </tr>   
                  
                  <tr class="bg-white border-b  border-[rgba(0,0,0,0.2)]">
                             
                     
                             
                             <td className="px-6 py-4">
                             <span className='text-[#ff5252]'>py7567hf756756hfh</span>
                             </td>
                            
                             <td className="px-6 py-4 w whitespace-nowrap">
                             SleeperToyes
                             </td>
                            
                             <td className="px-6 py-4">
                    <img src='/src/assets/Images/fashion2.jpg' className='w-[50px] h-[50px] object-cover rounded-md'/>
                             </td>
                            
                              
                             <td className="px-6 py-4">
                     3
                             </td>
                            
                             <td className="px-6 py-4">
                             1280
                             </td>
                            
                                         
                             <td className="px-6 py-4 whitespace-nowrap">
                         13455
                             </td>
                                         
                 </tr>           
                  </tbody>
                  </table>
                  </div>
                   </td>
                   </tr>
                       ) }
               
              </tbody>
              </table>
          </div>
   </div>
   </div>
    </div>
    </div>
    </section>
        
    
    
    
  )
}
export default Orders;

import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import {BsFillBagCheckFill} from 'react-icons/bs';




const CheckOut = () => {
  return (
      
    <section className='py-10'>
    <div className='container flex gap-5'>
    <div className='leftCol w-[70%]'>
    <div className='card bg-white shadow-md p-5 rounded-md w-full'>
    <h1>Billing Deatils</h1>
    <form className='w-full !mt-5'>
    <div className='flex items-center gap-5 pb-5'>
    
    <div className='col w-[50%]'>
    
    <TextField
     id="outlined-basic"
      label="Full Name"
       className='w-full'
        variant='outlined'
         size="small"
         />
         
    </div>
    
    <div className='col w-[50%]'>
    
    <TextField
    type='email'
      label="Email"
       className='w-full'
        variant='outlined'
         size="small"
         />
         
    </div>
    
    </div>
    
    <h6 className='text-[14px] font-[600] mb-3'>Street adress*</h6>
    <div className='flex items-center gap-5 pb-5'>
    <div className='col w-[100%]'>
    
    <TextField
    
      label="House No. Street Name"
       className='w-full'
        variant='outlined'
         size="small"
         />
       
    </div>
    
    </div>
    
    <div className='flex items-center gap-5 pb-5'>
    <div className='col w-[100%]'>
    
    <TextField
    
      label="Apartment, ute ,Unit ,etc (optional)"
       className='w-full'
        variant='outlined'
         size="small"
         />
       
    </div>
    
    </div>
    
    
    <div className='flex items-center gap-5 pb-5'>
    
    <div className='col w-[50%]'>
    
    <TextField
     id="outlined-basic"
      label="Town/City*"
       className='w-full'
        variant='outlined'
         size="small"
         />
         
    </div>
    
    <div className='col w-[50%]'>
    
    <TextField
    type='email'
      label="State/Country*"
       className='w-full'
        variant='outlined'
         size="small"
         />
         
    </div>
    
    </div>
    
    <h6 className='text-[14px] font-[600] mb-3'>Postcode/Zip*</h6>
    <div className='flex items-center gap-5 pb-5'>
    <div className='col w-[100%]'>
    
    <TextField
    
      label="ZIP Code"
       className='w-full'
        variant='outlined'
         size="small"
         />
       
    </div>
    
    </div>
    
    <div className='flex items-center gap-5 pb-5'>
    
    <div className='col w-[50%]'>
    
    <TextField
     id="outlined-basic"
      label="Phone Number"
       className='w-full'
        variant='outlined'
         size="small"
         />
         
    </div>
    
    <div className='col w-[50%]'>
    
    <TextField
    type='email'
      label="Email"
       className='w-full'
        variant='outlined'
         size="small"
         />
         
    </div>
    
    </div>
    
    </form>
    </div>
    </div>
    
    <div className='rightCol w-[30%]'>
    <div className='card shadow-md bg-white p-5 rounded-md'>
    <h2 className='!mb-3'>Your Order</h2>
    <div className='flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.2)] '>
    <span className='text-[14px] font-[600]'>Product</span>
    <span className='text-[14px] font-[600]'>Subtotal</span>
    </div>
    
    <div className='scroll max-h-[250px] overflow-y-scroll overflow-x-hidden pr-2 '>
    <div className='flex items-center justify-between py-2'>
    <div className='part1 flex items-center gap-3'>
    <div className='img w-[60px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
    <img src='/src/assets/Images/fashion 1.jpg' className='w-full transsition-all group-hover:scale-105'/>
    </div>
    
    <div className='info'>
    <h4 className='text-[14px]'>A-Line Kurti With Sha...</h4>
    <span className='text-[12px]'>Qty : 1</span>
    
    
    </div>
    </div>
    <span className='text-[12px] font-[600]'>$ 1003.00</span>
    </div>
    
    <div className='flex items-center justify-between py-2'>
    <div className='part1 flex items-center gap-3'>
    <div className='img w-[60px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
    <img src='/src/assets/Images/fashion 1.jpg' className='w-full transsition-all group-hover:scale-105'/>
    </div>
    
    <div className='info'>
    <h4 className='text-[14px]'>A-Line Kurti With Sha...</h4>
    <span className='text-[12px]'>Qty : 1</span>
    
    
    </div>
    </div>
    <span className='text-[12px] font-[600]'>$ 1003.00</span>
    </div>
    
 
    <div className='flex items-center justify-between py-2'>
    <div className='part1 flex items-center gap-3'>
    <div className='img w-[60px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
    <img src='/src/assets/Images/fashion 1.jpg' className='w-full transsition-all group-hover:scale-105'/>
    </div>
    
    <div className='info'>
    <h4 className='text-[14px]'>A-Line Kurti With Sha...</h4>
    <span className='text-[12px]'>Qty : 1</span>
    
    
    </div>
    </div>
    <span className='text-[12px] font-[600]'>$ 1003.00</span>
    </div>
    
    <div className='flex items-center justify-between py-2'>
    <div className='part1 flex items-center gap-3'>
    <div className='img w-[60px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
    <img src='/src/assets/Images/fashion 1.jpg' className='w-full transsition-all group-hover:scale-105'/>
    </div>
    
    <div className='info'>
    <h4 className='text-[14px]'>A-Line Kurti With Sha...</h4>
    <span className='text-[12px]'>Qty : 1</span>
    
    
    </div>
    </div>
    <span className='text-[12px] font-[600]'>$ 1003.00</span>
    </div>
    
    <div className='flex items-center justify-between py-2'>
    <div className='part1 flex items-center gap-3'>
    <div className='img w-[60px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
    <img src='/src/assets/Images/fashion 1.jpg' className='w-full transsition-all group-hover:scale-105'/>
    </div>
    
    <div className='info'>
    <h4 className='text-[14px]'>A-Line Kurti With Sha...</h4>
    <span className='text-[12px]'>Qty : 1</span>
    
    
    </div>
    </div>
    <span className='text-[12px] font-[600]'>$ 1003.00</span>
    </div>
    </div>
    
    
    <Button className='btn-org btn-lg  w-full !mt-5 gap-3 flex items-center'><BsFillBagCheckFill className='text-[20px] '/>Check Out</Button>
    
    </div>
    </div>
    </div>
    </section>
  )
}
export default CheckOut;

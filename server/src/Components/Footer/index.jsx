import React, { useContext } from 'react'
import { LiaShippingFastSolid } from 'react-icons/lia';
import { TbTruckReturn } from "react-icons/tb";
import { RiCustomerService2Line } from "react-icons/ri";
import { LiaGiftSolid } from "react-icons/lia";
import { BsWallet2 } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from "react-icons/io5";
import  Button  from '@mui/material/Button';
import  FromControlLabel  from '@mui/material/FormControlLabel';
import  Checkbox  from '@mui/material/Checkbox';
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaPinterestP } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Drawer from '@mui/material/Drawer';
import CartPanel from '../CartPanel';
import { MyContext } from '../../App';
import {IoCloseSharp} from 'react-icons/io5';







const Footer =() =>{
  
  
    const  context = useContext(MyContext);

    
    
    return( 
        <>
        <footer className='py-6 bg-[rgba(0,0,0,0.2)] border-2 border-[rgba(0,0,0,0.1)]'>
        <div className='container'>
        <div className='flex items-center justify-center gap-2 py-8 pb-8'>
        
        <div className='col flex items-center justify-center flex-col group w-[20%]'>
        <LiaShippingFastSolid className='text-[50px] group-hover:text-[red] transition-all duration-300 group-hover:-translate-y-1' />
        <h3 className='text-[16px] font-[600]'>Free Shiping</h3>  
        <p className='text-[12px] font-[500]'>For all Order Over $100</p>  
        </div>      
        
        
        <div className='col flex items-center justify-center flex-col group w-[20%]'>
        <TbTruckReturn className='text-[50px] group-hover:text-[red] transition-all duration-300 group-hover:-translate-y-1' />
        <h3 className='text-[16px] font-[600]'>30 Days Returns</h3>  
        <p className='text-[12px] font-[500]'>For Exchange Product</p>  
        </div>  
        
        <div className='col flex items-center justify-center flex-col group w-[20%]'>
        <BsWallet2 className='text-[50px] group-hover:text-[red] transition-all duration-300 group-hover:-translate-y-1' />
        <h3 className='text-[16px] font-[600]'>Secured Payment</h3>  
        <p className='text-[12px] font-[500]'>Payment Cards Accepted</p>  
        </div>  
        
        <div className='col flex items-center justify-center flex-col group w-[20%]'>
        <LiaGiftSolid className='text-[50px] group-hover:text-[red] transition-all duration-300 group-hover:-translate-y-1' />
        <h3 className='text-[16px] font-[600]'>Special Gifts</h3>  
        <p className='text-[12px] font-[500]'>Our Frist Product Order</p>  
        </div>  
        
        <div className='col flex items-center justify-center flex-col group w-[20%]'>
        <RiCustomerService2Line className='text-[50px] group-hover:text-[red] transition-all duration-300 group-hover:-translate-y-1' />
        <h3 className='text-[16px] font-[600]'>Support 24/7</h3>  
        <p className='text-[12px] font-[500]'>Contact us anytime</p>  
        </div>  
          
        </div> 
        <hr className='text-[rgba(0,0,0,0.2)] '/>
       
       
      
        <div className="footer flex py-8">
        
        <div className="part-1 w-[25%] border-r border-[rgba(0,0,0,0.2)] ">
        <h2 className='text-[18px] font-[600] mb-4'>Contact Us</h2>
        <p className='text-[14px]'> Classyshop - mega Super Store <br/>-507 Union Trade center <br/>Bangladesh</p>
        <Link className='link text-[13px]' to="mailto:someone@example.com">Sales@YourComapany.com</Link>
        
        <span className='text-[16px] font-[600] block w-full !mt-3 !mb-5 text-[red]'>+880167-4847446</span>
        
        <div className='flex items-center gap-2'>
        <IoChatboxOutline className='text-[40px] text-[red]'/>
        <span className='text-[16px] font-[600]'>Online Caht <br/>Get Export Help</span>
        
        </div>
        </div>
     
        
        <div className='part2 w-[40%] flex pl-8'>
        <div className='part2_col1 w-[50%]'>
        <h2 className='text-[18px] font-[600] mb-4 '>Products</h2>
        
        <ul className='list'>
        
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Price drop</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>New Products</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Best Salles</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Contact Us</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Site Map</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Stores</Link></li>
        </ul>
        </div>
        
        <div className='part2_col2 w-[50%]'>
        <h2 className='text-[18px] font-[600] mb-4 '>Our Company</h2>
        
        <ul className='list'>
        
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Delevery</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Lagel Notice</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Terms And Conditions Of Us</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>About Us</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Secure Payment</Link></li>
        <li className='list-none text-[14px] w-full mb-1'><Link to="/" className='link'>Login</Link></li>
        </ul>
        </div>  
        </div>
        <div className='part2 w-[35%] flex pl-8 flex-col pr-8'>
        <h2 className='text-[18px] font-[600] !mb-4'>Subscribe To Newsletters</h2>
        <p className='text-[13px] !mb-4'>Subscribe to our latest newslatters to get <br/>news about special discount</p>
      
      
      <form className='mt-5'>
      <input type='text' className="w-full h-[45px] border-none   !pl-4 !pr-4 !rounded-sm !mb-4 !focus:border-[rgba(0,0,0,0.3)]" placeholder='Your Email Address'/>
      
      <Button className='btn-org'>SUBSCRIBE</Button>
       <FromControlLabel control={<Checkbox defaultChecked/>} label="I agree to the terms and conditions and the privacy policy"/>
      </form>
        </div>
        </div>
        </div>     
        </footer>
        
        
        <div className='bottomStrip border-t border-[rgba(0,0,0,0.2)] py-3 bg-white'>
        <div className='container flex items-center justify-between'>
        <ul className='flex items-center gap-2'>
        <li className='list-none'>
        <Link to="/" target="_blank" className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center 
        justify-center group hover:bg-amber-700 transition-all'>
        <FaFacebookF className="text-[15px] group-hover:text-white"/>
        
        </Link>
        </li>
        
        <li className='list-none'>
        <Link to="/" target="_blank" className='w-[35px]  h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center 
        justify-center group hover:bg-amber-700 transition-all'>
        <AiOutlineYoutube className="text-[15px] group-hover:!text-white"/>
        
        </Link>
        </li>
        
        <li className='list-none'>
        <Link to="/" target="_blank" className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center 
        justify-center group hover:bg-amber-700 transition-all'>
        <FaPinterestP className="text-[15px] group-hover:text-white"/>
        
        </Link>
        </li>
        
        <li className='list-none'>
        <Link to="/" target="_blank" className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center 
        justify-center group hover:bg-amber-700 transition-all'>
        <FaInstagram className="text-[15px] group-hover:text-white"/>
        
        </Link>
        </li>  
        </ul>
        
        <p className='text-[13px] text-center mb-0 font-[500]'> @ 2025 - Ecommerce Website By GoroaBaza </p>
        
        <div className='flex items-center w-[18%]  '>
        <img src='/src/assets/Images/FooterCardPic/Bikash.png'/>
        
        </div>
        </div>
        </div>
        
        
        
        {/*Cart panel*/}
        
              <Drawer 
              open={context.openCartPanel} 
              onClose={context.toggleCartPanel(false)}
               anchor={"right"}
               className='cartPanel'
               >
          <div className='flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.2)]'>
          <h4>Shopping Cart (1)</h4>
          <IoCloseSharp className='text-[22px text-[#ff5252]] cursor-pointer'  onClick={context.toggleCartPanel(false)}/>
          </div>
          
          
          <CartPanel/>
          
          
        </Drawer>
        
      
        </>   
    );
    
};

export default Footer;
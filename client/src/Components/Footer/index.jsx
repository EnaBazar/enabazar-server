import React, { useContext } from 'react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { TbTruckReturn } from "react-icons/tb";
import { RiCustomerService2Line } from "react-icons/ri";
import { LiaGiftSolid } from "react-icons/lia";
import { BsWallet2 } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from "react-icons/io5";
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import Drawer from '@mui/material/Drawer';
import CartPanel from '../CartPanel';
import { MyContext } from '../../App';
import { IoCloseSharp } from 'react-icons/io5';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from '../ProductZoom';
import ProductDetailsComponant from '../ProductDetailsComponant';
import Addaddress from '../../Pages/MyAccount/addAddress';
import { MdQuestionAnswer } from 'react-icons/md';

const Footer = () => {
  const context = useContext(MyContext);
  MdQuestionAnswer
  return (
    <>
      <footer className='relative z-10'>
        {/* Features Section */}
<div className="bg-white border-t border-b py-8">
  <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
    {[
      { icon: LiaShippingFastSolid, title: "Free Shipping", desc: "For all Order Over $100" },
      { icon: TbTruckReturn, title: "30 Days Returns", desc: "For Exchange Product" },
      { icon: BsWallet2, title: "Secured Payment", desc: "Payment Cards Accepted" },
      { icon: LiaGiftSolid, title: "Special Gifts", desc: "Our First Product Order" },
      { icon: RiCustomerService2Line, title: "Support 24/7", desc: "Contact us anytime" },
    ].map((item, idx) => {
      const Icon = item.icon;
      return (
        <div
          key={idx}
          className="flex flex-col items-center text-center gap-3 p-5 rounded-xl 
          bg-white shadow-sm border hover:shadow-lg hover:-translate-y-2 
          transition-all duration-300"
        >
          <Icon className="text-4xl text-[#FC8934] transition-transform
           duration-300 group-hover:scale-110" />
          <div>
            <h3 className="font-semibold text-[16px] text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>



        {/* Footer Links */}
       <div className="bg-orange-50 py-10 text-gray-800">
  <div className="container mx-auto px-4 lg:px-0 flex flex-col lg:flex-row gap-8">
    
    {/* Contact */}
    <div className="lg:w-1/4 flex flex-col gap-4">
      <h2 className="font-semibold text-lg mb-2 text-[#FC8934]">Contact Us</h2>
      <p>
        Ena Bazar.com<br />
        Islampur Road-3900 <br />
        Bangladesh
      </p>
      <Link className="text-[#FC8934] hover:underline" to="mailto:ikhalil7446@gmail.com">
        ikhalil7446@gmail.com
      </Link>
      <span className="text-[#FC8934] font-semibold block mt-2 mb-2">+880167-4847446</span>
      <div className="flex items-center gap-2">
        <IoChatboxOutline className="text-3xl text-[#FC8934]" />
        <span className="text-sm">Online Chat <br />Get Expert Help</span>
      </div>
    </div>

    {/* Products & Company */}
    <div className="lg:w-2/5 flex flex-row justify-between gap-4">
      <div>
        <h2 className="font-semibold text-lg mb-3 text-[#FC8934]">Products</h2>
        <ul className="flex flex-col gap-1">
          {["Price drop","New Products","Best Sales","Contact Us","Site Map","Stores"].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/">{item}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold text-lg mb-3 text-[#FC8934]">Our Company</h2>
        <ul className="flex flex-col gap-1">


 

           {["Delivery",].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/delivery">{item}</Link>
            </li>
          ))}
          {["Login",].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/login">{item}</Link>
            </li>
          ))}
           {["Legal Notice",].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/ligalNotice">{item}</Link>
            </li>
          ))}
           {["Secure Payment"].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/securePayment">{item}</Link>
            </li>
          ))}
  
           {["Terms & Conditions",].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/Terms_Conditions">{item}</Link>
            </li>
          ))}
            {["About Us",].map((item, idx) => (
            <li key={idx}>
              <Link className="text-sm hover:text-[#FC8934]" to="/aboutUs">{item}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Newsletter */}
    <div className="lg:w-1/3 flex flex-col gap-4">
      <h2 className="font-semibold text-lg mb-2 text-[#FC8934]">Subscribe To Newsletters</h2>
      <p className="text-sm mb-2">
        Subscribe to our latest newsletters to get news about special discounts
      </p>
      <form className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Your Email Address"
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#FC8934]"
        />
        <Button className="bg-[#FC8934] text-white hover:bg-[#e67300] py-2">SUBSCRIBE</Button>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="I agree to the terms and conditions and the privacy policy"
          className="text-sm"
        />
      </form>
    </div>

  </div>
</div>


        {/* Bottom Strip */}
      <div className="!bg-[#FC8934] text-white py-4">
  <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center gap-4">
    
    {/* Social Links */}
    <ul className="flex gap-2">
      {[FaFacebookF, AiOutlineYoutube, FaPinterestP, FaInstagram].map((Icon, idx) => (
        <li key={idx}>
          <Link
            to="/"
            target="_blank"
            className="w-9 h-9 rounded-full border border-white flex items-center justify-center 
                       hover:bg-white hover:text-[#FC8934] transition-colors duration-300"
          >
            <Icon className="text-sm" />
          </Link>
        </li>
      ))}
    </ul>

    {/* Copy Text */}
    <p className="text-center text-sm mb-0">© 2025 - EnaBazar.com By Ibrahim Khalil</p>

    {/* Payment Image */}
    <div className="flex items-center justify-center">
      <img
        src="/src/assets/Images/FooterCardPic/Bikash.png"
        className="h-10 object-contain bg-white rounded px-2 py-1"
      />
    </div>
  </div>
</div>

      </footer>

     



  {/*Cart panel*/}
        
 <Drawer 
              open={context.openCartPanel} 
              onClose={context.toggleCartPanel(false)}
               anchor={"right"}
               className='cartPanel'
               >
          <div className='flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.2)]'>
          <h4>Shopping Cart ({context?.cartData?.length})</h4>
          <IoCloseSharp className='text-[22px text-[#ff5252]] cursor-pointer'  onClick={context.toggleCartPanel(false)}/>
          </div>
          {
            context?.cartData?.length!==0 ? <CartPanel data={context?.cartData}/>  : 
            <>
           <div className='flex items-center justify-center flex-col kk'>

             <img src='/empty-cart.png' className='w-[200px] !mt-20'/>
             <h4>Your Cart is Current empty</h4>
              <Link to="/"><Button className='btn-org btn-sml !mt-5'onClick={context.toggleCartPanel(false)}>Continue Shoping</Button></Link>
           </div>
            </>
          }
          
          
          
          
 </Drawer>
           
  {/*Address panel*/}      
<Drawer
  open={context.openAddressPanel}
  onClose={() => context.toggleAddressPanel(false)}
  anchor="right"
  PaperProps={{
    className:
      "w-full lg:w-[500px] h-screen lg:h-[90vh] flex flex-col p-0 bg-white shadow-xl rounded-t-xl lg:rounded-none",
  }}
>
  {/* Header */}
  <div className="flex items-center justify-between py-3 px-4 border-b border-[rgba(0,0,0,0.2)] sticky top-0 bg-white z-20">
    <h4 className="text-lg font-medium">
      {context?.addressMode === "add" ? "Add" : "Edit"} Delivery Address
    </h4>
 
<IoCloseSharp className='text-[25px] !text-[red] cursor-pointer' 
 onClick={context.toggleAddressPanel(false)}/>
  </div>

  {/* Scrollable Form */}
  <div className="flex-1 overflow-y-auto p-4">
    <Addaddress />
  </div>
</Drawer>






 <Dialog
 fullWidth={context?.fullWidth}
 maxWidth={context?.maxWidth}
        open={context?.openProductDetailsModel.open}
        onClose={context?.handleCloseProductDetailsModel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='productDetailsModal'
      >
       
        <DialogContent>
<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
  <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh]
   overflow-y-auto flex flex-col md:flex-row">
    
    {/* ❌ Close Button */}
    <Button
      className="!w-[36px] !h-[36px] !min-w-[36px] !rounded-full !absolute top-4 
      right-4 !text-[#ff5252] z-10 bg-white shadow-md hover:bg-gray-100"
      onClick={() => context?.handleCloseProductDetailsModel(false, {})}
    >
      <IoCloseSharp className="text-[22px]" />
    </Button>

    {context?.openProductDetailsModel?.item?.length !== 0 && (
      <>
        {/* 🖼 Left Column - Product Image */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r
         border-gray-200 p-4 md:p-6 flex items-center justify-center">
          <ProductZoom images={context?.openProductDetailsModel?.item?.images} />
        </div>

        {/* 📄 Right Column - Product Content */}
        <div className="w-full md:w-1/2 p-5 md:p-8 overflow-y-auto">
          <ProductDetailsComponant item={context?.openProductDetailsModel?.item} />
        </div>
      </>
    )}
  </div>
</div>


        </DialogContent>
      
</Dialog>




    </>
  );
};

export default Footer;

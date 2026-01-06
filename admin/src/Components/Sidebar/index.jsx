import Button from '@mui/material/Button';
import React, {useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FaRegImage } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { RiProductHuntLine } from 'react-icons/ri';
import { TbCategory } from 'react-icons/tb';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoMdLogOut } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa6';
import { Collapse } from 'react-collapse';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';



 const Sidebar = (props) => {
   
  const[submenuIndex,setSubmenuIndex] = useState(null)
  const context = useContext(MyContext);
  const [anchorMyAcc, setAnchorMyAcc] = useState(null);

  const history = useNavigate();




   const isOpenSubMenu=(index=>{
     
     if(submenuIndex===index){
       
      setSubmenuIndex(null);
     }else{
       
    setSubmenuIndex(index)
     }
  
   })
   


      const logout=()=>{

      fetchDataFromApi(`/auth/logout?token=${localStorage.getItem('accesstoken')}`,{withCredentials:true}).then((res)=>{ 
           if(res?.error === false){
             context.setIsLogin(false);
             localStorage.removeItem("accesstoken")     
              localStorage.removeItem("refreshtoken")
            window.location.reload();
              history("/");
           }    
         })
       }



  return (
    <>
    <div className='sidebar  top-0 left-0 bg-[#f1f1f1]
    h-full border-r border-[rgba(0,0,0,0.2)] py-2 px-2 z-50'  >
    
     <div className="col1 w-[40%] lg:w-[50%] flex items-center 
     justify-end lg:justify-start">
  <Link to={"/"}> 
    <img src="/logo.png"/>
  </Link>
</div>
    
    <ul className='mt-4'>
    <li>
    <Link to="/" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center
     !py-2 hover:!bg-[#dddddd]' >
    <RxDashboard className='text-[16px]'
    /><span>DashBoard</span>
    </Button>
    </Link>
    </li> 
    
    <li>
   
    <Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center
    !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(1)}
    >
    <FaRegImage className='text-[16px]'
    /><span>Home Slides</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(1)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 1 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===1 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
    <li className='w-full'>
    <Link to="/homeSliderlist" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Home Banners List</Button>
    </Link>
    </li>
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize 
     !justify-start !w-full !text-[12px] !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
     open:true,
     model:"AddHomeSlide"
    })}
    >
    <span className='block w-[5px] h-[5px] rounded-full 
    bg-[rgba(0,0,0,0.3)]'>
    </span>{""}
    Add Home Banner Slide</Button>
    </li>
    </ul>
    </Collapse>
    <Link/>
    </li> 
    <li>
    <Link to="/users" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center 
    !py-2 hover:!bg-[#dddddd]'>
    <FiUsers className='text-[16px]'
    /><span>Users</span>
    </Button>
    </Link>
    </li> 
    
    <li><Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(2)}
    >
    <RiProductHuntLine className='text-[16px]'
    /><span>Products</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(2)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 2 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===2 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
   
    <li className='w-full'>
    <Link to="/products" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   Product List</Button>
   </Link>
    </li>
    
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
     open:true,
     model:"Add Product"
      
    })}
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Product Upload</Button>
 
    </li>
    
    <li className='w-full'>
    <Link to="/product/addRams" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] !font-[500] !pl-9 flex gap-3'
   
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Product Ram</Button>
 </Link>
    </li>
    
        <li className='w-full'>
    <Link to="/product/addSize" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] !font-[500] !pl-9 flex gap-3'
   
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Product Size</Button>
 </Link>
    </li>
    
        <li className='w-full'>
    <Link to="/product/addWieght" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] !font-[500] !pl-9 flex gap-3'
   
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Product Wieght</Button>
 </Link>
    </li>
    </ul>
    </Collapse>
  
    
    </li> 
    
    <li><Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(3)}>
    
    <TbCategory className='text-[16px]'
    /><span>Categorys</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(3)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 3 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===3 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
    
    <li className='w-full'>
    <Link to="/Categorylist" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   Category List</Button>
   </Link>
    </li>
    
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
 
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] 
    !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
     open:true,
     model:"AddNewCategory"
      
    })}
    
    >
  
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Add Category</Button>

    </li>
    
    <li className='w-full'>
    <Link to="/SubCategorylist" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   Sub Category List</Button>
   </Link>
    </li>
    
 <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
 <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] 
 !font-[500] !pl-9 flex gap-3'
 onClick={()=>context.setIsOpenFullScreenPanel({
 open:true,
 model:"AddNewSubCategory"
 })}
 
 >

 <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
 Add SubCategory</Button>

 </li>
    
    </ul>
    </Collapse>
  
    
    </li> 
    
    <li>
    <Link to="/orders" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'>
    <IoBagCheckOutline className='text-[16px]'
    /><span>Orders</span>
    </Button>
    </Link>
    </li> 
    
    
      <li><Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(5)}
    >
    <RiProductHuntLine className='text-[16px]'
    /><span>Banners</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(2)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 5 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===5 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
   
    <li className='w-full'>
    <Link to="/bannerV1/list" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   BannerV1 List</Button>
   </Link>
    </li>
    
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px]
    !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
    open:true,
    model:"Add BannerV1"
    })}
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Add BannerV1</Button>
    </li>
    </ul>
    </Collapse>
    </li> 
    
    <li><Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(7)}
    >
    <RiProductHuntLine className='text-[16px]'
    /><span>BannersV2</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(2)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 7 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===7 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
   
    <li className='w-full'>
    <Link to="/bannerV2/list" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   BannerV2 List</Button>
   </Link>
    </li>
    
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px]
    !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
    open:true,
    model:"Add BannerV2"
    })}
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Add BannerV2</Button>
    </li>
    </ul>
    </Collapse>
    </li> 

    <li><Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(8)}
    >
    <RiProductHuntLine className='text-[16px]'
    /><span>BannersV3</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(2)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 8 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===8 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
   
    <li className='w-full'>
    <Link to="/bannerV3/list" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   BannerV3 List</Button>
   </Link>
    </li>
    
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px]
    !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
    open:true,
    model:"Add BannerV3"
    })}
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Add BannerV3</Button>
    </li>
    </ul>
    </Collapse>
    </li> 

    <li><Button className='w-full !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
    onClick={()=>isOpenSubMenu(6)}
    >
    <RiProductHuntLine className='text-[16px]'
    /><span>Blogs</span>
    <span className='ml-auto  w-[30px] h-[30px] flex items-center justify-center'
    onClick={()=>isOpenSubMenu(6)}
    ><FaAngleDown  className={`transition-all ${submenuIndex === 6 ? 'rotate-180' : ''}`}/></span>
    </Button>
    <Collapse isOpened={submenuIndex===6 ? true : false}>
    <ul className='w-full bg-[#fff] shadow-md border-t border-[rgba(0,0,0,0.2)] rounded-sm'>
   
    <li className='w-full'>
    <Link to="/blog/list" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full 
    !text-[12px] !font-[500] !pl-9 flex gap-3'>
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
    Blog List</Button>
   </Link>
    </li>
    
    <li className='w-full' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
    
    <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[12px] !font-[500] !pl-9 flex gap-3'
    onClick={()=>context.setIsOpenFullScreenPanel({
     open:true,
     model:"add Blog"
      
    })}
    
    >
    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]'></span>{""}
   Add Blog</Button>
 
    </li>
    

    </ul>
    </Collapse>
  
    
    </li> 
    
    <li><Button className='w-full  !capitalize !justify-start gap-3 
    text-[14px] !text-[rgba(236, 13, 13, 0.8)] !font-[500] items-center !py-2 hover:!bg-[#dddddd]'
   onClick={() => {context.setIsToggleSidebar(!context.isToggleSidebar); logout()}}
    >
    <IoMdLogOut className='text-[16px]'
    /><span >LogOut</span>
    </Button></li> 
    
  
    </ul>
    
    </div>
    
  
  </>
 
  )
  
 
}
export default Sidebar;

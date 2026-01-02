import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { RiMenu2Line } from 'react-icons/ri';
import { useNavigate, Link } from "react-router-dom";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { FaRegBell, FaRegUser } from 'react-icons/fa';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { IoMdLogOut, IoMdClose } from 'react-icons/io';
import { MyContext } from '../../App';
import { editData, fetchDataFromApi } from '../../utils/api';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
// Pages
import AddProduct from "../../Pages/AddProduct";
import AddHomeSlide from '../../Pages/HomeSliderBanners/AddHomeSlide';
import AddCategory from '../../Pages/Category/AddCategory';
import AddSubCategory from '../../Pages/Category/AddSubCategory';
import AddAddress from '../../Pages/Address/addAddress.jsx';
import EditCategory from '../../Pages/Category/EditeCategory.jsx';
import EditProduct from '../../Pages/AddProduct/editProduct.jsx';
import AddBannerV1 from '../../Pages/Banners/addBannerV1.jsx';
import EditBannerV1 from '../../Pages/Banners/EditBannerV1.jsx';
import AddBannerV2 from '../../Pages/Banners2/addBannerV2.jsx';
import EditBannerV2 from '../../Pages/Banners2/EditBannerV2.jsx';
import Addblog from '../../Pages/Blog/Addblog.jsx';
import Editblog from '../../Pages/Blog/Editblog .jsx';
import Orders from '../../Pages/Orders/index.jsx';
import AddBannerV3 from '../../Pages/Banners3/addBannerV3.jsx';
import EditBannerV3 from '../../Pages/Banners3/EditBannerV3.jsx';

// Transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styled Badge
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const context = useContext(MyContext);
  const history = useNavigate();

  // --- Notification Count ---
  useEffect(() => {
    fetchDataFromApi("/order/unread-count").then((res) => {
      if (!res.error) {
        context.setOrderCount(res.unreadOrders);
      }
    });
  }, []);



const handleBellClick = async () => {
  try {
    if (context.orderCount === 0) {
      // যদি কোনো unread order না থাকে, কিছু না করো
      return;
    }

    // mark orders as read
    await fetchDataFromApi("/order/mark-read", { method: "PUT" });
    context.setOrderCount(0);

    // open fullscreen panel
    context.setIsOpenFullScreenPanel({
      open: true,
      model: "Order List",
    });

  } catch (err) {
    console.log(err);
  }
};





  // --- Account Menu ---
  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

  // --- Logout ---
const logout = () => {
    fetchDataFromApi(`/auth/logout?token=${localStorage.getItem('accesstoken')}`,{withCredentials:true}).then((res)=>{ 
           if(res?.error === false){
             context.setIsLogin(false);
             localStorage.removeItem("accesstoken")     
              localStorage.removeItem("refreshtoken")
            window.location.reload();
              history("/");
           }    
         })

};


  return (
    <>
      <header className={`w-full fixed h-[auto] pr-10 bg-[#fff] shadow-md
        flex items-center justify-between z-[50] transition-all duration-300
        ${context.isToggleSidebar ? "pl-5" : "pl-55"}`}>
        
        {/* Sidebar Toggle */}
        <div className='part1'>
          <Button
            className='!w-[40px] !h-[40px] !rounded-full !min-w-[40px]
            flex items-center justify-center !text-[rgba(0,0,0,0.8)]'
            onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}
          >
            <RiMenu2Line className='text-[18px]' />
          </Button>
        </div>

        {/* Right Side */}
        <div className='part2 w-[40%] flex items-center justify-end gap-4'>
          
          {/* Notification Bell */}
       <IconButton
  aria-label="notifications"
  onClick={handleBellClick}
>
  <StyledBadge badgeContent={context.orderCount} color="secondary">
    <FaRegBell />
  </StyledBadge>
</IconButton>


          {/* User Avatar / Login */}
          {context.isLogin === true ? (
            <div className='relative'>
              <div className='rounded-full w-[30px] h-[30px] overflow-hidden cursor-pointer'
                onClick={handleClickMyAcc}>
                <img src={context?.userData?.avatar} className='w-full h-full object-cover' />
              </div>
              <Menu
                anchorEl={anchorMyAcc}
                id="account-menu"
                open={openMyAcc}
                onClose={handleCloseMyAcc}
                onClick={handleCloseMyAcc}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleCloseMyAcc}>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-full w-[30px] h-[30px] overflow-hidden cursor-pointer'>
                      <img src={context?.userData?.avatar} className='w-full h-full object-cover' />
                    </div>
                    <div className='info'>
                      <h3 className='text-[16px] font-[500] leading-5'>{context?.userData?.name}</h3>
                      <p className='text-[12px] font-[400] opacity-70'>{context?.userData?.mobile}</p>
                    </div>
                  </div>
                </MenuItem>
                <Divider />

                <Link to="/profile">
                  <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
                    <FaRegUser className='text-[16px]' /><span className='text-[13px]'>Profile</span>
                  </MenuItem>
                </Link>

                <MenuItem onClick={logout} className='flex items-center gap-3'>
                  <IoMdLogOut className='text-[16px]' /><span className='text-[13px]'>LogOut</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/login">
              <Button className='btn-blue btn-sm !rounded-full'>Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Full Screen Panel */}
      <Dialog
        fullScreen
        open={context?.isOpenFullScreenPanel.open}
        onClose={() => context?.setIsOpenFullScreenPanel({ open: false })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => context?.setIsOpenFullScreenPanel({ open: false })}
              aria-label="close"
            >
              <IoMdClose className='text-[black]' />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className='text-gray-600'>{context?.isOpenFullScreenPanel?.model}</span>
            </Typography>
          </Toolbar>
        </AppBar>

        {context?.isOpenFullScreenPanel?.model === "Add Product" && <AddProduct />}
        {context?.isOpenFullScreenPanel?.model === "AddHomeSlide" && <AddHomeSlide />}
        {context?.isOpenFullScreenPanel?.model === "AddNewCategory" && <AddCategory />}
        {context?.isOpenFullScreenPanel?.model === "AddNewSubCategory" && <AddSubCategory />}
        {context?.isOpenFullScreenPanel?.model === "AddNewAddress" && <AddAddress />}
        {context?.isOpenFullScreenPanel?.model === "Edit Category" && <EditCategory />}
        {context?.isOpenFullScreenPanel?.model === "Edit Product" && <EditProduct />}
        {context?.isOpenFullScreenPanel?.model === "Add BannerV1" && <AddBannerV1 />}
        {context?.isOpenFullScreenPanel?.model === "Edit BannerV1" && <EditBannerV1 />}
        {context?.isOpenFullScreenPanel?.model === "Add BannerV2" && <AddBannerV2 />}
        {context?.isOpenFullScreenPanel?.model === "Edit BannerV2" && <EditBannerV2 />}
        {context?.isOpenFullScreenPanel?.model === "Add BannerV3" && <AddBannerV3 />}
        {context?.isOpenFullScreenPanel?.model === "Edit BannerV3" && <EditBannerV3 />}
        {context?.isOpenFullScreenPanel?.model === "add Blog" && <Addblog />}
        {context?.isOpenFullScreenPanel?.model === "edit Blog" && <Editblog />}
          {context?.isOpenFullScreenPanel?.model === "Order List" && <Orders />}
      </Dialog>




    </>
  );
};

export default Header;

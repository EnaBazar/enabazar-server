import './App.css';
import './responsive.css';
import React, { createContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Dialog from "@mui/material/Dialog";
import { IoMdClose } from "react-icons/io";

import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Products from './Pages/Products';
import HomeSliderBanners from './Pages/HomeSliderBanners';
import CategoryList from './Pages/Category';
import SubCategoryList from './Pages/Category/SubCatList';
import Users from './Pages/Users';
import Orders from './Pages/Orders';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyAccount from './Pages/VerifyAccount';
import ChangePassword from './Pages/ChangePassword';
import Profile from './Pages/Profile';
import ProductDetails from './Pages/Products/ProductDetails';
import AddRams from './Pages/Products/AddRams';
import AddSize from './Pages/Products/AddSize';
import AddWieght from './Pages/Products/AddWieght';
import BannerV1List from './Pages/Banners/BannerV1List';
import BlogList from './Pages/Blog';
import Reports from './Pages/Reports';
import SalesList from './Pages/sales';
import AdminChat from './Components/AdminChat';
import UserDetails from './Pages/Users/UserDetails';
import VerifyOtpPanel from './Pages/SignUp/VerifyOtpPanel';

import Layout from './Components/Layout';
import { fetchDataFromApi } from './utils/api';
import Purchases from './Pages/Purchases';
import Suppliers from './Pages/Suppliers';

export const MyContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [isToggleSidebar, setIsToggleSidebar] = useState(true);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [orderCount, setOrderCount] = useState(0);
  const [addressMode, setAddressMode] = useState("add");
  const [addressId, setAddressId] = useState(null);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [openVerifyOtpPanel, setOpenVerifyOtpPanel] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [openUpateVerifyOtp, setOpenUpadteVerifyOtp] = useState(false);

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: '',
    id: ""
  });

  // Login always true
  const [isLogin, setIsLogin] = useState(true);

  const toggleVerifyOtp = (newOpen) => () => setOpenVerifyOtpPanel(newOpen);
  const toggleUpdateVerifyOtp = (newOpen) => () => setOpenUpadteVerifyOtp(newOpen);

  const openAlertBox = (status, msg) => {
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  };

  const openOtpPanel = (data) => {
    setOtpData(data);
    setOpenVerifyOtpPanel(true);
  };

  const closeOtpPanel = () => {
    setOpenVerifyOtpPanel(false);
    setOtpData(null);
  };

  const openUpdateOtpPanel = (data) => {
    setOtpData(data);
    setOpenUpadteVerifyOtp(true);
  };

  const closeUpdateOtpPanel = () => {
    setOpenUpadteVerifyOtp(false);
    setOtpData(null);
  };

  useEffect(() => {
    getCat();

    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getCat = () => {
    fetchDataFromApi("/category").then((res) => {
      setCatData(res?.data || []);
    });
  };

  const values = {
    chatUnreadCount,
    setChatUnreadCount,
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    openAlertBox,
    setUserData,
    userData,
    setAddress,
    address,
    catData,
    setCatData,
    getCat,
    setWindowWidth,
    windowWidth,
    setOrderCount,
    orderCount,
    setAddressMode,
    addressMode,
    addressId,
    setAddressId,
    otpData,
    setOtpData,
    openVerifyOtpPanel,
    setOpenVerifyOtpPanel,
    toggleVerifyOtp,
    openOtpPanel,
    closeOtpPanel,
    openUpateVerifyOtp,
    setOpenUpadteVerifyOtp,
    openUpdateOtpPanel,
    closeUpdateOtpPanel,
    toggleUpdateVerifyOtp
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/dashboard" />
    },

    {
      path: "/dashboard",
      element: (
        <Layout>
          <Dashboard />
        </Layout>
      )
    },

    {
      path: "/products",
      element: (
        <Layout>
          <Purchases />
        </Layout>
      )
    },

    {
      path: "/users",
      element: (
        <Layout>
          <Users />
        </Layout>
      )
    },

    {
      path: "/orders",
      element: (
        <Layout>
          <Orders />
        </Layout>
      )
    },

    {
      path: "/profile",
      element: (
        <Layout>
          <Profile />
        </Layout>
      )
    },

    {
      path: "/homeSliderlist",
      element: (
        <Layout>
          <HomeSliderBanners />
        </Layout>
      )
    },

    {
      path: "/Categorylist",
      element: (
        <Layout>
          <CategoryList />
        </Layout>
      )
    },

    {
      path: "/SubCategorylist",
      element: (
        <Layout>
          <SubCategoryList />
        </Layout>
      )
    },

    {
      path: "/usersdetails",
      element: (
        <Layout>
          <UserDetails />
        </Layout>
      )
    },

    {
      path: "/report",
      element: (
        <Layout>
          <Reports />
        </Layout>
      )
    },

    {
      path: "/salles",
      element: (
        <Layout>
          <Suppliers/>
        </Layout>
      )
    },

    {
      path: "/chat",
      element: (
        <Layout>
          <AdminChat />
        </Layout>
      )
    },

    {
      path: "/product/:id",
      element: (
        <Layout>
          <ProductDetails />
        </Layout>
      )
    },

    {
      path: "/product/addRams",
      element: (
        <Layout>
          <AddRams />
        </Layout>
      )
    },

    {
      path: "/product/addSize",
      element: (
        <Layout>
          <AddSize />
        </Layout>
      )
    },

    {
      path: "/product/addWieght",
      element: (
        <Layout>
          <AddWieght />
        </Layout>
      )
    },

    {
      path: "/bannerV1/list",
      element: (
        <Layout>
          <BannerV1List />
        </Layout>
      )
    },

    {
      path: "/blog/list",
      element: (
        <Layout>
          <BlogList />
        </Layout>
      )
    },

    // Optional Public Routes
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/sign-up",
      element: <SignUp />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/verify-account",
      element: <VerifyAccount />
    },
    {
      path: "/change-password",
      element: <ChangePassword />
    }
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster />

      <Dialog
        open={openVerifyOtpPanel}
        onClose={(event, reason) => {
          if (
            reason === "backdropClick" ||
            reason === "escapeKeyDown"
          ) {
            return;
          }
          closeOtpPanel();
        }}
      >
        <div className="flex items-center justify-between py-2 px-3 border-b">
          <IoMdClose
            className="text-[22px] text-red-600 cursor-pointer"
            onClick={toggleVerifyOtp(false)}
          />
        </div>

        <div className="p-4">
          <VerifyOtpPanel />
        </div>
      </Dialog>
    </MyContext.Provider>
  );
}

export default App;
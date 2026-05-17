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
import ProtectedRoute from "./Components/ProtectedRoute";
import { fetchDataFromApi } from './utils/api';

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

  const [openVerifyOtpPanel, setOpenVerifyOtpPanel] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [openUpateVerifyOtp, setOpenUpadteVerifyOtp] = useState(false);

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: '',
    id: ""
  });

  const [isLogin, setIsLogin] = useState(() => {
    const token = localStorage.getItem('accesstoken');
    return token ? true : null;
  });

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
    if (!isLogin) return;

    fetchDataFromApi(`/auth/user-dtails`).then((res) => {
      if (res?.data) {
        setUserData(res.data);
      } else {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        setIsLogin(false);
        openAlertBox("error", "Your session expired. Please login again.");
      }
    });
  }, [isLogin]);

  useEffect(() => {
    getCat();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCat = () => {
    fetchDataFromApi("/category").then((res) => setCatData(res?.data));
  };

  const values = {
    isToggleSidebar, setIsToggleSidebar,
    isLogin, setIsLogin,
    isOpenFullScreenPanel, setIsOpenFullScreenPanel,
    openAlertBox,
    setUserData, userData,
    setAddress, address,
    catData, setCatData, getCat,
    setWindowWidth, windowWidth,
    setOrderCount, orderCount,
    setAddressMode, addressMode,
    addressId, setAddressId,
    otpData, setOtpData,
    openVerifyOtpPanel, setOpenVerifyOtpPanel,
    toggleVerifyOtp, openOtpPanel, closeOtpPanel,
    openUpateVerifyOtp, setOpenUpadteVerifyOtp,
    openUpdateOtpPanel, closeUpdateOtpPanel, toggleUpdateVerifyOtp
  };

  const router = createBrowserRouter([
    // 🔥 Root redirect to login
    { path: "/", element: <Navigate to="/login" /> },

    // Public Routes
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify-account", element: <VerifyAccount /> },
    { path: "/change-password", element: <ChangePassword /> },

    // Protected Routes
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/products",
      element: (
        <ProtectedRoute>
          <Layout><Products /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/users",
      element: (
        <ProtectedRoute>
          <Layout><Users /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <Layout><Orders /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/homeSliderlist",
      element: (
        <ProtectedRoute>
          <Layout><HomeSliderBanners /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/Categorylist",
      element: (
        <ProtectedRoute>
          <Layout><CategoryList /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/SubCategorylist",
      element: (
        <ProtectedRoute>
          <Layout><SubCategoryList /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/usersdetails",
      element: (
        <ProtectedRoute>
          <Layout><UserDetails /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/report",
      element: (
        <ProtectedRoute>
          <Layout><Reports /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/salles",
      element: (
        <ProtectedRoute>
          <Layout><SalesList /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/chat",
      element: (
        <ProtectedRoute>
          <Layout><AdminChat /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/product/:id",
      element: (
        <ProtectedRoute>
          <Layout><ProductDetails /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/product/addRams",
      element: (
        <ProtectedRoute>
          <Layout><AddRams /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/product/addSize",
      element: (
        <ProtectedRoute>
          <Layout><AddSize /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/product/addWieght",
      element: (
        <ProtectedRoute>
          <Layout><AddWieght /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/bannerV1/list",
      element: (
        <ProtectedRoute>
          <Layout><BannerV1List /></Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/blog/list",
      element: (
        <ProtectedRoute>
          <Layout><BlogList /></Layout>
        </ProtectedRoute>
      )
    },
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster />

      {/* Verify OTP Panel */}
 <Dialog
  open={openVerifyOtpPanel}
  onClose={(event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return; // ❌ বাইরে click বা ESC এ close হবে না
    }
    closeOtpPanel(); // ✅ শুধু manual close
  }}
  PaperProps={{
    sx: {
      width: "90%",
      maxWidth: 380,
      borderRadius: "16px",
      backdropFilter: "blur(6px)",
      background: "rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
    },
  }}
>
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-3 border-b border-gray-300">
          <IoMdClose
            className="text-[22px] text-red-600 cursor-pointer"
            onClick={toggleVerifyOtp(false)}
          />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <VerifyOtpPanel />
        </div>
      </Dialog>
    </MyContext.Provider>
  );
}

export default App;
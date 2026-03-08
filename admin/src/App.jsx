import './App.css'
import './responsive.css'
import React, { createContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider,Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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

import { fetchDataFromApi } from './utils/api';
import Layout from './Components/Layout';   // নতুন Layout ইউজ করবো
import BannerV2List from './Pages/Banners2/BannerV2List';
import BannerV3List from './Pages/Banners3/BannerV3List';
import AdminChat from './Components/AdminChat';

const MyContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [isToggleSidebar, setIsToggleSidebar] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
const [orderCount, setOrderCount] = useState(0);
 const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [autoreload, setAutoreload] = useState([]);

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: '',
    id: ""
  });



  const openAlertBox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    }
    if (status === "error") {
      toast.error(msg);
    }
  };

const handleSessionExpire = () => {
  localStorage.removeItem("accesstoken");
  localStorage.removeItem("refreshtoken");
  setIsLogin(false);
  setUserData(null);
  openAlertBox("error", "Your session is expired, please login again!");
};




useEffect(() => {
  const token = localStorage.getItem("accesstoken");

  if (token) {
    setIsLogin(true);

    fetchDataFromApi("/auth/user-dtails", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res?.error === false) {
          setUserData(res.data);
        } else {
          // যদি error থাকে
          handleSessionExpire();
        }
      })
      .catch(() => {
        handleSessionExpire();
      });
  } else {
    setIsLogin(false);
  }
}, []);




  useEffect(() => {
    getCat();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getCat = () => {
    fetchDataFromApi("/category").then((res) => {
      setCatData(res?.data);
    });
  };

  const values = {
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
    chatUnreadCount,
     setChatUnreadCount,
  
    
 
  };

   // ✅ Router with login-first logic
  const router = createBrowserRouter([
    // Root route redirects to login if not logged in
    {
      path: "/",
      element: isLogin ? <Navigate to="/dashboard" /> : <Login />
    },
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify-account", element: <VerifyAccount /> },
    { path: "/change-password", element: <ChangePassword /> },

    // Protected Routes (require login)
    {
      path: "/dashboard",
      element: isLogin ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
    },
    { path: "/products", element: isLogin ? <Layout><Products /></Layout> : <Navigate to="/login" /> },
    { path: "/homeSliderlist", element: isLogin ? <Layout><HomeSliderBanners /></Layout> : <Navigate to="/login" /> },
    { path: "/Categorylist", element: isLogin ? <Layout><CategoryList /></Layout> : <Navigate to="/login" /> },
    { path: "/SubCategorylist", element: isLogin ? <Layout><SubCategoryList /></Layout> : <Navigate to="/login" /> },
    { path: "/users", element: isLogin ? <Layout><Users /></Layout> : <Navigate to="/login" /> },
    { path: "/orders", element: isLogin ? <Layout><Orders /></Layout> : <Navigate to="/login" /> },
    { path: "/profile", element: isLogin ? <Layout><Profile /></Layout> : <Navigate to="/login" /> },
    { path: "/product/:id", element: isLogin ? <Layout><ProductDetails /></Layout> : <Navigate to="/login" /> },
    { path: "/product/addRams", element: isLogin ? <Layout><AddRams /></Layout> : <Navigate to="/login" /> },
    { path: "/product/addSize", element: isLogin ? <Layout><AddSize /></Layout> : <Navigate to="/login" /> },
    { path: "/product/addWieght", element: isLogin ? <Layout><AddWieght /></Layout> : <Navigate to="/login" /> },
    { path: "/bannerV1/list", element: isLogin ? <Layout><BannerV1List /></Layout> : <Navigate to="/login" /> },
    { path: "/bannerV2/list", element: isLogin ? <Layout><BannerV2List /></Layout> : <Navigate to="/login" /> },
    { path: "/bannerV3/list", element: isLogin ? <Layout><BannerV3List /></Layout> : <Navigate to="/login" /> },
    { path: "/blog/list", element: isLogin ? <Layout><BlogList /></Layout> : <Navigate to="/login" /> },
    { path: "/chat", element: isLogin ? <Layout><AdminChat /></Layout> : <Navigate to="/login" /> },
  ]);

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
        <Toaster />
      </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };

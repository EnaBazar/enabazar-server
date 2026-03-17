import './App.css'
import './responsive.css'
import React, { createContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import Reports from './Pages/Reports';
import SalesList from './Pages/sales';
import AdminChat from './Components/AdminChat';
import UserDetails from './Pages/Users/UserDetails';

const MyContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [isToggleSidebar, setIsToggleSidebar] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
const [orderCount, setOrderCount] = useState(0);
  const [addressMode, setAddressMode]= useState("add");
const [addressId,setAddressId] = useState(null)
   const [openVerifyOtpPanel, setOpenVerifyOtpPanel] = useState(false);
const [otpData, setOtpData] = useState(null);
 
     const [openUpateVerifyOtp, setOpenUpadteVerifyOtp] = useState(false);

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: '',
    id: ""
  });



  const openOtpPanel = (data) => {
  setOtpData(data);           // data = { mobile: "017xxxxxxx" }
  setOpenVerifyOtpPanel(true); // OTP Panel খোলা হবে
};
  const closeOtpPanel = () => {
    setOpenVerifyOtpPanel(false);
    setOtpData(null);
  };
  const openUpdateOtpPanel = (data) => {
  setOtpData(data);           // data = { mobile: "017xxxxxxx" }
  setOpenUpadteVerifyOtp(true); // OTP Panel খোলা হবে
};
  const closeUpdateOtpPanel = () => {
    setOpenUpadteVerifyOtp(false);
    setOtpData(null);
  };


 const toggleVerifyOtp = (newOpen) => () => {
 
  setOpenVerifyOtpPanel(newOpen);
  };
   const toggleUpdateVerifyOtp = (newOpen) => () => {
  setOpenUpadteVerifyOtp(newOpen);
  };


  const openAlertBox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    }
    if (status === "error") {
      toast.error(msg);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      setIsLogin(true);

      fetchDataFromApi(`/auth/user-dtails`).then((res) => {
        setUserData(res.data);

        if (res?.response?.data?.error === true) {
          if (res?.response?.data?.message === "You have not login") {
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("refreshtoken");
            openAlertBox("error", "Your session is closed please login again!");
            setIsLogin(false);
          }
        }
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

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
    { path: "/", element: <Layout><Dashboard /></Layout> },
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify-account", element: <VerifyAccount /> },
    { path: "/change-password", element: <ChangePassword /> },
    { path: "/products", element: <Layout><Products /></Layout> },
    { path: "/homeSliderlist", element: <Layout><HomeSliderBanners /></Layout> },
    { path: "/Categorylist", element: <Layout><CategoryList /></Layout> },
    { path: "/SubCategorylist", element: <Layout><SubCategoryList /></Layout> },
    { path: "/users", element: <Layout><Users /></Layout> },
      { path: "/usersdetails", element: <Layout><UserDetails /></Layout> },
    { path: "/report", element: <Layout><Reports /></Layout> },
    { path: "/salles", element: <Layout><SalesList /></Layout> },
    { path: "/chat", element: <Layout><AdminChat /></Layout> },
    { path: "/orders", element: <Layout><Orders /></Layout> },
    { path: "/profile", element: <Layout><Profile /></Layout> },
    { path: "/product/:id", element: <Layout><ProductDetails /></Layout> },
    { path: "/product/addRams", element: <Layout><AddRams /></Layout> },
    { path: "/product/addSize", element: <Layout><AddSize /></Layout> },
    { path: "/product/addWieght", element: <Layout><AddWieght /></Layout> },
    { path: "/bannerV1/list", element: <Layout><BannerV1List /></Layout> },
    { path: "/blog/list", element: <Layout><BlogList /></Layout> },
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

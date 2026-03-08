import './App.css'
import './responsive.css'
import React, { createContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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
import BannerV2List from './Pages/Banners2/BannerV2List';
import BannerV3List from './Pages/Banners3/BannerV3List';
import BlogList from './Pages/Blog';
import AdminChat from './Components/AdminChat';

import { fetchDataFromApi } from './utils/api';
import Layout from './Components/Layout';

const MyContext = createContext();

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const { isLogin, loadingUser } = React.useContext(MyContext);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="mb-3 text-gray-600">Loading...</p>
          <div className="inline-block">
            <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return isLogin ? children : <Navigate to="/login" replace />;
};

function App() {
  const [userData, setUserData] = useState(null);
  const [isToggleSidebar, setIsToggleSidebar] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ added
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
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  };

  const handleSessionExpire = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    setIsLogin(false);
    setUserData(null);
    openAlertBox("error", "Your session is expired, please login again!");
  };

  // ✅ Token check
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token) {
      fetchDataFromApi("/auth/user-dtails", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res?.error === false) {
            setUserData(res.data);
            setIsLogin(true);
          } else {
            handleSessionExpire();
          }
          setLoadingUser(false);
        })
        .catch(() => {
          handleSessionExpire();
          setLoadingUser(false);
        });
    } else {
      setIsLogin(false);
      setLoadingUser(false);
    }
  }, []);

  // Category + Window resize
  useEffect(() => {
    getCat();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    loadingUser,
    setLoadingUser,
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

  const router = createBrowserRouter([
    { path: "/", element: <Navigate to={isLogin ? "/dashboard" : "/login"} replace /> },
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify-account", element: <VerifyAccount /> },
    { path: "/change-password", element: <ChangePassword /> },

    { path: "/dashboard", element: <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute> },
    { path: "/products", element: <PrivateRoute><Layout><Products /></Layout></PrivateRoute> },
    { path: "/homeSliderlist", element: <PrivateRoute><Layout><HomeSliderBanners /></Layout></PrivateRoute> },
    { path: "/Categorylist", element: <PrivateRoute><Layout><CategoryList /></Layout></PrivateRoute> },
    { path: "/SubCategorylist", element: <PrivateRoute><Layout><SubCategoryList /></Layout></PrivateRoute> },
    { path: "/users", element: <PrivateRoute><Layout><Users /></Layout></PrivateRoute> },
    { path: "/orders", element: <PrivateRoute><Layout><Orders /></Layout></PrivateRoute> },
    { path: "/profile", element: <PrivateRoute><Layout><Profile /></Layout></PrivateRoute> },
    { path: "/product/:id", element: <PrivateRoute><Layout><ProductDetails /></Layout></PrivateRoute> },
    { path: "/product/addRams", element: <PrivateRoute><Layout><AddRams /></Layout></PrivateRoute> },
    { path: "/product/addSize", element: <PrivateRoute><Layout><AddSize /></Layout></PrivateRoute> },
    { path: "/product/addWieght", element: <PrivateRoute><Layout><AddWieght /></Layout></PrivateRoute> },
    { path: "/bannerV1/list", element: <PrivateRoute><Layout><BannerV1List /></Layout></PrivateRoute> },
    { path: "/bannerV2/list", element: <PrivateRoute><Layout><BannerV2List /></Layout></PrivateRoute> },
    { path: "/bannerV3/list", element: <PrivateRoute><Layout><BannerV3List /></Layout></PrivateRoute> },
    { path: "/blog/list", element: <PrivateRoute><Layout><BlogList /></Layout></PrivateRoute> },
    { path: "/chat", element: <PrivateRoute><Layout><AdminChat /></Layout></PrivateRoute> },
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster />
    </MyContext.Provider>
  );
}

export default App;
export { MyContext };
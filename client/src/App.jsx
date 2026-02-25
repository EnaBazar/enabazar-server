import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import './responsive.css';
import toast, { Toaster } from 'react-hot-toast';

// Components & Pages
import Header from './Components/Header';
import Footer from './Components/Footer';
import CustomerChat from './Components/CustomerChat';
import Home from './Pages/Home';
import ProductListing from './Pages/ProductListing';
import ProductDetails from './Pages/ProductDetails';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CartPage from './Pages/Cart';
import Verify from './Pages/Verify';
import VerifyOtp from './Pages/Register/VerifyOtp';
import ForgotPassword from './Pages/ForgotPassword';
import CheckOut from './Pages/CheckOut';
import MyAccount from './Pages/MyAccount';
import MyList from './Pages/MyList';
import Orders from './Pages/Orders';
import Address from './Pages/MyAccount/address';
import { OrderSuccess } from './Pages/Orders/success';
import { OrderFailed } from './Pages/Orders/failed';
import OrderReceipt from './Pages/Orders/OrderReceipt';
import SearchPage from './Pages/Search';
import BlogDetails from './Components/BlogItem/BlogDeatils';
import About from './Pages/AboutUs/aboutUs';
import Terms from './Pages/TermsConditions/TermsConditions';
import Delivery from './Pages/Delivery/delivery';
import LegalNotice from './Pages/LagelNotice/lagelNotice';
import HelpCenter from './Pages/HelpCenter/helpCenter';
import SecurePayment from './Pages/SequrePayment/sequrePayment';

import { fetchDataFromApi, postData } from './utils/api';

// Create context
export const MyContext = createContext();

const App = () => {
  // General state
  const [openProductDetailsModel, setOpenProductDetailsModel] = useState({ open: false, item: {} });
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [catData, setCatData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAdded, setIsAdded] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isOpenSearchPanel, setIsOpenSearchPanel] = useState(false);

  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);
  const [openLoginPanel, setOpenLoginPanel] = useState(false);
  const [openRegisterPanel, setOpenRegisterPanel] = useState(false);

  const [addressMode, setAddressMode] = useState("add");
  const [addressId, setAddressId] = useState("");
  const [loginPrefill, setLoginPrefill] = useState({ name: "", mobile: "" });

  const apiUrl = import.meta.env.VITE_API_URL;

  // User / login state
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem("isLogin") === "true");
  const [userData, setUserData] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  // Alerts
  const openAlertBox = (status, msg) => {
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  };

  // Handle session expiry
  const handleSessionExpire = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("userData");
    localStorage.setItem("isLogin", "false");
    setIsLogin(false);
    setUserData(null);
    openAlertBox("error", "Your session is expired, please login again!");
    window.location.href = "/login";
  };

  // Fetch user details
  const getUserDeatils = () => {
    fetchDataFromApi(`/auth/user-dtails`)
      .then((res) => {
        if (res?.error === false) {
          setUserData(res.data);
          localStorage.setItem("userData", JSON.stringify(res.data));
        } else {
          handleSessionExpire();
        }
      })
      .catch(() => handleSessionExpire());
  };

  // Cart & MyList fetch
  const getCartItems = () => {
    fetchDataFromApi(`/cart/get`).then((res) => {
      if (res?.error === false) setCartData(res.data);
    });
  };

  const getMyListData = () => {
    fetchDataFromApi(`/myList/get`).then((res) => {
      if (res?.error === false) setMyListData(res.data);
    });
  };

  // Add to cart
  const addToCart = (product, userId, quantity) => {
    if (!userId) {
      openAlertBox("error", "You are not logged in! Please login first.");
      return;
    }
    const data = {
      productTitle: product?.name,
      image: product?.image,
      rating: product?.rating,
      price: product?.price,
      oldprice: product?.oldprice,
      discount: product?.discount,
      brand: product?.brand,
      quantity: quantity,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      weight: product?.weight,
      size: product?.size,
      Ram: product?.Ram,
      userId: userId,
    };

    postData("/cart/create", data).then((res) => {
      if (res?.error === false) {
        openAlertBox("success", res?.message);
        getCartItems();
      } else {
        openAlertBox("error", res?.message);
      }
    });
  };

  // Product modal handlers
  const handleOpenProductDetailsModel = (status, item) => {
    setOpenProductDetailsModel({ open: status, item: item || {} });
  };
  const handleCloseProductDetailsModel = () => setOpenProductDetailsModel({ open: false, item: {} });

  // Panels toggle
  const toggleCartPanel = (newOpen) => () => setOpenCartPanel(newOpen);
  const toggleLoginPanel = (newOpen) => () => setOpenLoginPanel(newOpen);
  const toggleRegisterPanel = (newOpen) => () => setOpenRegisterPanel(newOpen);
  const toggleAddressPanel = (newOpen) => {
    if (!newOpen) setAddressMode("add");
    setOpenAddressPanel(newOpen);
  };

  // Fetch categories & handle window resize
  useEffect(() => {
    fetchDataFromApi("/category").then((res) => {
      if (res?.error === false) setCatData(res.data);
    });

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check login & fetch initial data on page load
  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      setIsLogin(true);
      getCartItems();
      getMyListData();
      getUserDeatils();
    } else {
      setIsLogin(false);
    }
  }, []);

  // Context values
  const values = {
    setOpenProductDetailsModel,
    handleOpenProductDetailsModel,
    setOpenCartPanel,
    toggleCartPanel,
    toggleLoginPanel,
    openCartPanel,
    setOpenAddressPanel,
    toggleAddressPanel,
    openAddressPanel,
    openAlertBox,
    isLogin,
    setIsLogin,
    apiUrl,
    setUserData,
    userData,
    catData,
    setCatData,
    addToCart,
    cartData,
    getCartItems,
    setCartData,
    openProductDetailsModel,
    handleCloseProductDetailsModel,
    myListData,
    getMyListData,
    setMyListData,
    getUserDeatils,
    setAddressMode,
    addressMode,
    setAddressId,
    addressId,
    setSearchData,
    searchData,
    windowWidth,
    setWindowWidth,
    isOpenSearchPanel,
    setIsOpenSearchPanel,
    setIsAdded,
    isAdded,
    openLoginPanel,
    setOpenLoginPanel,
    openRegisterPanel,
    setOpenRegisterPanel,
    toggleRegisterPanel,
    loginPrefill,
    setLoginPrefill,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<ProductListing />} />
            <Route path="/Product/:id" element={<ProductDetails />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/checkout" element={isLogin ? <CheckOut /> : <Navigate to="/login" replace />} />
            <Route path="/my-account" element={isLogin ? <MyAccount /> : <Navigate to="/login" replace />} />
            <Route path="/my-list" element={isLogin ? <MyList /> : <Navigate to="/login" replace />} />
            <Route path="/oders" element={isLogin ? <Orders /> : <Navigate to="/login" replace />} />
            <Route path="/order/success" element={isLogin ? <OrderSuccess /> : <Navigate to="/login" replace />} />
            <Route path="/order/failed" element={isLogin ? <OrderFailed /> : <Navigate to="/login" replace />} />
            <Route path="/order/receipt" element={isLogin ? <OrderReceipt /> : <Navigate to="/login" replace />} />
            <Route path="/address" element={isLogin ? <Address /> : <Navigate to="/login" replace />} />
            <Route path="/search/:keyword" element={<SearchPage />} />
            <Route path="/aboutUs" element={<About />} />
            <Route path="/Terms_Conditions" element={<Terms />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/ligalNotice" element={<LegalNotice />} />
            <Route path="/helpCenter" element={<HelpCenter />} />
            <Route path="/securePayment" element={isLogin ? <SecurePayment /> : <Navigate to="/login" replace />} />
          </Routes>

          <CustomerChat user={userData} />
          <Footer />
        </MyContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  );
};

export default App;
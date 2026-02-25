
import React, { useState,useEffect } from 'react';
import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import './App.css'
import './responsive.css'
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import ProductListing from './Pages/ProductListing'
import ProductDetails from './Pages/ProductDetails'
import { createContext } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CartPage from './Pages/Cart';
import Verify from './Pages/Verify';
import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './Pages/ForgotPassword';
import CheckOut from './Pages/CheckOut';
import MyAccount from './Pages/MyAccount';
import MyList from './Pages/MyList';
import Orders from './Pages/Orders';
import { fetchDataFromApi, postData } from './utils/api';
import Address from './Pages/MyAccount/address';
import { OrderSuccess } from './Pages/Orders/success';
import { OrderFailed } from './Pages/Orders/failed';
import SearchPage from './Pages/Search';
import BlogDetails from './Components/BlogItem/BlogDeatils';
import About from './Pages/AboutUs/aboutUs';
import Terms from './Pages/TermsConditions/TermsConditions';
import Delivery from './Pages/Delivery/delivery';
import LegalNotice from './Pages/LagelNotice/lagelNotice';
import HelpCenter from './Pages/HelpCenter/helpCenter';
import SecurePayment from './Pages/SequrePayment/sequrePayment';
import OrderReceipt from './Pages/Orders/OrderReceipt ';

import CustomerChat from './Components/CustomerChat';
import VerifyOtp from './Pages/Register/VerifyOtp';






const MyContext =createContext();
const App =() => {
  const [openProductDetailsModel, setOpenProductDetailsModel] = useState({
  open:false,
  item:{}
  });
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
const [otpData, setOtpData] = useState(null);
  const [catData, setCatData]= useState([]);
  const [cartData, setCartData]= useState([]);
  const [addressMode, setAddressMode]= useState("add");
  const [addressId, setAddressId]= useState("");
  const [myListData, setMyListData]= useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);
  const [openLoginPanel, setOpenLoginPanel] = useState(false);
  const [openRegisterPanel, setOpenRegisterPanel] = useState(false);
   const [openVerifyOtpPanel, setOpenVerifyOtpPanel] = useState(false);
  const [isOpenSearchPanel,setIsOpenSearchPanel] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAdded, setIsAdded] = useState(false);
  
  
  const [loginPrefill, setLoginPrefill] = useState({
  name: "",
  mobile: ""
});
  
  const openOtpPanel = (data) => {
  setOtpData(data);           // data = { mobile: "017xxxxxxx" }
  setOpenVerifyOtpPanel(true); // OTP Panel খোলা হবে
};
  const closeOtpPanel = () => {
    setOpenVerifyOtpPanel(false);
    setOtpData(null);
  };


  const handleOpenProductDetailsModel = (status, item) => {


      setOpenProductDetailsModel({
      open: status,
      item: item
      });
    }

  const handleSessionExpire = () => {
  localStorage.removeItem("accesstoken");
  localStorage.removeItem("refreshtoken");
  localStorage.removeItem("userData");

  setIsLogin(false);
  setUserData(null);

  openAlertBox("error", "Your session is expired, please login again!");

  window.location.href = "/login";
};



  const handleCloseProductDetailsModel = () => {
  setOpenProductDetailsModel({
      open: false,
      item: {}
      });
  };
  
  
  const toggleCartPanel = (newOpen) => () => {
  setOpenCartPanel(newOpen);
  };
  
const [isLogin, setIsLogin] = useState(() => {
  return localStorage.getItem("isLogin") === "true";
});

const [userData, setUserData] = useState(() => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
});
    const toggleLoginPanel = (newOpen) => () => {
  setOpenLoginPanel(newOpen);
  };

   const toggleRegisterPanel = (newOpen) => () => {
  setOpenRegisterPanel(newOpen);
  };

 const toggleVerifyOtpPanel = (newOpen) => () => {
  setOpenVerifyOtpPanel(newOpen);
  };

  const toggleAddressPanel = (newOpen) => () => {

    if(newOpen === false){
      setAddressMode("add")
    }
  setOpenAddressPanel(newOpen);

  };
  
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
}, []);   // only run on page load

  
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
    .catch(() => {
      handleSessionExpire();
    });
};






        useEffect(() => {

  const token = localStorage.getItem("accesstoken");

  if (token) {
    setIsLogin(true);
    getCartItems();
    getMyListData();
    getUserDeatils();
  } else {
    setIsLogin(false);
  }


        fetchDataFromApi("/category")
        .then((res) => {
        if (res?.error === false) {
        setCatData(res?.data);
        }
        })  

    const handleResize = () => {
    setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
    window.removeEventListener("resize", handleResize);
    };
        },[]);
          
  
  const openAlertBox=(status,msg)=>{
    if(status==="success"){
    toast.success(msg);
    }
    if(status==="error"){
    toast.error(msg);
    }
    }
  
  
  const addToCart=(products, userId, quantity)=>{
    if(userId===undefined){
        openAlertBox("error","You are not login Please login again!");
        return false;
    }
    const data={
        productTitle:products?.name,
            image:products?.image,
            rating:products?.rating,
            price:products?.price,
            oldprice:products?.oldprice,
            discount:products?.discount,
            brand:products?.brand,
            quantity:quantity,
            subTotal:parseInt(products?.price * quantity),
            productId:products?._id,
            countInStock:products?.countInStock,
            weight:products?.weight,
            size:products?.size,
            Ram:products?.Ram,
            userId:userId,
            
    }
    
 postData("/cart/create", data).then((res)=>{
   
 if(res?.error===false){   
 openAlertBox("success", res?.message);  
 getCartItems();
 }else{  
 openAlertBox("error", res?.message);
 } 
 })
 }
  
  const getCartItems=()=>{
  fetchDataFromApi(`/cart/get`).then((res)=>{
  if(res?.error===false){
  setCartData(res?.data);
   
   }
 })
  }

  const getMyListData=()=>{
  fetchDataFromApi(`/myList/get`).then((res)=>{
  if(res?.error===false){
  setMyListData(res?.data);  
}
})
}
const values ={
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
    openVerifyOtpPanel, 
    setOpenVerifyOtpPanel,
    toggleVerifyOtpPanel,
     otpData,
  openOtpPanel,
  closeOtpPanel
};
return (
<>
<BrowserRouter>
<MyContext.Provider value={values}>
<Header/>
<Routes>

<Route path={"/"} exact={true} element={<Home/>}/>
<Route path={"/:id"} exact={true} element={<ProductListing/>}/>
<Route path={"/Product/:id"} exact={true} element={<ProductDetails/>}/>
<Route path={"/blog/:id"} exact={true} element={<BlogDetails />} />
<Route path={"/login"} exact={true} element={<Login/>}/>
<Route path={"/register"} exact={true} element={<Register/>}/>
<Route path={"/cart"} exact={true} element={<CartPage/>}/>
<Route path={"/verify"} exact={true} element={<Verify/>}/>
<Route path={"/forgot-password"} exact={true} element={<ForgotPassword/>}/>
<Route path={"/checkout"} exact={true} element={<CheckOut/>}/>
<Route path={"/my-account"} exact={true} element={<MyAccount/>}/>
<Route path={"/my-list"} exact={true} element={<MyList/>}/>
<Route path={"/oders"} exact={true} element={<Orders/>}/>
<Route path={"/order/success"} exact={true} element={<OrderSuccess/>}/>
<Route path={"/order/failed"} exact={true} element={<OrderFailed/>}/>
<Route path={"/order/receipt"} exact={true} element={<OrderReceipt/>}/>
<Route path={"/address"} exact={true} element={<Address/>}/>
<Route path={"/verify-otp"} exact={true} element={<VerifyOtp/>}/>
 <Route path="/search/:keyword" element={<SearchPage />} />
<Route path={"/aboutUs"} exact={true} element={<About/>}/>
<Route path={"/Terms_Conditions"} exact={true} element={<Terms/>}/>
<Route path={"/delivery"} exact={true} element={<Delivery/>}/>
<Route path={"/ligalNotice"} exact={true} element={<LegalNotice/>}/>
<Route path={"/helpCenter"} exact={true} element={<HelpCenter/>}/>
<Route path={"/securePayment"} exact={true} element={<SecurePayment/>}/>
 
</Routes>

<CustomerChat user={userData}/>

<Footer/>
</MyContext.Provider>
</BrowserRouter>
<Toaster/>




</>
  );
};

export default App;
export  {MyContext}

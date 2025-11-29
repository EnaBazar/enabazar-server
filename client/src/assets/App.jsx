
import React, { useState,useEffect } from 'react';
import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import ProductListing from './Pages/ProductListing'
import ProductDetails from './Pages/ProductDetails'
import { createContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './Components/ProductZoom';
import {IoCloseSharp} from 'react-icons/io5';
import ProductDetailsComponant from './Components/ProductDetailsComponant';
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
import { fetchDataFromApi } from './utils/api';
import Address from './Pages/MyAccount/address';


const MyContext =createContext();


const App =() => {
  
  const [openProductDetailsModel, setOpenProductDetailsModel] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [isLogin,setIsLogin] = useState(false);
  const [userData,setUserData] = useState(null);
  
  
  
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const [openCartPanel, setOpenCartPanel] = useState(false);
  
  const handleCloseProductDetailsModel = () => {
    setOpenProductDetailsModel(false);
  };
  
  
  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };
  
  useEffect(()=>{
      const token = localStorage.getItem('accesstoken') ;
      if(token !== undefined && token !== null && token !== ""){
        setIsLogin(true);
        
        fetchDataFromApi(`/auth/user-dtails`).then((res)=>{    
          setUserData(res.data);
   
          if(res?.response?.data?.error===true){
            
            if(res?.response?.data?.message==="You have not login"){
              
              localStorage.removeItem("accesstoken");
              localStorage.removeItem("refreshtoken");
              openAlertBox("error","Your session is closed please login again!");
              
              window.location.href = "/login"
              
              setIsLogin(false)
            }
          }
          
        })
      }else{
        setIsLogin(false);
      }
       
  },[isLogin])
  
  
  
  const openAlertBox=(status,msg)=>{
    
    if(status==="success"){
      
      toast.success(msg);
    }
    if(status==="error"){
      
      toast.success(msg);
    }
  }
  
  
  
  
const values ={

  setOpenProductDetailsModel,
  setOpenCartPanel,
  toggleCartPanel,
  openCartPanel,
  openAlertBox,
  isLogin,
  setIsLogin,
  apiUrl,
  setUserData,
  userData

};
  return (
<>

<BrowserRouter>
<MyContext.Provider value={values}>
<Header/>
<Routes>

<Route path={"/"} exact={true} element={<Home/>}/>
<Route path={"/ProductListing"} exact={true} element={<ProductListing/>}/>
<Route path={"/Product/:id"} exact={true} element={<ProductDetails/>}/>
<Route path={"/login"} exact={true} element={<Login/>}/>
<Route path={"/register"} exact={true} element={<Register/>}/>
<Route path={"/cart"} exact={true} element={<CartPage/>}/>
<Route path={"/verify"} exact={true} element={<Verify/>}/>
<Route path={"/forgot-password"} exact={true} element={<ForgotPassword/>}/>
<Route path={"/checkout"} exact={true} element={<CheckOut/>}/>
<Route path={"/my-account"} exact={true} element={<MyAccount/>}/>
<Route path={"/my-list"} exact={true} element={<MyList/>}/>
<Route path={"/oders"} exact={true} element={<Orders/>}/>
<Route path={"/address"} exact={true} element={<Address/>}/>

</Routes>
<Footer/>
</MyContext.Provider>
</BrowserRouter>
<Toaster/>
<Dialog
 fullWidth={fullWidth}
 maxWidth={maxWidth}
        open={openProductDetailsModel}
        onClose={handleCloseProductDetailsModel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='productDetailsModal'
      >
       
        <DialogContent>
        <div className='flex items-center w-full productDetailsModalContainer relative'>
        <Button className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !absolute top-[15px] right-[15px] !text-[#ff5252]'
        onClick={handleCloseProductDetailsModel}><IoCloseSharp className='text-[25px]'/></Button>
        
        
        <div className='col1 w-[50%] '>
        <ProductZoom />
        </div>
        
        
        <div className='col1 w-[50%] py-5 px-10 pr-10 productContent'>
        <ProductDetailsComponant/>
        </div>
        
        
        
        </div>
        </DialogContent>
      
      </Dialog>



</>
  );
};

export default App;
export  {MyContext}

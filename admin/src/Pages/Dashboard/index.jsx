import React, { useState,PureComponent, useContext, useEffect } from 'react'
import DashboardBoxes from '../../Components/DashboardBoxes';
import {  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Button from '@mui/material/Button';
import { FaPlus } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa6'
import { FaAngleUp } from 'react-icons/fa6'
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai'
import { IoMdAdd, IoMdRefresh } from 'react-icons/io';
import { FaRegEye } from 'react-icons/fa6'
import { GoTrash } from 'react-icons/go'
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Rating from '@mui/material/Rating';
import SearchBox from '../../Components/SearchBox';
import Users from '../Users';



import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import pdfMake from "../../Fonts/pdfFonts.js";
import companyLogo from "../../assets/logo-base64"; // Base64 লোগো ইমেজ


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'product', label: 'PRODUCT', minWidth: 150 },
  { id: 'category', label: 'CATEGORY', minWidth: 100 },
  { id: 'subcategory', label: 'SUB-CATEGORY', minWidth: 150 },
  { id: 'price', label: 'PRICE', minWidth: 100 },
  { id: 'sale', label: 'SALES', minWidth: 100 },
    { id: 'rating', label: 'RATING', minWidth: 100 },
  { id: 'action', label: 'ACTION', minWidth: 120 },
];



function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}





const Dashboard = () => {   
        const context = useContext(MyContext);    
        const [productsubCat, setProductsubCat] = useState('');
        const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
        const [searchTerm, setSearchTerm] = useState("");
        const [productData, setProductData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [productCat, setProductCat] = useState('');
        const [filteredData, setFilteredData] = useState([]);
        const [sortedIds, setSortedIds] = useState([]);       
    
           const [ordersData, setOrdersData] = useState([])                            
   
         const [pageOrder,setPageOrder] = useState("")
    
         const [rowsPerPages] = useState(5);
         const [totalOrderData, setTotalOrderData] = useState([]);
         const [users, setUsers] = useState([]);
         const [allReviews, setAllReviews] = useState([]);
         const [ordersCount, setOrdersCount] = useState([]);
          const [allSaleAmount, setAllSaleAmount] = useState([]);
   const [chartData, setChartData] = useState([]);
   const [year, setYear] = useState(new Date().getFullYear());



  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpenOrderProduct, setIsOpenOrderProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");


  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);


  const handleChange = (event, id) => {
    const newStatus = event.target.value;
    editData(`/order/order-status/${id}`, { id, order_status: newStatus }).then((res) => {
      if (res?.data?.error === false) {
        context.openAlertBox("success", res?.data?.message);
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === id ? { ...o, order_status: newStatus } : o
          )
        );
      }
    });
  };






useEffect(() => {
  fetchOrders(currentPage);
}, [currentPage, searchQuery, startDate, endDate]);





  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const exportOrderInvoice = (order) => {
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: "NotoSansBangla",
        fontSize: 11,
      },
      content: [
        {
          columns: [
            { image: companyLogo, width: 70 },
            {
              stack: [
                { text: "EnaBazar.com", style: "companyName" },
                { text: "IslamPur Road,Feni,3900", fontSize: 10, color: "#555" },
                { text: "ফোন: 0167484746 | ইমেইল: EnaBazar@gmail.com", fontSize: 10, color: "#555" },
              ],
              margin: [10, 0, 0, 0],
            },
            {
              text: "অর্ডার ইনভয়েস",
              style: "invoiceTitle",
              alignment: "right",
            },
          ],
        },
        { canvas: [{ type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
        { text: "\n" },
        {
          columns: [
            { text: `অর্ডার আইডি: ${order?._id}`, bold: true },
            {
              text: `তারিখ: ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "--"}`,
              alignment: "right",
            },
          ],
        },
        { text: "\n" },
        {
          style: "sectionHeader",
          text: "গ্রাহকের তথ্য",
          margin: [0, 0, 0, 6],
        },
        {
          table: {
            widths: ["25%", "75%"],
            body: [
              ["নাম:", order?.userId?.name || "--"],
              ["ফোন:", order?.delivery_address?.mobile || "--"],
              ["ইমেইল:", order?.userId?.email || "--"],
              ["ঠিকানা:", `${order?.delivery_address?.address_line || "--"}, ${order?.delivery_address?.city || "--"}, ${order?.delivery_address?.state || ""}`],
              ["স্ট্যাটাস:", order?.order_status || "--"],
              ["পেমেন্ট:", order?.paymentId || "Cash on Delivery"],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 15],
        },
        {
          style: "sectionHeader",
          text: "পণ্যের তালিকা",
          margin: [0, 0, 0, 6],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              [
                { text: "প্রোডাক্ট", style: "tableHeader" },
                { text: "পরিমাণ", style: "tableHeader" },
                { text: "মূল্য", style: "tableHeader" },
                { text: "সাবটোটাল", style: "tableHeader" },
              ],
              ...order?.products?.map((item) => [
                item?.productTitle || "--",
                item?.quantity || 0,
                (item?.price || 0).toFixed(2),
                ((item?.quantity || 0) * (item?.price || 0)).toFixed(2),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          columns: [
            { text: "" },
            {
              width: "auto",
              table: {
                body: [
                  ["সাবটোটাল:", `${order?.subTotalAmt || 0}`],
                  ["ডেলিভারি চার্জ:", `${order?.delivery_charge || 0}`],
                  [
                    { text: "মোট:", bold: true },
                    { text: `${order?.totalAmt || 0}`, bold: true },
                  ],
                ],
              },
              layout: "noBorders",
            },
          ],
          margin: [0, 15, 0, 20],
        },
        {
          columns: [
            { text: "" },
            {
              stack: [
                { text: "Authorized Signature", alignment: "right", margin: [0, 40, 0, 0], italics: true },
                { canvas: [{ type: "line", x1: 350, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
              ],
            },
          ],
        },
        {
          text: "ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য!",
          style: "thankyou",
          alignment: "center",
          margin: [0, 40, 0, 0],
        },
      ],
      styles: {
        companyName: { fontSize: 14, bold: true, color: "#2c3e50" },
        invoiceTitle: { fontSize: 16, bold: true, color: "#e74c3c" },
        sectionHeader: { fontSize: 13, bold: true, color: "#2980b9" },
        tableHeader: {
          bold: true,
          fillColor: "#2980b9",
          color: "white",
          alignment: "center",
        },
        thankyou: { fontSize: 12, italics: true, color: "#27ae60" },
      },
    };

    pdfMake.createPdf(docDefinition).download(`order-${order?._id}.pdf`);
  };


const exportAllOrderDetailsPdf = (orders) => {
  const content = [];

  content.push({
    text: `সব অর্ডারের রিপোর্ট (${orders.length} টি অর্ডার)`,
    style: "header",
    margin: [0, 0, 0, 15],
  });

  const tableBody = [
    [
      { text: "অর্ডার ID", style: "tableHeader" },
      { text: "নাম", style: "tableHeader" },
      { text: "ফোন", style: "tableHeader" },
      { text: "ঠিকানা", style: "tableHeader" },
      { text: "স্ট্যাটাস", style: "tableHeader" },
      { text: "তারিখ", style: "tableHeader" },
      { text: "পেমেন্ট", style: "tableHeader" },
      { text: "মোট টাকা", style: "tableHeader" },
    ],
  ];

orders.forEach((order, index) => {
  content.push(
    { text: `অর্ডার #${index + 1}: ${order._id}`, style: "subHeader" },
    {
      table: {
        widths: ["25%", "75%"],
        body: [
          ["নাম:", order?.userId?.name || "--"],
          ["ফোন:", order?.delivery_address?.mobile || "--"],
          ["ঠিকানা:", `${order?.delivery_address?.address_line || "--"}, ${order?.delivery_address?.city || ""}`],
          ["স্ট্যাটাস:", order?.order_status || "--"],
          ["তারিখ:", new Date(order?.createdAt).toLocaleDateString()],
          ["পেমেন্ট:", order?.paymentId || "Cash on Delivery"],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 8],
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto"],
        body: [
          [
            { text: "প্রোডাক্ট", style: "tableHeader" },
            { text: "পরিমাণ", style: "tableHeader" },
            { text: "দাম", style: "tableHeader" },
            { text: "সাবটোটাল", style: "tableHeader" },
          ],
          ...order.products.map((p) => [
            p.productTitle || "--",
            p.quantity || 0,
            p.price?.toFixed(2) || "0.00",
            (p.quantity * p.price)?.toFixed(2) || "0.00",
          ]),
        ],
      },
      layout: "lightHorizontalLines",
    },
    {
      columns: [
        { text: "" },
        {
          width: "auto",
          table: {
            body: [
              ["Subtotal:", `${order?.subTotalAmt || 0}`],
              ["Delivery Charge:", `${order?.delivery_charge || 0}`],
              [
                { text: "মোট:", bold: true },
                { text: `${order?.totalAmt || 0}`, bold: true },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
      margin: [0, 10, 0, 20],
    }
  );

  // এখানে পেজ ব্রেক সরিয়ে দিলাম, আর কোনো কোড রাখলাম না
  // if (index !== orders.length - 1) {
  //   content.push({ text: "", pageBreak: "after" });
  // }
});


  content.push({
    table: {
      headerRows: 1,
      widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
      body: tableBody,
    },
    layout: "lightHorizontalLines",
  });

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [20, 30, 20, 30],
    defaultStyle: {
      font: "NotoSansBangla",
      fontSize: 9,
    },
    content,
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        alignment: "center",
        color: "#2c3e50",
      },
      tableHeader: {
        bold: true,
        fillColor: "#393a3bff",
        color: "white",
        alignment: "center",
        fontSize: 10,
      },
    },
  };

  pdfMake.createPdf(docDefinition).download("All_Orders_List.pdf");
};

const exportDeliveryLabel = (order) => {
  const docDefinition = {
    pageSize: { width: 300, height: 230 },
    pageMargins: [15, 15, 15, 15],
    defaultStyle: { font: "NotoSansBangla", fontSize: 10 },
    content: [
      {
        columns: [
          { image: companyLogo, width: 40 },
          {
            stack: [
              { text: "EnaBazar.com", bold: true, fontSize: 12 },
              { text: "ঠিকানা: IslamPur Road, Feni, 3900", fontSize: 8, color: "#555" },
              { text: "ফোন: 0167484746", fontSize: 8, color: "#555" },
            ],
            margin: [5, 0, 0, 0],
          },
        ],
      },
      { text: "\n" },
      { text: "ডেলিভারি ঠিকানা ", style: "header", alignment: "center", bold: true, fontSize: 12, margin: [0, 0, 0, 10] },
      {
        table: {
          widths: ["25%", "75%"],
          body: [
            ["নাম:", order?.userId?.name || "--"],
            ["ফোন:", order?.delivery_address?.mobile || "--"],
            ["ঠিকানা:", `${order?.delivery_address?.address_line || "--"}, ${order?.delivery_address?.city || ""}`],
            ["পেমেন্ট:", order?.paymentId || "Cash on Delivery"],
            ["মোট:", `${order?.totalAmt || 0} ৳`],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 30], // footer এর জন্য extra space
      },

      // ===== Footer manually placed =====
   {
  text: "আপনার ক্রয়ের জন্য ধন্যবাদ!\nwww.enabazar.com | সাপোর্ট: support@enabazar.com",
  fontSize: 8,
  color: "#666",
  alignment: "center",
  absolutePosition: { x: 15, y: 190 } // page bottom এর কাছাকাছি
}

    ],
    styles: {
      header: { fontSize: 12, bold: true },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};


       const isShowOrderProduct=(index)=>{
       if(isOpenOrderProduct===index){    
        setIsOpenOrderProduct(null);
       }else{
        setIsOpenOrderProduct(index);       
       }
     } 
       

       const toggleOrderProduct = (index) => {
         if (isOpenOrderProduct === index) {
           setIsOpenOrderProduct(null)
         } else {
           setIsOpenOrderProduct(index)
         }
       }
       // Fetch orders
  const fetchOrders = async (page = 1) => {
    const start = startDate ? `&startDate=${startDate}` : "";
    const end = endDate ? `&endDate=${endDate}` : "";
  
    fetchDataFromApi(
      `/order/order-list-admin?page=${page}&limit=8&search=${searchQuery}${start}${end}`
    ).then((res) => {
      if (res?.error === false) {
        setOrders(res?.data);
        setTotalPages(res?.totalPages);
        setCurrentPage(res?.currentPage);
      }
    });
  };
   
         useEffect(() => {
           
         fetchOrders(currentPage);
         fetchDataFromApi(`/order/count`).then((res)=>{
       if (res?.error === false){
       setOrdersCount(res?.ordersCount)
       }
       })
       }, [currentPage, searchQuery]);
   
       useEffect(()=>{
     
      getChartData()

  fetchDataFromApi("/auth/getAllUser").then((res)=>{
  if (res?.error === false){
    setUsers(res?.users)
  }
})

fetchDataFromApi("/auth/getAllReviews").then((res)=>{
  if (res?.error === false){
    setAllReviews(res?.reviews)
  }
})

fetchDataFromApi("/order/allSales").then((res)=>{
  if (res?.error === false){
    setAllSaleAmount(res?.totalSales)
  }
})

       },[])

 

       // Pagination
       const handlePageChange = (event, value) => {
         setCurrentPage(value);
         setIsOpenOrderProduct(null); // পেজ বদলালে expand বন্ধ হবে
       };
     
       // Filter orders on frontend (optional if backend search not implemented)
       const filteredOrders = orders?.filter(order =>
            
         order?.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order?.updatedAt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order?.delivery_address?.mobile?.includes(searchQuery) ||
            order?.delivery_address?.city?.includes(searchQuery) ||
             order?.delivery_address?.userId?.includes(searchQuery)
       );
     
      const getProducts = async () => {
           setLoading(true);
           try {
             const res = await fetchDataFromApi("/product/getAllProduct");
             if (res?.error === false) {
               const productArr = res.products.map(product => ({ ...product, checked: false })).reverse();
               setProductData(productArr);
               setFilteredData(productArr);
             }
           } catch (err) {
             console.error(err);
           } finally {
             setLoading(false);
           }
         };
         


// filter products by searchTerm
useEffect(() => {
  if (!searchTerm) {
    setFilteredData(productData);
  } else {
    const filtered = productData.filter((p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.catName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subCat?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }
}, [searchTerm, productData]);


           useEffect(() => {
             getProducts();
           }, [context?.isOpenFullScreenPanel]);
           
         // Reset filters and reload
  const handleRefresh = () => {
    setSearchTerm('');
    setProductCat('');
    setProductsubCat('');
    setProductThirdLevelCat('');
    getProducts();
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updated = filteredData.map(p => ({ ...p, checked: isChecked }));
    setFilteredData(updated);
    setSortedIds(isChecked ? updated.map(p => p._id).sort() : []);
  };

     const [page, setPage] = React.useState(0);
     const [rowsPerPage, setRowsPerPage] = React.useState(10);
   
     const handleChangePage = (event, newPage) => {
       setPage(newPage);
     };
     
     const [categoryFilterVal, setcategoryFilterVal] = React.useState(``);
     const handleChangeCatFilter = (event) => {
      setcategoryFilterVal(event.target.value);
    };
     
   const [chart1Data,setChart1Data] = useState([
     
    {
      name: 'JAN',
      TotalSale: 4000,
      TotalUser: 2400,
      amt: 2400,
    },
    {
      name: 'FEB',
      TotalSale: 3000,
      TotalUser: 1398,
      amt: 2210,
    },
    {
      name: 'MAR',
      TotalSale: 2000,
      TotalUser: 9800,
      amt: 2290,
    },
    {
      name: 'APL',
      TotalSale: 2780,
      TotalUser: 3908,
      amt: 2000,
    },
    {
      name: 'MAY',
      TotalSale: 1890,
      TotalUser: 4800,
      amt: 2181,
    },
    {
      name: 'Jun',
      TotalSale: 2390,
      TotalUser: 3800,
      amt: 2500,
    },
    {
      name: 'JUL',
      TotalSale: 3490,
      TotalUser: 4300,
      amt: 2100,
    },
    {
      name: 'AGUS',
      TotalSale: 2000,
      TotalUser: 9800,
      amt: 2290,
    },
    {
      name: 'SEP',
      TotalSale: 2780,
      TotalUser: 3908,
      amt: 2000,
    },
    {
      name: 'OCT',
      TotalSale: 1890,
      TotalUser: 4800,
      amt: 2181,
    },
    {
      name: 'NOV',
      TotalSale: 2390,
      TotalUser: 3800,
      amt: 2500,
    },
    {
      name: 'DEC',
      TotalSale: 3490,
      TotalUser: 4300,
      amt: 2100,
    },
   ])
   
   
     const handleChangeRowsPerPage = (event) => {
       setRowsPerPage(+event.target.value);
       setPage(0);
     };
     

  const handleChangeProductCat = (e) => fetchByCategory(`/product/getAllProductByCatId/${e.target.value}`, setProductCat);
  const handleChangeProductsubCat = (e) => fetchByCategory(`/product/getAllProductBySubCatId/${e.target.value}`, setProductsubCat);
  const handleChangeProductThirdLevelCat = (e) => fetchByCategory(`/product/getAllProductByThirdCatId/${e.target.value}`, setProductThirdLevelCat); 
  
    const fetchByCategory = async (url, setter) => {
      setLoading(true);
      try {
        const res = await fetchDataFromApi(url);
        if (res?.error === false) {
          const products = res.products.map(p => ({ ...p, checked: false })).reverse();
          setProductData(products);
          setFilteredData(products);
          setter(url.split('/').pop());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
 
    const handleCheckedboxChange = (e, id) => {
      const updated = filteredData.map(p => p._id === id ? { ...p, checked: !p.checked } : p);
      setFilteredData(updated);
      setSortedIds(updated.filter(p => p.checked).map(p => p._id).sort());
    };
  
    const deleteProduct = async (id) => {
      await deleteData(`/product/${id}`);
      getProducts();
      context.openAlertBox("success", "Product Deleted");
    };
  
    const deleteMultiplePoduct = async () => {
      if (sortedIds.length === 0) return context.openAlertBox("warning", "No product selected");
      for (let id of sortedIds) {
        await deleteData(`/product/${id}`);
      }
      context.openAlertBox("success", "Selected products deleted");
      getProducts();
      setSortedIds([]);
    };
  

const getChartData = async () => {
  try {
    // একসাথে API কল
    const [usersRes, salesRes] = await Promise.all([
      fetchDataFromApi("/order/users"),
      fetchDataFromApi("/order/sales")
    ]);

    const usersData = usersRes?.totalUsers || [];
    const salesData = salesRes?.monthlySales || [];

    // মাসের নাম অনুযায়ী merge করা
    const mergedData = usersData.map((userMonth, index) => ({
      name: userMonth.name,
      TotalUsers: userMonth.totalUsers || 0,
      TotalSales: salesData[index]?.totalSales || 0
    }));

    setChartData(mergedData);
    console.log("Merged Chart Data:", mergedData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};





  return ( 
        <> 
 <div className='w-full py-2 bg-[#f1faff] px-5 border border-[rgba(0,0,0,0.2)] flex items-center gap-8 mb-5 justify-between rounded-md'>
 <div className='info'>
<h1 className='text-[30px] font-bold leading-10 mb-3'>
  Good Morning,<br />
<span className='text-blue-500 !ml-auto'> {context?.userData?.name || "User"}</span> 
</h1>
  <p>Here`s what happning on your store today. See the statistics at once.</p>
  <br/>
  <Button className='btn-blue !capitalize'
  onClick={()=>context.setIsOpenFullScreenPanel({
    open:true,
    model:"Add Product"
     
   })}
  
  ><FaPlus/>Add Product</Button>
 </div>
 <img src='src/assets/logo.png' className='w-[250px] hidden lg:block'/>
 </div>         


{
  productData?.length !== 0 && users?.length !== 0 && allReviews?.length !== 0 && 
  <DashboardBoxes orders={ordersCount} products={productData?.length} totalsSalesAmount={allSaleAmount} users={users?.length}
  reviews={allReviews?.length} category={context?.catData?.length} 
  /> 
}


<div className='card my-5 shadow-md mt-9 sm:rounded-lg backdrop-blur-md bg-#f2f2f2 '>
 
<div className='flex flex-col md:flex-row items-start md:items-center justify-between py-0 mt-3 gap-3'>
  {/* Title */}
  <h2 className='text-[18px] md:text-[20px] font-[600]'>
    Products{" "}
    <span className='text-[12px] font-[600]'>(Material UI Table)</span>
  </h2>

  {/* Action Buttons */}
  <div className='w-full md:w-auto flex items-center gap-2 justify-start md:justify-end overflow-x-auto'>
    <Button
      onClick={handleRefresh}
      variant="outlined"
      className='btn-sm whitespace-nowrap'
      size="small"
      startIcon={<IoMdRefresh />}
    >
      Refresh
    </Button>

    {sortedIds.length !== 0 && (
      <Button
        variant="contained"
        className='btn-sm whitespace-nowrap'
        size="small"
        color="error"
        onClick={deleteMultiplePoduct}
      >
        Delete
      </Button>
    )}

    <Button className='!bg-green-600 btn-sm !text-white whitespace-nowrap'>
      Export
    </Button>

    <Button
      className='btn-blue btn-sm !text-white whitespace-nowrap'
      onClick={() =>
        context.setIsOpenFullScreenPanel({ open: true, model: 'Add Product' })
      }
    >
      <IoMdAdd className='text-white text-[20px]' />
      Add Product
    </Button>
  </div>
</div>



        <div className='card my-5 shadow-md sm:rounded-lg bg-white'>
        <div className='flex flex-wrap w-full px-5 gap-4 md:gap-6'>
  {/* Category Selectors */}
  <div className='w-full sm:w-[48%] lg:w-[17%] min-w-[140px]'>
    <h4 className='text-[14px] font-[600] mb-2'>Category By</h4>
    <Select
      className='w-full h-[30px]'
      size='small'
      value={productCat}
      onChange={handleChangeProductCat}
      displayEmpty
    >
      <MenuItem value="">All</MenuItem>
      {context.catData?.map(cat => (
        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
      ))}
    </Select>
  </div>

  {/* Sub Category */}
  <div className='w-full sm:w-[48%] lg:w-[17%] min-w-[140px]'>
    <h4 className='text-[14px] font-[600] mb-2'>Sub Category By</h4>
    <Select
      className='w-full h-[30px]'
      size='small'
      value={productsubCat}
      onChange={handleChangeProductsubCat}
      displayEmpty
    >
      <MenuItem value="">All</MenuItem>
      {context.catData?.flatMap(cat =>
        cat.children?.map(sub => (
          <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
        ))
      )}
    </Select>
  </div>

  {/* Third Level Category */}
  <div className='w-full sm:w-[48%] lg:w-[17%] min-w-[140px]'>
    <h4 className='text-[14px] font-[600] mb-2'>Third Level Category By</h4>
    <Select
      className='w-full h-[30px]'
      size='small'
      value={productThirdLevelCat}
      onChange={handleChangeProductThirdLevelCat}
      displayEmpty
    >
      <MenuItem value="">All</MenuItem>
      {context.catData?.flatMap(cat =>
        cat.children?.flatMap(sub =>
          sub.children?.map(third => (
            <MenuItem key={third._id} value={third._id}>{third.name}</MenuItem>
          ))
        )
      )}
    </Select>
  </div> 

  {/* Search Box */}
  <div className='w-full sm:w-[48%] lg:w-[30%] lg:ml-auto mt-5'>
    <h4 className='text-[14px] font-[600] mb-2 block lg:hidden'>Search</h4>
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
</div>


          <br />

          {loading ? (
            <div className="text-center py-10"><CircularProgress /></div>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell><Checkbox {...label} size='small' onChange={handleSelectAll} checked={filteredData.length > 0 && filteredData.every(item => item.checked)} /></TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id} className='!font-[600] !py-2' style={{ minWidth: column.minWidth }}>{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center">No Products Found</TableCell></TableRow>
                    ) : (
                      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                        <TableRow key={product._id}>
                          <TableCell><Checkbox {...label} size='small' checked={product.checked} onChange={(e) => handleCheckedboxChange(e, product._id)} /></TableCell>
                          <TableCell>
                            <div className='flex items-center gap-4 w-[300px]'>
                            <div className='img rounded-md overflow-hidden group'>
                            <Link to={`/product/${product._id}`}><LazyLoadImage className='w-full h-[65px] group-hover:scale-105' alt="product" effect="blur" src={product?.images?.[0] || '/placeholder.jpg'} /></Link>
                            </div>
                            <div className='info w-[75%]'>
                            <h3 className='font-[600] text-[12px] leading-4 hover:text-blue-700'><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
                            <span className='text-[12px]'>{product.brand}</span>
                            </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.catName}</TableCell>
                          <TableCell>{product.subCat}</TableCell>
                          <TableCell>
                            <div className='flex flex-col gap-1'><span className='line-through text-[15px] font-[600]'>&#2547; {product.price}</span><span className='text-blue-700 text-[15px] font-[600]'>&#2547; {product.oldPrice}</span></div>
                          </TableCell>
                          <TableCell><span className='text-[14px]'><span className='font-[600]'>{product.sale}</span> sale</span></TableCell>
                              <TableCell><Rating name='half-rating' size='small' defaultValue={product.Rating} 
                          
                              /></TableCell>
                          
                          
                          
                          <TableCell>
                            <div className='flex items-center gap-1'>
                              <Button className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !rounded-full' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Edit Product', id: product._id })}><AiOutlineEdit /></Button>
                              <Link to={`/product/${product._id}`}><Button className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !rounded-full'><FaRegEye /></Button></Link>
                              <Button className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !rounded-full' onClick={() => deleteProduct(product._id)}><GoTrash className='text-red-500' /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination rowsPerPageOptions={[5,25,100]} component="div" count={filteredData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
            </>
          )}
        </div>
      </div>





  <div className="card my-4 shadow-md sm:rounded-lg bg-white">
     <div className="flex flex-col gap-4 px-5 py-3">
  {/* Title and Order Count */}
  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
    <div>
      <h2 className="text-lg font-semibold">Recent Orders</h2>
      <p className="text-[12px] text-gray-600">
        There are <span className="font-bold text-[#ff5252]">{filteredOrders?.length}</span> orders in this page
      </p>
    </div>

    {/* Search Box */}
    <div className="w-full sm:w-[300px]">
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resetPage={(page) => setCurrentPage(page)}
      />
    </div>
  </div>

  {/* Date Filters + Buttons */}
  <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-4 w-full">
    {/* Start Date */}
    <div className="w-full sm:w-auto">
      <input
        type="date"
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          setCurrentPage(1);
        }}
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>

    {/* Separator */}
    <div className="text-gray-500 text-center sm:text-left">to</div>

    {/* End Date */}
    <div className="w-full sm:w-auto">
      <input
        type="date"
        value={endDate}
        onChange={(e) => {
          setEndDate(e.target.value);
          setCurrentPage(1);
        }}
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 w-full !mt-3 sm:w-auto">
      <Button
        variant="contained"
        color="primary"
     onClick={() => exportAllOrderDetailsPdf(orders)}
        className="w-full sm:w-auto"
      >
        Export PDF
      </Button>

      <button
        className="px-4 py-2 bg-gray-300 text-black  rounded-md w-full sm:w-auto"
        onClick={() => {
          setStartDate("");
          setEndDate("");
          fetchOrders(1);
        }}
      >
        Clear
      </button>
    </div>
  </div>
</div>


      <div className="relative overflow-x-auto max-h-[600px] pr-2 mb-4 mt-5">
        <table className="w-full min-w-[1200px] text-sm text-left">
          <thead className="uppercase bg-[rgba(0,0,0,0.1)] border-b-[gray]">
            <tr className="!text-[12px]">
              <th className="px-3 py-2">&nbsp;</th>
              <th className="px-3 py-2 whitespace-nowrap">Order Id</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2 hidden sm:table-cell">Phone</th>
              <th className="px-3 py-2 hidden lg:table-cell">Address</th>
              <th className="px-3 py-2 hidden lg:table-cell">Pincode</th>
              <th className="px-3 py-2">Subtotal</th>
              <th className="px-3 py-2 hidden sm:table-cell">D.Charge</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2 hidden lg:table-cell">Email</th>
              <th className="px-3 py-2 hidden sm:table-cell">User Id</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 hidden sm:table-cell">Date</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((order, index) => (
              <React.Fragment key={order?._id}>

                <tr className="bg-white border-b border-[rgba(0,0,0,0.1)]">
                  <td className="px-3 py-2">
                    <Button
                      className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]"
                      onClick={() => toggleOrderProduct(index)}
                    >
                      {isOpenOrderProduct === index ? <FaAngleUp /> : <FaAngleDown />}
                    </Button>
                  </td>
                  <td className="px-3 py-2 text-[#ff5252]">{order?._id}</td>
                  <td className="px-3 py-2">{order?.paymentId || "Cash on Delivery"}</td>
                  <td className="px-3 py-2">{order?.userId?.name}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{order?.delivery_address?.mobile || "--"}</td>
                  <td className="px-3 py-2 hidden lg:table-cell">{order?.delivery_address?.address_line}</td>
                  <td className="px-3 py-2 hidden lg:table-cell">{order?.delivery_address?.pincode || "--"}</td>
                  <td className="px-3 py-2">{order?.subTotalAmt}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{order?.delivery_charge}</td>
                  <td className="px-3 py-2">{order?.totalAmt}</td>
                  <td className="px-3 py-2 hidden lg:table-cell">{order?.userId?.email}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{order?.userId?._id}</td>
                  <td className="px-3 py-2">
                    <Select value={order?.order_status || ""} onChange={(e) => handleChange(e, order?._id)} className="w-full h-[30px]">
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"confirm"}>Confirm</MenuItem>
                      <MenuItem value={"delivered"}>Delivered</MenuItem>
                    </Select>
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">
                    {new Date(order?.createdAt?.split("T")[0]).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <Button variant="outlined" size="small" onClick={() => handleViewOrderDetails(order)}>View</Button>
                  </td>
                </tr>


     {isOpenOrderProduct === index && (
                  <tr>
                    <td colSpan="15" className="pl-4 bg-[#fafafa] overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="capitalize bg-[rgba(0,0,0,0.1)] border-b-[gray]">
                          <tr>
                            <th className="px-3 py-2 w-[150px]">Product Id</th>
                            <th className="px-3 py-2 w-[150px]">Product Name</th>
                            <th className="px-3 py-2">Image</th>
                            <th className="px-3 py-2">Quantity</th>
                            <th className="px-3 py-2">Price</th>
                            <th className="px-3 py-2">Sub Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.products?.map((item) => (
                            <tr key={item?.productId?._id} className="bg-white border-b border-[rgba(0,0,0,0.2)]">
                              <td className="px-3 py-2 text-[#ff5252]">{item?.productId}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{item?.productTitle}</td>
                              <td className="px-3 py-2">
                                <img
                                  src={item?.image || '/no-image.png'}
                                  alt={item?.productTitle}
                                  className="w-[50px] h-[50px] object-cover rounded-md"
                                />
                              </td>
                              <td className="px-3 py-2">{item?.quantity}</td>
                              <td className="px-3 py-2">{item?.price}</td>
                              <td className="px-3 py-2">{item?.quantity * item?.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}


              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end py-4">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="small" />
      </div>

      {/* ========= ORDER DETAILS MODAL ========= */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>অর্ডারের বিস্তারিত</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <div className="space-y-4 text-[14px]">
              <p><strong>নাম:</strong> {selectedOrder?.userId?.name}</p>
              <p><strong>ফোন:</strong> {selectedOrder?.delivery_address?.mobile}</p>
              <p><strong>ঠিকানা:</strong> {selectedOrder?.delivery_address?.address_line}, {selectedOrder?.delivery_address?.city}</p>
              <p><strong>স্ট্যাটাস:</strong> {selectedOrder?.order_status}</p>

              <div>
                <strong>পণ্য:</strong>
                <table className="w-full mt-2 border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">প্রোডাক্ট</th>
                      <th className="border px-2 py-1">পরিমাণ</th>
                      <th className="border px-2 py-1">দাম</th>
                      <th className="border px-2 py-1">সাবটোটাল</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{item.productTitle}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">{item.price}</td>
                        <td className="border px-2 py-1">{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </DialogContent>


      
        <DialogActions>
  <Button onClick={handleCloseModal} color="inherit">বন্ধ করুন</Button>

  {/* Delivery Label Print */}
  <Button variant="contained" color="primary" onClick={() => {
    exportDeliveryLabel(selectedOrder);
  }}>
    ডেলিভারি লেবেল
  </Button>

  {/* Invoice Download */}
  <Button variant="contained" color="secondary" onClick={() => {
    exportOrderInvoice(selectedOrder);
    handleCloseModal();
  }}>
    ডাউনলোড ইনভয়েস
  </Button>
</DialogActions>

      </Dialog>
    </div>

<div className='card my-4 shadow-md sm:rounded-lg bg-white'>
  {/* Section Header */}
  <div className='flex items-center justify-between px-5 py-5 pb-0'>
    <h2 className='text-[18px] font-[600]'>Total User's & Total Sales</h2>
  </div>

  {/* Cards Container */}
  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-5'>

    {/* Total Users Card */}
    <div className='card bg-white shadow-md sm:rounded-lg p-5 w-full'>
      <h2 className='text-[18px] font-[600] mb-3'>Total Users</h2>
      {chartData?.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalUsers" fill="#0858f7" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No users data available</p>
      )}
    </div>

    {/* Total Sales Card */}
    <div className='card bg-white shadow-md sm:rounded-lg p-5 w-full'>
      <h2 className='text-[18px] font-[600] mb-3'>Total Sales</h2>
      {chartData?.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalSales" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No sales data available</p>
      )}
    </div>

  </div>
</div>



</> 
  )
}
export default Dashboard;

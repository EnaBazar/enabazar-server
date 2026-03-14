import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { fetchDataFromApi } from "../../utils/api";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("today");
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- fetch sales ---------------- */
  const fetchSales = async () => {
    try {
      setLoading(true);
      let url = `/rpt/saleslist?filter=${filter}`;
      if (startDate && endDate) {
        url = `/rpt/saleslist?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetchDataFromApi(url);

      if (res?.success) {
        const list = Array.isArray(res.data) ? res.data : [];
        setSales(list);
          
      }
      setLoading(false);
    } catch (err) {
    console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();  
  }, [filter, startDate, endDate]);

  /* ---------------- search filter ---------------- */
  const filteredSales = Array.isArray(sales)
    ? sales.filter(
        (item) =>
          item?.productName?.toLowerCase().includes(search.toLowerCase()) ||
          item?.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          item?.city?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  /* ---------------- date format ---------------- */
  const formatBDTime = (date) => {
    return dayjs(date).tz("Asia/Dhaka").format("DD MMM YYYY • HH:mm");
  };

  /* ---------------- summary calculations ---------------- */
const totalOrders = new Set(filteredSales.map((i) => i.orderId)).size;

const totalQty = filteredSales.reduce(
  (sum, item) => sum + (item.quantity || 0),
  0
);

const totalSales = filteredSales.reduce(
  (sum, item) => sum + (item.salePrice || 0) * (item.quantity || 0),
  0
);

const totalProfit = filteredSales.reduce(
  (sum, item) => sum + (item.profit || 0),
  0
);

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">

      {/* HEADER */}
     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
  <h2 className="text-xl md:text-2xl font-semibold">Sales Summary</h2>

  <div className="flex flex-wrap gap-3 col items-stretch w-full lg:w-auto">
    <select
      value={filter}
      onChange={(e) => {
        setFilter(e.target.value);
        setStartDate("");
        setEndDate("");
      }}
      className="border px-3 py-2 rounded-md h-10 "
    >
      <option value="today">Today </option>
      <option value="week">Weekly </option>
      <option value="month">Monthly </option>
      <option value="year">Yearly </option>
    </select>

    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="border px-3 py-2 rounded-md h-10"
    />

    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="border px-3 py-2 rounded-md h-10"
    />

    <input
      type="text"
      placeholder="Search product / customer / city"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border px-3 py-2 rounded-md h-10 flex-1"
    />
  </div>
</div>

    
     {/* SUMMARY BOX - COMPACT MOBILE FRIENDLY */}
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
  {/* Total Orders */}
  <div className="bg-white border rounded-lg shadow p-2 flex flex-col items-center">
    <p className="text-gray-500 text-[10px] font-medium">Total Orders</p>
    <h3 className="text-[12px] font-semibold">{totalOrders}</h3>
  </div>

  {/* Total Quantity */}
  <div className="bg-white border rounded-lg shadow p-2 flex flex-col items-center">
    <p className="text-gray-500 text-[10px] font-medium">Total Quantity</p>
    <h3 className="text-[12px] font-semibold">{totalQty}</h3>
  </div>

  {/* Total Sales */}
  <div className="bg-white border rounded-lg shadow p-2 flex flex-col items-center">
    <p className="text-gray-500 text-[10px] font-medium">Total Sales</p>
    <h3 className="text-[12px] font-semibold text-blue-600">
      {totalSales.toLocaleString()} ৳
    </h3>
  </div>

  {/* Total Profit */}
  <div className="bg-white border rounded-lg shadow p-2 flex flex-col items-center">
    <p className="text-gray-500 text-[10px] font-medium">Total Profit</p>
    <h3
      className={`text-[12px] font-semibold ${
        totalProfit > 0 ? "text-green-600" : "text-red-600"
      }`}
    >
      {totalProfit.toLocaleString()} ৳
    </h3>
  </div>
</div>

     {/* SELECTED SALE DETAILS */}
{/* SELECTED SALE DETAILS - PROFESSIONAL COLLAPSIBLE CARD */}
{selectedSale && (
  <div className="bg-white border rounded-lg shadow p-3">
    {/* Header / Accordion Button */}
    <button
      type="button"
      className="w-full flex justify-between items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md focus:outline-none"
      onClick={() =>
        setSelectedSale((prev) => ({ ...prev, open: !prev.open }))
      }
    >
      <span>Sale Details - {selectedSale.orderId}</span>
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${
          selectedSale.open ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* SELERCTED  sales details*/}
    {selectedSale.open !== false && (
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Product</p>
          <p className="font-medium">{selectedSale.productName}</p>
        </div>

        <div>
          <p className="text-gray-500">Quantity</p>
          <p className="font-medium">{selectedSale.quantity}</p>
        </div>

        <div>
          <p className="text-gray-500">Sale Price</p>
          <p className="font-medium text-blue-600">{selectedSale.salePrice} ৳</p>
        </div>

        <div>
          <p className="text-gray-500">Purchase Price</p>
          <p className="font-medium">{selectedSale.purchasePrice} ৳</p>
        </div>

        <div>
          <p className="text-gray-500">Profit</p>
          <p
            className={`font-semibold ${
              selectedSale.profit > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {selectedSale.profit} ৳
          </p>
        </div>

        <div>
          <p className="text-gray-500">Customer</p>
          <p className="font-medium">{selectedSale.customerName}</p>
        </div>

        <div>
          <p className="text-gray-500">Mobile</p>
          <p className="font-medium">{selectedSale.mobile}</p>
        </div>

        <div>
          <p className="text-gray-500">City</p>
          <p className="font-medium">{selectedSale.city || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Address</p>
          <p className="font-medium">{selectedSale.address}</p>
        </div>

        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{formatBDTime(selectedSale.date)}</p>
        </div>
      </div>
    )}
  </div>
)}




      {/* SALES TABLE */}

<div className="flex justify-between items-center mb-2">
  <h2 className="text-sm font-semibold text-gray-700">Sales Table</h2>
  <button
    onClick={() => window.print()}
    className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
  >
    Print
  </button>
</div>
<div className="bg-white rounded-lg shadow border overflow-hidden printable-table">
  <div className="overflow-x-auto">
    <table className="w-full text-[9px] min-w-[850px]">
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] min-w-[850px]">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Order</th>
                   <th className="px-4 py-3 border">Date</th>
                   <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">City</th>
                <th className="px-4 py-3 border">Product</th>
                <th className="px-4 py-3 border">Qty</th>
                <th className="px-4 py-3 border">Sale</th>
                <th className="px-4 py-3 border">Purchase</th>
                <th className="px-4 py-3 border">Profit</th>
                
             
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedSale(item)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="border px-2 py-2 text-red-500">
                      {item.orderId}
                    </td>
                     <td className="border px-2 py-2">{formatBDTime(item.date)}</td>
                    <td className="border px-2 py-2">{item.customerName}</td>
                    <td className="border px-2 py-2">{item.city || "-"}</td>
                    <td className="border px-2 py-2">{item.productName}</td>
                    <td className="border px-2 py-2">{item.quantity}</td>
                    <td className="border px-2 py-2">{item.salePrice} ৳</td>
                    <td className="border px-2 py-2">{item.purchasePrice} ৳</td>
                    <td
                      className={`border px-2 py-2 font-semibold ${
                        item.profit > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.profit} ৳
                    </td>
                    
                   
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">
                    No Sales Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </table>
  </div>
</div>

      
    </div>
  );
};

export default SalesList;
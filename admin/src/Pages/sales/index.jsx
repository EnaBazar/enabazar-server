import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchDataFromApi } from "../../utils/api";

dayjs.extend(utc);
dayjs.extend(timezone);

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("today");
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch sales data
  const fetchSales = async () => {
    try {
      let url = `/rpt/report?filter=${filter}`;
      if (startDate && endDate) {
        url = `/rpt/report?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetchDataFromApi(url);
      if (res.data.success) setSales(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filter, startDate, endDate]);

  // Filter by search
  const filteredSales = sales.filter(
    (item) =>
      item.productName?.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase())
  );

  // Convert UTC to Bangladesh time
  const formatBDTime = (utcDate) =>
    dayjs(utcDate).tz("Asia/Dhaka").format("DD MMM YYYY, HH:mm");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Sales List</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setStartDate(""); // Clear custom dates if filter used
              setEndDate("");
            }}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          >
            <option value="today">Today</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
            max={endDate || undefined}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
            min={startDate || undefined}
          />

          <input
            type="text"
            placeholder="Search product / customer / city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Selected Sale Info Box */}
      {selectedSale && (
        <div className="bg-white border shadow-md p-4 mb-6 rounded">
          <h3 className="text-lg font-semibold mb-3">Sale Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <b>Order ID</b>
              <p>{selectedSale.orderId}</p>
            </div>
            <div>
              <b>Product</b>
              <p>{selectedSale.productName}</p>
            </div>
            <div>
              <b>Quantity</b>
              <p>{selectedSale.quantity}</p>
            </div>
            <div>
              <b>Sale Price</b>
              <p>{selectedSale.salePrice} ৳</p>
            </div>
            <div>
              <b>Purchase Price</b>
              <p>{selectedSale.purchasePrice} ৳</p>
            </div>
            <div>
              <b>Profit</b>
              <p
                className={`font-semibold ${
                  selectedSale.profit > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {selectedSale.profit} ৳
              </p>
            </div>
            <div>
              <b>Customer</b>
              <p>{selectedSale.customerName}</p>
            </div>
            <div>
              <b>Mobile</b>
              <p>{selectedSale.mobile}</p>
            </div>
            <div>
              <b>City</b>
              <p>{selectedSale.city}</p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <b>Address</b>
              <p>{selectedSale.address}</p>
            </div>
            <div>
              <b>Date</b>
              <p>{formatBDTime(selectedSale.date)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm min-w-[700px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">Order</th>
              <th className="px-3 py-2 border">Product</th>
              <th className="px-3 py-2 border">Qty</th>
              <th className="px-3 py-2 border">Sale</th>
              <th className="px-3 py-2 border">Purchase</th>
              <th className="px-3 py-2 border">Profit</th>
              <th className="px-3 py-2 border">Customer</th>
              <th className="px-3 py-2 border">City</th>
              <th className="px-3 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((item, index) => (
              <tr
                key={index}
                onClick={() => setSelectedSale(item)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="border px-3 py-2 text-red-500">{item.orderId}</td>
                <td className="border px-3 py-2">{item.productName}</td>
                <td className="border px-3 py-2">{item.quantity}</td>
                <td className="border px-3 py-2">{item.salePrice} ৳</td>
                <td className="border px-3 py-2">{item.purchasePrice} ৳</td>
                <td
                  className={`border px-3 py-2 font-semibold ${
                    item.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.profit} ৳
                </td>
                <td className="border px-3 py-2">{item.customerName}</td>
                <td className="border px-3 py-2">{item.city}</td>
                <td className="border px-3 py-2">{formatBDTime(item.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;
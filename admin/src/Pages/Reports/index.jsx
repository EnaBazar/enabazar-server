import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";

const Reports = () => {

  const [data,setData]=useState({});

  const loadReport = async () => {

    const res = await fetchDataFromApi("/rpt/report");

    setData(res.data);

  };

  useEffect(()=>{
    loadReport();
  },[]);

  return (

    <div className="p-5">

      <h2 className="text-xl font-bold mb-5">
        Sales Report
      </h2>

      <div className="grid grid-cols-4 gap-4">

        <div className="p-4 bg-white shadow">
          Sales: {data?.totalSales} ৳
        </div>

        <div className="p-4 bg-white shadow">
          Profit: {data?.totalProfit} ৳
        </div>

        <div className="p-4 bg-white shadow">
          Products Sold: {data?.totalSold}
        </div>

        <div className="p-4 bg-white shadow">
          Stock: {data?.totalStock}
        </div>

      </div>

    </div>

  );

};

export default Reports;
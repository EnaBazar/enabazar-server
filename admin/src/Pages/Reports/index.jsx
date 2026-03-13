import React,{useEffect,useState} from "react"
import {fetchDataFromApi} from "../../utils/api"

import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts"

const Reports = ()=>{

 const [data,setData]=useState({})
 const [chart,setChart]=useState([])
 const [filter,setFilter]=useState("month")

 const loadData = async()=>{

  const res = await fetchDataFromApi(`/rpt/report?filter=${filter}`)

  setData(res.data)

  const chartData = [
   {name:"Sales",value:res.data.totalSales},
   {name:"Profit",value:res.data.totalProfit}
  ]

  setChart(chartData)

 }

 useEffect(()=>{
  loadData()
 },[filter])

 return(

<div className="p-4 md:p-6">

<h2 className="text-2xl font-bold mb-6">
 salles profit Dashboard
</h2>

{/* Filter */}

<div className="flex gap-2 mb-6">

<button onClick={()=>setFilter("today")} className="px-3 py-1 bg-blue-500 text-white rounded">
Today
</button>

<button onClick={()=>setFilter("week")} className="px-3 py-1 bg-blue-500 text-white rounded">
Week
</button>

<button onClick={()=>setFilter("month")} className="px-3 py-1 bg-blue-500 text-white rounded">
Month
</button>

<button onClick={()=>setFilter("year")} className="px-3 py-1 bg-blue-500 text-white rounded">
Year
</button>

</div>

{/* Cards */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<div className="bg-white shadow p-5 rounded">
<h3>Total Sales</h3>
<p className="text-xl font-bold">{data?.totalSales} ৳</p>
</div>

<div className="bg-white shadow p-5 rounded">
<h3>Total Profit</h3>
<p className="text-xl font-bold">{data?.totalProfit} ৳</p>
</div>

<div className="bg-white shadow p-5 rounded">
<h3>Top Products</h3>
<p>{Object.keys(data?.topProducts || {}).length}</p>
</div>

<div className="bg-white shadow p-5 rounded">
<h3>Low Stock</h3>
<p>{data?.lowStock?.length || 0}</p>
</div>

</div>

{/* Graph */}

<div className="bg-white shadow rounded mt-8 p-5">

<h3 className="mb-4 font-semibold">
Sales & Profit Graph
</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={chart}>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value" fill="#6366f1"/>

</BarChart>

</ResponsiveContainer>

</div>

{/* Top Products */}

<div className="bg-white shadow rounded mt-8 p-5">

<h3 className="font-semibold mb-4">
Top Selling Products
</h3>

{Object.entries(data?.topProducts || {})
.sort((a,b)=>b[1]-a[1])
.slice(0,5)
.map((p,i)=>(
<div key={i} className="flex justify-between border-b py-2">
<span>{p[0]}</span>
<span>{p[1]}</span>
</div>
))}

</div>

{/* Low Stock */}

<div className="bg-white shadow rounded mt-8 p-5">

<h3 className="font-semibold text-red-500 mb-4">
Low Stock Alert
</h3>

{data?.lowStock?.map((p,i)=>(
<div key={i} className="flex justify-between border-b py-2">
<span>{p.name}</span>
<span className="text-red-500">
{p.countInStock}
</span>
</div>
))}

</div>

</div>

 )

}

export default Reports
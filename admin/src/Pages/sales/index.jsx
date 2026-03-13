import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesList = () => {

const [sales,setSales] = useState([])
const [filter,setFilter] = useState("today")
const [search,setSearch] = useState("")
const [selectedSale,setSelectedSale] = useState(null)



const fetchSales = async ()=>{

 try{

  const res = await fetchDataFromApi(`/rpt/report?filter=${filter}`)

 if(res.data.success){
   setSales(res.data.data)
 }

 }catch(err){
 console.log(err)
 }

}


useEffect(()=>{
 fetchSales()
},[filter])



const filteredSales = sales.filter(item=>
 item.productName?.toLowerCase().includes(search.toLowerCase()) ||
 item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
 item.city?.toLowerCase().includes(search.toLowerCase())
)



return(

<div className="p-5">


{/* Header */}

<div className="flex justify-between items-center mb-4">

<h2 className="text-xl font-semibold">
Sales List
</h2>


<div className="flex gap-3">

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
className="border px-3 py-1 rounded"
>

<option value="today">Today</option>
<option value="week">Weekly</option>
<option value="month">Monthly</option>
<option value="year">Yearly</option>

</select>


<input
type="text"
placeholder="Search product / customer"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-3 py-1 rounded"
/>

</div>

</div>



{/* Selected Sale Info Box */}

{selectedSale && (

<div className="bg-white border shadow-md p-4 mb-5 rounded">

<h3 className="text-lg font-semibold mb-3">
Sale Details
</h3>

<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

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

<p className={
selectedSale.profit>0
?"text-green-600 font-semibold"
:"text-red-600 font-semibold"
}>
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

<div>
<b>Address</b>
<p>{selectedSale.address}</p>
</div>

<div>
<b>Date</b>
<p>{new Date(selectedSale.date).toLocaleDateString()}</p>
</div>

</div>

</div>

)}



{/* Sales Table */}

<div className="overflow-x-auto">

<table className="w-full text-sm border">

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

{filteredSales.map((item,index)=>(

<tr
key={index}
onClick={()=>setSelectedSale(item)}
className="cursor-pointer hover:bg-gray-50"
>

<td className="border px-3 py-2 text-red-500">
{item.orderId}
</td>

<td className="border px-3 py-2">
{item.productName}
</td>

<td className="border px-3 py-2">
{item.quantity}
</td>

<td className="border px-3 py-2">
{item.salePrice} ৳
</td>

<td className="border px-3 py-2">
{item.purchasePrice} ৳
</td>

<td className={
`border px-3 py-2 font-semibold ${
item.profit>0
?"text-green-600"
:"text-red-600"
}`
}>

{item.profit} ৳

</td>

<td className="border px-3 py-2">
{item.customerName}
</td>

<td className="border px-3 py-2">
{item.city}
</td>

<td className="border px-3 py-2">
{new Date(item.date).toLocaleDateString()}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}

export default SalesList
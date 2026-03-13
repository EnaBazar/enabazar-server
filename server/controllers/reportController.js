import ordermodel from "../models/order.model.js"
import productmodel from "../models/product.model.js"


export const getAnalytics = async (req,res)=>{

 try{

 const {filter} = req.query

 let startDate = new Date()

 if(filter==="today"){
  startDate.setHours(0,0,0,0)
 }

 if(filter==="week"){
  startDate.setDate(startDate.getDate()-7)
 }

 if(filter==="month"){
  startDate.setMonth(startDate.getMonth()-1)
 }

 if(filter==="year"){
  startDate.setFullYear(startDate.getFullYear()-1)
 }

 const orders = await ordermodel.find({
  order_status:"delivered",
  createdAt:{$gte:startDate}
 })

 const products = await productmodel.find()

 let totalSales = 0
 let totalProfit = 0
 let topProducts = {}

  orders.forEach(order=>{
  totalSales += order.totalAmt
  order.products.forEach(item=>{

  const product = products.find(
  p => p._id.toString() === item.productId.toString()
)

   const purchasePrice = product?.purchasePrice || 0
   const profit =
   (item.price - purchasePrice) * item.quantity
console.log(product)
   totalProfit += profit

   if(!topProducts[item.productTitle]){
     topProducts[item.productTitle]=0
   }

   topProducts[item.productTitle]+=item.quantity

  })

 })

 const lowStock = products.filter(
  p=>p.countInStock < 5
 )

 res.json({
  success:true,
  data:{
   totalSales,
   totalProfit,
   topProducts,
   lowStock
  }
 })

 }catch(error){

 res.status(500).json({
  success:false,
  message:error.message
 })

 }

}

import ordermodel from "../models/order.model.js"
import productmodel from "../models/product.model.js"

export const getSalesList = async (req,res)=>{
 try{

 const {filter} = req.query

 let startDate = new Date()

 if(filter==="today"){
  startDate.setHours(0,0,0,0)
 }

 if(filter==="week"){
  startDate.setDate(startDate.getDate()-7)
 }

 if(filter==="month"){
  startDate.setMonth(startDate.getMonth()-1)
 }

 if(filter==="year"){
  startDate.setFullYear(startDate.getFullYear()-1)
 }

 const orders = await ordermodel.find({
  order_status:"delivered",
  createdAt:{$gte:startDate}
 }).populate("userId")

 const products = await productmodel.find()

 const salesList = []

 orders.forEach(order=>{

  order.products.forEach(item=>{

   const product = products.find(
    p => p._id.toString() === item.productId.toString()
   )

   const purchasePrice = product?.purchasePrice || 0

   const profit = (item.price - purchasePrice) * item.quantity

   salesList.push({

    orderId:order._id,

    productName:item.productTitle,
    quantity:item.quantity,
    salePrice:item.price,
    purchasePrice,

    profit,

    customerName:order.userId?.name,
    mobile:order.userId?.mobile,

    city:order.delivery_address?.city,
    address:order.delivery_address?.address_line,

    date:order.createdAt

   })

  })

 })

 res.json({
  success:true,
  data:salesList
 })

 }catch(err){

 res.status(500).json({
  success:false,
  message:err.message
 })

 }

}
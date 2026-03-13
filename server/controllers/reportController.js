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
    p=>p._id.toString()===item.productId
   )

   const purchasePrice = product?.purchasePrice || 0

   const profit =
   (item.price - purchasePrice) * item.quantity

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
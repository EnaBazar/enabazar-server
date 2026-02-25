import express from 'express';

import auth from '../middleware/auth.js';
import { createOrderController, getAllOrdersForAdminController, getOrderDetailsController, getTotalOrdersCountController, getUnreadOrdersCountController,  markOrdersReadController, totalAllSalesAmountController, totalSalesController, totalUsersController, updateOrderController } from '../controllers/order.controller.js';


const orderRoutes=express.Router()

orderRoutes.post('/create',auth,createOrderController);
orderRoutes.get('/order-list',auth,getOrderDetailsController);
orderRoutes.get('/order-list-admin',auth,getAllOrdersForAdminController);
orderRoutes.put('/order-status/:id',auth,updateOrderController);
orderRoutes.get('/count',auth,getTotalOrdersCountController);
orderRoutes.get('/sales',auth,totalSalesController);
orderRoutes.get('/users',auth,totalUsersController);
orderRoutes.get('/allSales',auth,totalAllSalesAmountController);
orderRoutes.get("/unread-count", auth, getUnreadOrdersCountController);
orderRoutes.put("/mark-read", auth, markOrdersReadController);
export default  orderRoutes;
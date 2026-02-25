import mongoose from "mongoose";
import ordermodel from "../models/order.model.js";
import productmodel from "../models/product.model.js";
import usermodel from "../models/User.js";

// ------------------------
// Create Order Controller
// ------------------------
export async function createOrderController(request, response) {
  try {
    let order = new ordermodel({
      userId: new mongoose.Types.ObjectId(request.body.userId),
      products: request.body.products,
      paymentId: request.body.paymentId,
      payment_status: request.body.payment_status,
      delivery_address: new mongoose.Types.ObjectId(request.body.delivery_address),
      subTotalAmt: request.body.subTotalAmt,
      delivery_charge: request.body.delivery_charge,
      totalAmt: request.body.totalAmt,
      date: request.body.date,
    });

    if (!order) {
      return response.status(500).json({
        error: true,
        success: false,
        message: "Failed to create order",
      });
    }

    // Stock update
    for (let i = 0; i < request.body.products.length; i++) {
      await productmodel.findByIdAndUpdate(
        request.body.products[i].productId,
        {
          countInStock:
            parseInt(request.body.products[i].countInStock) -
            request.body.products[i].quantity,
        },
        { new: true }
      );
    }

    order = await order.save();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Order Placed Successfully",
      order: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ------------------------
// Get Order Details (User Specific with Pagination)
// ------------------------
export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;

    let { page = 1, limit = 10 } = request.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const orderlist = await ordermodel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("delivery_address")
      .populate("userId", "name email avatar");

    const totalOrders = await ordermodel.countDocuments({ userId: userId });

    return response.status(200).json({
      error: false,
      success: true,
      message: "Order list fetched",
      data: orderlist,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


// ------------------------
// Get Order Count 
// ------------------------
export async function getTotalOrdersCountController(request, response) {
  try {


    const ordersCount = await ordermodel.countDocuments();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Order list fetched",
      ordersCount: ordersCount,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}




// ------------------------
// Get All Orders (Admin with Pagination)
// ------------------------
export async function getAllOrdersForAdminController(request, response) {
  try {
    let { page = 1, limit = 10, startDate, endDate, search = "" } = request.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const query = {};

    // — যদি search দেওয়া থাকে, কিছু সার্চ লজিক (optional)
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { _id: regex },
        { paymentId: regex },
        { "userId.name": regex },  // যদি populate-তে user name আসে
        // … অন্য ক্ষেত্র
      ];
    }

    // — Date Range Filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // set end to end-of-day
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end
      };
    } else if (startDate) {
      // শুধু startDate আছে
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate).setHours(23,59,59,999) };
    }

    const orderlist = await ordermodel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("delivery_address")
      .populate("userId", "name email avatar");

    const totalOrders = await ordermodel.countDocuments(query);

    return response.status(200).json({
      error: false,
      success: true,
      message: "Orders fetched successfully",
      data: orderlist,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}




// ------------------------
// Update Order Status
// ------------------------
export async function updateOrderController(request, response) {
  try {
    const { id, order_status } = request.body; // body থেকে id & status আসবে

    const updatedOrder = await ordermodel.findByIdAndUpdate(
      id,
      { order_status: order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Order not found",
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


// ------------------------
// TOtal Sales Status
// ------------------------
export async function totalSalesController(request, response) {
  try {
    const currentYear = new Date().getFullYear();
    const orderList = await ordermodel.find();

    let totalSales = 0;

    let monthlySales = [
      { name: "JAN", totalSales: 0 },
      { name: "FEB", totalSales: 0 },
      { name: "MAR", totalSales: 0 },
      { name: "APR", totalSales: 0 },
      { name: "MAY", totalSales: 0 },
      { name: "JUN", totalSales: 0 },
      { name: "JUL", totalSales: 0 },
      { name: "AUG", totalSales: 0 },
      { name: "SEP", totalSales: 0 },
      { name: "OCT", totalSales: 0 },
      { name: "NOV", totalSales: 0 },
      { name: "DEC", totalSales: 0 },
    ];

    for (let i = 0; i < orderList.length; i++) {
      const createdAt = new Date(orderList[i].createdAt);
      const year = createdAt.getFullYear();
      const month = createdAt.getMonth(); // 0-based (0=Jan, 11=Dec)

      if (year === currentYear) {
        totalSales += parseInt(orderList[i].totalAmt) || 0;

        monthlySales[month].totalSales += parseInt(orderList[i].totalAmt) || 0;
      }
    }

    return response.status(200).json({
      error: false,
      success: true,
      totalSales: totalSales,
      monthlySales: monthlySales,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function totalAllSalesAmountController(req, res) {
  try {
    const orderList = await ordermodel.find();
    let totalSales = 0;

    orderList.forEach(order => {
      totalSales += parseInt(order.totalAmt) || 0;
    });

    return res.status(200).json({
      error: false,
      success: true,
      totalSales
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error
    });
  }
}


// ------------------------
// TotalUserCotroller Status
// ------------------------
// ------------------------
// Total Users Controller
// ------------------------
export async function totalUsersController(request, response) {
  try {
    const currentYear = new Date().getFullYear();

    const users = await usermodel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    let monthlyUsers = [
      { name: "JAN", totalUsers: 0 },
      { name: "FEB", totalUsers: 0 },
      { name: "MAR", totalUsers: 0 },
      { name: "APR", totalUsers: 0 },
      { name: "MAY", totalUsers: 0 },
      { name: "JUN", totalUsers: 0 },
      { name: "JUL", totalUsers: 0 },
      { name: "AUG", totalUsers: 0 },
      { name: "SEP", totalUsers: 0 },
      { name: "OCT", totalUsers: 0 },
      { name: "NOV", totalUsers: 0 },
      { name: "DEC", totalUsers: 0 }
    ];

    for (let i = 0; i < users.length; i++) {
      const month = users[i]._id.month; // 1=Jan, 12=Dec
      monthlyUsers[month - 1].totalUsers = users[i].count;
    }

    return response.status(200).json({
      error: false,
      success: true,
      totalUsers: monthlyUsers
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}


// ------------------------
// Get Unread Order Notifications Count
// ------------------------
export async function getUnreadOrdersCountController(req, res) {
  try {
    const count = await ordermodel.countDocuments({ isRead: false });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Unread order notifications count fetched",
      unreadOrders: count
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error
    });
  }
}


// ------------------------
// Mark All Orders as Read
// ------------------------
// Mark orders as read
export async function markOrdersReadController(req, res) {
  try {
    const userId = req.userId; // auth middleware দিয়ে attach
    const result = await ordermodel.updateMany(
      { userId, isRead: false }, // unread orders
      { $set: { isRead: true } }
    );

    console.log("Modified:", result.modifiedCount);
    return res.status(200).json({
      error: false,
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}








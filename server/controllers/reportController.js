import ordermodel from "../models/order.model.js";
import productmodel from "../models/product.model.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

// -------------------- getAnalytics --------------------
export const getAnalytics = async (req, res) => {
  try {
    const { filter } = req.query;

    // Step 1: Bangladesh timezone startDate
    let startDate = dayjs().tz("Asia/Dhaka").startOf("day");

    if (filter === "week") {
      startDate = dayjs().tz("Asia/Dhaka").subtract(7, "day").startOf("day");
    } else if (filter === "month") {
      startDate = dayjs().tz("Asia/Dhaka").subtract(1, "month").startOf("day");
    } else if (filter === "year") {
      startDate = dayjs().tz("Asia/Dhaka").subtract(1, "year").startOf("day");
    }

    // Convert to UTC for DB query
    const startDateUTC = startDate.utc().toDate();

    const orders = await ordermodel.find({
      order_status: "delivered",
      createdAt: { $gte: startDateUTC },
    });

    const products = await productmodel.find();

    let totalSales = 0;
    let totalProfit = 0;
    let topProducts = {};

    orders.forEach((order) => {
      totalSales += order.totalAmt;
      order.products.forEach((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId.toString()
        );

        const purchasePrice = product?.purchasePrice || 0;
        const profit = (item.price - purchasePrice) * item.quantity;
        totalProfit += profit;

        if (!topProducts[item.productTitle]) topProducts[item.productTitle] = 0;
        topProducts[item.productTitle] += item.quantity;
      });
    });

    const lowStock = products.filter((p) => p.countInStock < 5);

    res.json({
      success: true,
      data: {
        totalSales,
        totalProfit,
        topProducts,
        lowStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -------------------- getSalesList --------------------
export const getSalesList = async (req, res) => {
  try {
    const { filter } = req.query;

    let startDate = dayjs().tz("Asia/Dhaka").startOf("day");

    if (filter === "week") {
      startDate = dayjs().tz("Asia/Dhaka").subtract(7, "day").startOf("day");
    } else if (filter === "month") {
      startDate = dayjs().tz("Asia/Dhaka").subtract(1, "month").startOf("day");
    } else if (filter === "year") {
      startDate = dayjs().tz("Asia/Dhaka").subtract(1, "year").startOf("day");
    }

    const startDateUTC = startDate.utc().toDate();

    const orders = await ordermodel
      .find({
        order_status: "delivered",
        createdAt: { $gte: startDateUTC },
      })
      .populate("userId");

    const products = await productmodel.find();

    const salesList = [];

    orders.forEach((order) => {
      order.products.forEach((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId.toString()
        );

        const purchasePrice = product?.purchasePrice || 0;
        const profit = (item.price - purchasePrice) * item.quantity;

        salesList.push({
          orderId: order._id,
          productName: item.productTitle,
          quantity: item.quantity,
          salePrice: item.price,
          purchasePrice,
          profit,
          customerName: order.userId?.name,
          mobile: order.userId?.mobile,
          city: order.delivery_address?.city,
          address: order.delivery_address?.address_line,
          // Convert UTC date to Bangladesh local time
          date: dayjs(order.createdAt).tz("Asia/Dhaka").format("DD MMM YYYY, HH:mm"),
        });
      });
    });

    res.json({
      success: true,
      data: salesList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
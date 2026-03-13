import ordermodel from "../models/orderModel.js";
import productmodel from "../models/productModel.js";

export const getReport = async (req, res) => {

  try {

    const orders = await ordermodel.find({
      order_status: "delivered"
    });

    const products = await productmodel.find();

    let totalSales = 0;
    let totalProfit = 0;
    let totalSold = 0;

    orders.forEach(order => {

      totalSales += order.totalAmt;

      order.products.forEach(item => {

        const product = products.find(
          p => p._id.toString() === item.productId
        );

        const purchasePrice = product?.purchasePrice || 0;

        const profit =
          (item.price - purchasePrice) * item.quantity;

        totalProfit += profit;
        totalSold += item.quantity;

      });

    });

    const totalStock = products.reduce(
      (sum, p) => sum + p.countInStock,
      0
    );

    res.json({
      success: true,
      data: {
        totalSales,
        totalProfit,
        totalSold,
        totalStock
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
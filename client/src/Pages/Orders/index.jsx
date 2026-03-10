import React, { useState, useEffect } from "react";
import AccountSidebar from "../../Components/AccountSidebar";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [isOpenOrderProduct, setIsOpenOrderProduct] = useState(null);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const toggleOrderProduct = (index) => {
    setIsOpenOrderProduct(isOpenOrderProduct === index ? null : index);
  };

  useEffect(() => {
    fetchDataFromApi("/order/order-list").then((res) => {
      if (res?.error === false) {
        setOrders(res?.data);
      }
    });
  }, []);

  // 7-hour cancel timer
  const getCancelTimeLeft = (createdAt) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const limit = 7 * 60 * 60 * 1000; // 7 hours in ms
    const timeLeft = limit - (currentTime - orderTime);

    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Cancel order API call
const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      alert("You must be logged in to cancel order");
      return;
    }

    const res = await fetch("https://api.goroabazar.com/order/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    console.log("Cancel response:", data);

    if (data?.success) {
      alert("Order removed successfully");
      window.location.reload();
    } else {
      alert(data?.message || "Cancel failed");
    }
  } catch (err) {
    console.error("Fetch cancel error:", err);
    alert("Something went wrong");
  }
};

  return (
    <section className="py-10 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 w-[90%] lg:w-[80%]">

        {/* Sidebar */}
        <div className="w-full lg:w-[20%]">
          <AccountSidebar />
        </div>

        {/* Orders Table */}
        <div className="w-full lg:w-[80%]">
          <div className="shadow-md rounded-md p-5 bg-white">

            {/* Header */}
            <div className="pb-3 border-b border-[rgba(0,0,0,0.2)]">
              <h2 className="text-[18px] font-semibold">My Orders</h2>
              <p className="text-[14px] mt-1">
                There are <span className="font-bold text-[#ff5252] ml-1 mr-1">{orders?.length}</span> orders in your list
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-5">
              <table className="w-full min-w-[900px] text-sm text-left">

                <thead className="uppercase bg-[rgba(0,0,0,0.08)]">
                  <tr className="text-[12px]">
                    <th className="px-4 py-2"></th>
                    <th className="px-4 py-2">Order Id</th>
                    <th className="px-4 py-2">Payment</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">SubTotal</th>
                    <th className="px-4 py-2">D.Charge</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.length > 0 ? (
                    orders.map((order, index) => {
                      const cancelTime = getCancelTimeLeft(order?.createdAt);
                      return (
                        <React.Fragment key={order?._id}>
                          <tr className="border-b">
                            <td className="px-4 py-3">
                              <Button
                                className="!min-w-[30px] !w-[30px] !h-[30px] !rounded-full !bg-[#f1f1f1]"
                                onClick={() => toggleOrderProduct(index)}
                              >
                                {isOpenOrderProduct === index ? <FaAngleUp /> : <FaAngleDown />}
                              </Button>
                            </td>
                            <td className="px-4 py-3 text-[#ff5252]">{order?._id}</td>
                            <td className="px-4 py-3 text-[12px]">{order?.paymentId || "CASH ON DELIVERY"}</td>
                            <td className="px-4 py-3">{order?.userId?.name}</td>
                            <td className="px-4 py-3">{order?.userId?.mobile || '--'}</td>
                            <td className="px-4 py-3 max-w-[200px] truncate">
                              {`${order?.delivery_address?.address_line}, ${order?.delivery_address?.city}, ${order?.delivery_address?.state}`}
                            </td>
                            <td className="px-4 py-3">৳{order?.subTotalAmt}</td>
                            <td className="px-4 py-3">৳{order?.delivery_charge}</td>
                            <td className="px-4 py-3 font-semibold">৳{order?.totalAmt}</td>
                            <td className="px-4 py-3"><Badge status={order?.order_status} /></td>
                            <td className="px-4 py-3">{new Date(order?.createdAt).toLocaleDateString()}</td>

                            {/* Cancel Button */}
                            <td className="px-4 py-3">
                              {cancelTime &&
                                ["pending", "processing"].includes(order?.order_status?.toLowerCase()) && (
                                  <>
                                    <p className="text-[8px] text-gray-500 mb-1">Cancel in {cancelTime}</p>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => cancelOrder(order._id)}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                            </td>
                          </tr>

                          {/* Products Expand */}
                          {isOpenOrderProduct === index && (
                            <tr>
                              <td colSpan="12" className="bg-[#fafafa] p-4">
                                <table className="w-full text-sm">
                                  <thead className="bg-[rgba(0,0,0,0.05)]">
                                    <tr>
                                      <th className="px-4 py-2">Image</th>
                                      <th className="px-4 py-2">Product</th>
                                      <th className="px-4 py-2">Qty</th>
                                      <th className="px-4 py-2">Price</th>
                                      <th className="px-4 py-2">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order?.products?.map((item) => (
                                      <tr key={item?.productId} className="border-b">
                                        <td className="px-4 py-3">
                                          <img
                                            src={item?.image || "/no-image.png"}
                                            className="w-[60px] h-[60px] object-cover rounded-md cursor-pointer"
                                            onClick={() => navigate(`/product/${item?.productId}`)}
                                          />
                                        </td>
                                        <td
                                          className="px-4 py-3 cursor-pointer hover:text-[#ff5252]"
                                          onClick={() => navigate(`/product/${item?.productId}`)}
                                        >
                                          {item?.productTitle}
                                        </td>
                                        <td className="px-4 py-3">{item?.quantity}</td>
                                        <td className="px-4 py-3">৳{item?.price}</td>
                                        <td className="px-4 py-3 font-semibold">৳{item?.quantity * item?.price}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center py-10">No Orders Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
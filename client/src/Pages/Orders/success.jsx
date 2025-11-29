import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order; // order object pathano hocche

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-3">
        <h1 className="text-[20px] text-red-500">Order details not found!</h1>
        <Link to="/">
          <Button className="btn-org btn-border btn-sml mt-3">Back to Home</Button>
        </Link>
      </section>
    );
  }

  const delivery = order.delivery_address;

  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-5">
      <img src="/successorder.png" width="150" alt="Order Success" />

      <h1 className="text-[25px] font-semibold">আপনার অর্ডারটা সফলভাবে সম্পুর্ন হয়েছে</h1>
      <p className="text-[15px] text-gray-700 text-center max-w-md">
        Thank you for your order! Below are your delivery details.
      </p>

      {/* Delivery Details */}
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-5 mt-5">
        <h2 className="text-[18px] font-semibold !mb-3">ডেলিভারি ঠিকানা</h2>


         <p><strong>Order Id:</strong> {order._id}</p>
        <p><strong>Name:</strong> {order.userId?.name}</p>
          <p><strong>Address:</strong> {delivery?.address_line}, {delivery?.city}, {delivery?.state}</p>
        <p><strong>Phone:</strong> {order.userId?.mobile}</p>
        <p><strong>Total Amount:</strong> &#2547;{order.totalAmt}</p>
      
        <p><strong>Payment:</strong> {order.paymentId || 'Cash on Delivery'}</p>
      
        <p><strong>Order Status:</strong> {order.order_status}</p>
      </div>

      <Link to="/">
        <Button className="btn-org btn-border btn-sml mt-5">Back to Home</Button>
      </Link>
    </section>
  );
};

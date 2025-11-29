import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import Button from '@mui/material/Button';

const OrderReceipt = () => {
  const location = useLocation();
  const order = location.state;
  const context = useContext(MyContext);

  const customerName = context?.userData?.name;
  const addressObj = context?.userData?.address_details?.find(
    (addr) => addr._id === order?.delivery_address?._id || order?.delivery_address?._id
  );

  const orderDate = order?.date || new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-10 bg-[#fffaf7] min-h-screen">
      <div id="receipt" className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Order Receipt</h1>
        <p><strong>Order ID:</strong> {order?._id}</p>
        <p><strong>Date:</strong> {orderDate}</p>
        <p><strong>Customer:</strong> {customerName}</p>
        <p><strong>Address:</strong> {addressObj ? `${addressObj.address_line}, ${addressObj.city}, ${addressObj.state}, ${addressObj.pincode}` : 'No Address Found'}</p>
        <p><strong>Total Amount:</strong> ৳{order?.totalAmt}</p>

        <h2 className="mt-6 mb-2 text-xl font-semibold">Products:</h2>
        <ul className="list-disc pl-5">
          {order?.products?.map((item, idx) => (
            <li key={idx}>
              {item?.productTitle} × {item?.quantity} = ৳{item?.quantity * item?.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-6 print:hidden">
        <Button
          variant="contained"
          style={{ backgroundColor: "#FC8934" }}
          onClick={handlePrint}
        >
          প্রিন্ট রিসিপ্ট
        </Button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt, #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderReceipt;
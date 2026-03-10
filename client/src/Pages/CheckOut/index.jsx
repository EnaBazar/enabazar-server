import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa6';
import Radio from '@mui/material/Radio';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CheckOut = () => {
  window.scrollTo(0, 0);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selecteddelivery, setSelecteddelivery] = useState(0);
  const [subTotalAmount, setsSubTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalAmount = Number(subTotalAmount || 0) + Number(selecteddelivery || 0);

  const editAddress = (id) => {
    context.setAddressMode("edit");
    context?.setOpenAddressPanel(true);
    context?.setAddressId(id);
  };

  const removeAddress = (id) => {
    deleteData(`/address/${id}`).then(() => {
      fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then(() => {
        context?.openAlertBox("success", "Address removed successfully");
        window.location.reload();
      });
    });
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      const selectedId = e.target.value;
      const deliveryCharge = e.target.getAttribute('data-delivery');
      setIsChecked(index);
      setSelectedAddress(selectedId);
      setSelecteddelivery(Number(deliveryCharge));
    }
  };

  useEffect(() => {
    const defaultAddress = context?.userData?.address_details?.[0];
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
      setSelecteddelivery(Number(defaultAddress.deliverylocation));
    }

    const total = context?.cartData?.length
      ? context.cartData
          .map(item => parseInt(item.price) * item.quantity)
          .reduce((total, value) => total + value, 0)
      : 0;

    setsSubTotalAmount(total);
  }, [context.cartData, context.userData]);

  const cashOnDelivery = async () => {
    const user = context?.userData;
    if (!user?.address_details?.length) {
      context?.openAlertBox("error", "Please add address first!");
      return;
    }

    setLoading(true);

    const payLoad = {
      userId: user?._id,
      products: context?.cartData,
      paymentId: '',
      payment_status: "Cash On Delivery",
      delivery_address: selectedAddress,
      subTotalAmt: subTotalAmount,
      delivery_charge: selecteddelivery,
      totalAmt: totalAmount,
      date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await postData(`/order/create`, payLoad);
      setLoading(false);

      if (res?.error !== true) {
        await deleteData(`/cart/emptycart/${user?._id}`);
        context?.setCartData([]);

        const order = res.order;
        const addressObj = user.address_details.find(addr => addr._id === selectedAddress);

        // Professional SMS
        let message = `📦 GoroaBazar Order Receipt\n\n`;
        message += `Order ID: ${order._id}\nCustomer: ${user.name}\nMobile: ${user.mobile}\nDate: ${order.date}\n`;
        message += `Delivery Address:\n${addressObj?.address_line}, ${addressObj?.city}, ${addressObj?.state}\n\n`;
        message += `Products:\n`;
        order.products.forEach((p, i) => {
          message += `${i+1}. ${p.productTitle}\n   Qty: ${p.quantity} | Price: ৳${p.price.toLocaleString('en-BD')} | Subtotal: ৳${(p.price * p.quantity).toLocaleString('en-BD')}\n`;
        });
        message += `\nSubtotal: ৳${subTotalAmount.toLocaleString('en-BD')}\n`;
        message += `Delivery: ৳${selecteddelivery.toLocaleString('en-BD')}\n`;
        message += `Total: ৳${totalAmount.toLocaleString('en-BD')}\n\n`;
        message += `Thank you for shopping with GoroaBazar! 🎉`;

        const smsUrl = `https://bulksmsdhaka.net/api/sendtext?apikey=b65bf467f3282df00975768237e81ce765830322&callerID=1234&number=${user.mobile}&message=${encodeURIComponent(message)}`;
        await fetch(smsUrl);

        context?.openAlertBox("success", "Order placed successfully & SMS sent!");
        navigate("/order/success", { state: { order } });

      } else {
        context?.openAlertBox("error", res?.message);
        navigate("/order/failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      setLoading(false);
      context?.openAlertBox("error", "Something went wrong!");
    }
  };

  return (
    <section className="min-h-screen py-10">
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 w-[90%] lg:w-[80%]">

        {/* Address Column */}
        <div className="w-full lg:w-2/3">
          <div className="card bg-white shadow-md p-5 rounded-md w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-base font-semibold">Choose Delivery Address</h1>
              <Button size="small" variant="outlined" onClick={() => { context?.setOpenAddressPanel(true); context?.setAddressMode("add"); }}>
                <FaPlus /> ADD NEW ADDRESS
              </Button>
            </div>

            <div className="flex flex-col gap-3 !mt-5">
              {context?.userData?.address_details?.length ? (
                context?.userData.address_details.map((address, index) => (
                  <label key={index} className={`flex gap-3 p-4 border border-gray-300 rounded-md relative cursor-pointer ${isChecked === index ? "!bg-[rgba(255,0,0,0.1)]" : ""}`}>
                    <Radio
                      size="small"
                      checked={isChecked === index}
                      value={address._id}
                      data-delivery={address.deliverylocation}
                      onChange={(e) => handleChange(e, index)}
                    />
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 bg-sky-600 text-white text-[13px] rounded-sm">{address.addressType}</span>
                      <h4 className="pt-2 text-[14px] flex gap-3"><span>{context?.userData.name}</span><span>{context?.userData.mobile}</span></h4>
                      <span className="block pt-1 text-[14px]">{`${address.address_line}, ${address.city}, ${address.state}`}</span>
                    </div>
                    <div className="flex flex-col gap-3 !mt-5">
                      <Button variant="text" size="small" className="!absolute top-[18px] right-[60px] !font-bold" onClick={() => editAddress(address._id)}>EDIT</Button>
                      <Button variant="text" size="small" className="!absolute top-[18px] right-[10px] !font-bold !text-red-500" onClick={() => removeAddress(address._id)}>DELETE</Button>
                    </div>
                  </label>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-5">
                  <img src="/emptyaddress.png" className="w-[120px]" />
                  <h4>Your Address is currently empty</h4>
                  <Button className="btn-org btn-sm" onClick={() => { context?.setOpenAddressPanel(true); context?.setAddressMode("add"); }}>Add Address</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="card shadow-md bg-white p-5 rounded-md flex flex-col h-full">
            <h2 className="mb-4 text-lg font-semibold border-b border-gray-300 pb-2">Your Order</h2>

            <div className="flex-1 overflow-y-auto pr-2 mb-4 max-h-[300px]">
              {context?.cartData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-dashed border-gray-300">
                  <div className="flex gap-3 items-center">
                    <div className="w-[60px] h-[50px] overflow-hidden rounded-md">
                      <img src={item?.image} alt={item?.productTitle} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium" title={item?.productTitle}>
                        {item?.productTitle?.length > 30 ? item.productTitle.substr(0, 20) + "..." : item.productTitle}
                      </h4>
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">&#2547; {(item.quantity * item.price).toLocaleString("en-BD")}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm !mt-4 font-medium text-gray-700">
              <div className="flex justify-between"><span>Subtotal</span><span>&#2547; {subTotalAmount.toLocaleString("en-BD")}</span></div>
              <div className="flex justify-between !mt-1 !mb-1"><span>Delivery Charge</span><span>&#2547; {selecteddelivery.toLocaleString("en-BD")}</span></div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold text-black !mb-8">
                <span>Total</span>
                <span>&#2547; {totalAmount.toLocaleString("en-BD")}</span>
              </div>
            </div>

            <div className="mt-5">
              <Button type="button" className="btn-org btn-lg w-full gap-3 justify-center !mb-3" onClick={cashOnDelivery} disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : <><BsFillBagCheckFill className="text-lg" /> Cash on Delivery</>}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CheckOut;
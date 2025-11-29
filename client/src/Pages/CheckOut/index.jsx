import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa6';
import Radio from '@mui/material/Radio';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate} from 'react-router-dom';


const CheckOut = () => {
  window.scrollTo(0, 0);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selecteddelivery, setSelecteddelivery] = useState("");
  const [subTotalAmount, setsSubTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const totalAmount = Number(subTotalAmount || 0) + Number(selecteddelivery || 0);

  const editeAddress = (id) => {
    context.setAddressMode("edit");
    context?.setOpenAddressPanel(true);
    context?.setAddressId(id);
  };


      
       const removeAddress = (id) => {
  deleteData(`/address/${id}`).then((res) => {
    fetchDataFromApi(`/address/get?userId=${context?.userData?._id}`).then((res) => {
      context?.openAlertBox("success", "Remove This Address");
      window.location.reload(); // ✅ removeAddress এর পর পেজ রিলোড
    });
  });
};

 // ✅ Product fetch



  const handleChange = (e, index) => {
    if (e.target.checked) {
      const selectedId = e.target.value;
      const deliveryCharge = e.target.getAttribute('data-delivery');

      setIsChecked(index);
      setSelectedAddress(selectedId);
      setSelecteddelivery(deliveryCharge);

      fetchDataFromApi(`/address/selectAddress/${selectedId}`).then((res) => {
        setSelecteddelivery(res?.address?.deliverylocation);
      });
    }
  };

  useEffect(() => {
    const defaultAddress = context?.userData?.address_details?.[0];
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
      setSelecteddelivery(defaultAddress.deliverylocation);
    }

    const total = context?.cartData?.length
      ? context.cartData
          .map(item => parseInt(item.price) * item.quantity)
          .reduce((total, value) => total + value, 0)
      : 0;

    setsSubTotalAmount(total);
  }, [context.cartData, context.userData]);

// Cash on Delivery function update
const cashOnDelivery = () => {
  const user = context?.userData;

  if (context?.userData?.address_details?.length !== 0) {
    setLoading(true); // start loading
    context?.getCartItems();

    const payLoad = {
      userId: user?._id,
      products: context?.cartData,
      paymentId: '',
      payment_status: "Cash On Delivery",
      delivery_address: selectedAddress,
      subTotalAmt: subTotalAmount,
      delivery_charge: selecteddelivery,
      totalAmt: totalAmount,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })
    };

    postData(`/order/create`, payLoad).then((res) => {
      setLoading(false); // stop loading
      if (res?.error !== true) {
        // Empty cart
        deleteData(`/cart/emptycart/${user?._id}`).then(() => {
          context?.setCartData([]);
        });

        context?.openAlertBox("success", res?.message);

        // ✅ Navigate to OrderSuccess page with order object
        navigate("/order/success", { state: { order: res.order } });

      } else {
        context?.openAlertBox("error", res?.message);
        navigate("/order/failed");
      }  
    });
  } else {
    context?.openAlertBox("error", "Please Add Address First!");
  }  
};


  return (
    <section className="min-h-screen py-10">
      <form>
        <div className="container mx-auto flex flex-col lg:flex-row gap-5 w-[90%] lg:w-[80%]">
          {/* -------- Address Column -------- */}
          <div className="w-full lg:w-2/3">
            <div className="card bg-white shadow-md p-5 rounded-md w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-base font-semibold">Choose Delivery Address</h1>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    context?.setOpenAddressPanel(true);
                    context?.setAddressMode("add");
                  }}
                >
                  <FaPlus /> ADD NEW ADDRESS
                </Button>


        
           
              </div>

              <div className="flex flex-col gap-3 !mt-5">
                {context?.userData?.address_details?.length !== 0 ? (
                  context?.userData?.address_details.map((address, index) => (
                    <label
                      className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.2)] rounded-md relative cursor-pointer ${
                        isChecked === index && "!bg-[rgba(255,0,0,0.1)]"
                      }`}
                      key={index}
                    >
                      <Radio
                        size="small"
                        onChange={(e) => handleChange(e, index)}
                        checked={isChecked === index}
                        value={address?._id}
                        data-delivery={address?.deliverylocation}
                      />
                      <div className="info flex-1">
                        <span className="inline-block pl-2 pr-2 bg-sky-600 text-[13px]
                         text-white font-[500] rounded-sm">
                          {address?.addressType}
                        </span>
                        <h4 className="pt-2 text-[14px] flex flex-wrap items-center gap-3">
                          <span>{context?.userData?.name}</span>
                          <span>{context?.userData?.mobile}</span>
                        </h4>
                        <span className="pt-1 text-[14px] block">
                          {`${address?.address_line}, ${address?.city},
                           ${address?.state}`}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3 !mt-5">
                      <Button
                        variant="text"
                        size="small"
                        className="!absolute top-[18px] right-[60px] !font-[700]"
                        onClick={() => editeAddress(address?._id)}
                      >
                        EDIT
                      </Button>

                    <Button
                        variant="text"
                        size="small"
                        className="!absolute top-[18px] right-[10px] !font-[700] !text-red-500"
                       onClick={() => removeAddress(address?._id)}
                      >
                        Delete
                      </Button>


                        </div>

                    </label>
                  ))
                ) : (
                  <div className="flex items-center justify-center flex-col py-10 gap-5">
                    <img src="/emptyaddress.png" className="w-[120px]" />
                    <h4>Your Address is currently empty</h4>
                    <Button
                      className="btn-org btn-sm"
                      onClick={() => {
                        context?.setOpenAddressPanel(true);
                        context?.setAddressMode("add");
                      }}
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* -------- Order Summary -------- */}
          <div className="w-full lg:w-1/3">
            <div className="card shadow-md bg-white p-5 rounded-md flex flex-col h-full">
              <h2 className="mb-4 text-lg font-semibold border-b border-gray-300 pb-2">
                Your Order
              </h2>

              {/* Cart Items List (scrollable) */}
              <div className="flex-1 overflow-y-auto pr-2 mb-4 max-h-[300px]">
                {context?.cartData?.map((item, index) => (
                  <div
                    className="flex items-center justify-between py-2 border-b border-dashed border-gray-300"
                    key={index}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[60px] h-[50px] overflow-hidden rounded-md">
                        <img
                          src={item?.image}
                          className="w-full h-full object-cover"
                          alt={item?.productTitle}
                        />
                      </div>
                      <div>
                        <h4
                          className="text-sm font-medium"
                          title={item?.productTitle}
                        >
                          {item?.productTitle?.length > 30
                            ? item?.productTitle.substr(0, 20) + "..."
                            : item?.productTitle}
                        </h4>
                        <span className="text-xs text-gray-500">
                          Qty: {item?.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      &#2547; {(item?.quantity * item?.price).toLocaleString("en-BD")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing summary */}
              <div className="space-y-3 text-sm !mt-4 font-medium text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>&#2547; {Number(subTotalAmount || 0).toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between !mt-1 !mb-1">
                  <span>Delivery Charge</span>
                  <span>&#2547; {Number(selecteddelivery || 0).toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold text-black !mb-8">
                  <span>Total</span>
                  <span>
                    &#2547;{(Number(subTotalAmount || 0) + Number(selecteddelivery || 0)).toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              {/* Bottom Section (with loading button) */}
              <div className="mt-5">
                <Button
                  type="button"
                  className="btn-org btn-lg w-full gap-3 justify-center !mb-3"
                  onClick={cashOnDelivery}
                  disabled={loading} // ✅ disable when loading
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <>
                      <BsFillBagCheckFill className="text-lg" /> Cash on Delivery
                    </>
                  )}
                </Button>
              </div>

              {/* WhatsApp & IMO */}
              <div className="mt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/8801674847446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-green-700 hover:bg-green-600 font-medium py-2 rounded-md text-center"
                >
                  📞 Message on WhatsApp
                </a>
                <a
                  href="https://imo.im/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-blue-500 hover:bg-blue-600 font-medium py-2 rounded-md text-center"
                >
                  📱 Chat via IMO
                </a>
              </div>
            </div>

  
          </div>

        </div>
      </form>
    </section>
  );
};

export default CheckOut;

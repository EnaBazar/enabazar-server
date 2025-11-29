import React, { useState, useEffect } from 'react'
import AccountSidebar from '../../Components/AccountSidebar'
import Button from '@mui/material/Button'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6'
import Badge from '../../Components/Badge'
import { fetchDataFromApi } from '../../utils/api'

const Orders = () => {
  const [isOpenOrderProduct, setIsOpenOrderProduct] = useState(null)
  const [orders, setOrders] = useState([])

  const toggleOrderProduct = (index) => {
    if (isOpenOrderProduct === index) {
      setIsOpenOrderProduct(null)
    } else {
      setIsOpenOrderProduct(index)
    }
  }

  useEffect(() => {
    fetchDataFromApi('/order/order-list').then((res) => {
      console.log(res)
      if (res?.error === false) 
        setOrders(res?.data)
    })
  }, [])

  return (
  <section className="py-10 w-full">
  <div className="container mx-auto flex flex-col lg:flex-row gap-5 w-[90%] lg:w-[80%]">

    {/* Sidebar */}
    <div className="col1 w-full lg:w-[20%]">
      <AccountSidebar />
    </div>

    {/* Orders Table */}
    <div className="col2 w-full lg:w-[80%]">
      <div className="shadow-md rounded-md p-5 bg-white">

        {/* Header */}
        <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.2)]">
          <h2 className="text-[16px] font-semibold">My Orders</h2>
          <p className="text-[14px] mt-1">
            There are <span className="font-bold text-[#ff5252]">{orders?.length}</span> orders in your list
          </p>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="uppercase bg-[rgba(0,0,0,0.1)] border-b border-gray-300">
              <tr className="!text-[12px]">
                <th className="px-4 py-2">&nbsp;</th>
                <th className="px-4 py-2">Order Id</th>
                <th className="px-4 py-2">Payment Status</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">SubTotal</th>
                <th className="px-4 py-2">D.Charge</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">User Id</th>
                <th className="px-4 py-2">Order Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders?.length > 0 ? (
                orders.map((order, index) => (
                  <React.Fragment key={order?._id}>
                    <tr className="bg-white border-b border-[rgba(0,0,0,0.1)]">
                      <td className="px-4 py-2">
                        <Button
                          className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]"
                          onClick={() => toggleOrderProduct(index)}
                        >
                          {isOpenOrderProduct === index ? (
                            <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.6)]" />
                          ) : (
                            <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.6)]" />
                          )}
                        </Button>
                      </td>
                      <td className="px-4 py-2 text-[#ff5252]">{order?._id}</td>
                      <td className="px-4 py-2 text-[#ff5252] text-[12px]">
                        {order?.paymentId || 'CASH ON DELIVERY'}
                      </td>
                      <td className="px-4 py-2">{order?.userId?.name}</td>
                      <td className="px-4 py-2">{order?.userId?.mobile || '--'}</td>
                      <td className="px-4 py-2 max-w-[200px] truncate">
                        {`${order?.delivery_address?.address_line}, ${order?.delivery_address?.city}, ${order?.delivery_address?.landmark}, ${order?.delivery_address?.state}`}
                      </td>
                      <td className="px-4 py-2">{order?.subTotalAmt}</td>
                      <td className="px-4 py-2">{order?.delivery_charge}</td>
                      <td className="px-4 py-2">{order?.totalAmt}</td>
      
                      <td className="px-4 py-2 text-[#ff5252]">{order?.userId?._id}</td>
                      <td className="px-4 py-2"><Badge status={order?.order_status} /></td>
                      <td className="px-4 py-2">{new Date(order?.createdAt).toLocaleDateString()}</td>
                    </tr>

                    {/* Expanded Products */}
                    {isOpenOrderProduct === index && (
                      <tr>
                        <td colSpan="14" className="pl-4 bg-[#fafafa]">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm">
                              <thead className="bg-[rgba(0,0,0,0.1)] border-b border-gray-300">
                                <tr>
                                  <th className="px-4 py-2">Product Id</th>
                                  <th className="px-4 py-2">Product Name</th>
                                  <th className="px-4 py-2">Image</th>
                                  <th className="px-4 py-2">Quantity</th>
                                  <th className="px-4 py-2">Price</th>
                                  <th className="px-4 py-2">Sub Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.products?.map((item) => (
                                  <tr key={item?.productId?._id} className="bg-white border-b border-[rgba(0,0,0,0.2)]">
                                    <td className="px-4 py-2 text-[#ff5252]">{item?.productId}</td>
                                    <td className="px-4 py-2 truncate max-w-[150px]">{item?.productTitle}</td>
                                    <td className="px-4 py-2">
                                      <img
                                        src={item?.image || '/no-image.png'}
                                        alt={item?.productId?.name}
                                        className="w-[50px] h-[50px] object-cover rounded-md"
                                      />
                                    </td>
                                    <td className="px-4 py-2">{item?.quantity}</td>
                                    <td className="px-4 py-2">{item?.price}</td>
                                    <td className="px-4 py-2">{item?.quantity * item?.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-10">
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</section>

  )
}

export default Orders

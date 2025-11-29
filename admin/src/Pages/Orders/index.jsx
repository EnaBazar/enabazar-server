import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import SearchBox from "../../Components/SearchBox";
import { editData, fetchDataFromApi } from "../../utils/api";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import pdfMake from "../../Fonts/pdfFonts.js";
import companyLogo from "../../assets/logo-base64"; // Base64 লোগো ইমেজ

const Orders = () => {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpenOrderProduct, setIsOpenOrderProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");


  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const toggleOrderProduct = (index) => {
    setIsOpenOrderProduct(isOpenOrderProduct === index ? null : index);
  };

  const handleChange = (event, id) => {
    const newStatus = event.target.value;
    editData(`/order/order-status/${id}`, { id, order_status: newStatus }).then((res) => {
      if (res?.data?.error === false) {
        context.openAlertBox("success", res?.data?.message);
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === id ? { ...o, order_status: newStatus } : o
          )
        );
      }
    });
  };

const fetchOrders = async (page = 1) => {
  const start = startDate ? `&startDate=${startDate}` : "";
  const end = endDate ? `&endDate=${endDate}` : "";

  fetchDataFromApi(
    `/order/order-list-admin?page=${page}&limit=8&search=${searchQuery}${start}${end}`
  ).then((res) => {
    if (res?.error === false) {
      setOrders(res?.data);
      setTotalPages(res?.totalPages);
      setCurrentPage(res?.currentPage);
    }
  });
};




useEffect(() => {
  fetchOrders(currentPage);
}, [currentPage, searchQuery, startDate, endDate]);



  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setIsOpenOrderProduct(null);
  };

  const filteredOrders = orders?.filter(
    (order) =>
      order?.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.updatedAt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.delivery_address?.mobile?.includes(searchQuery) ||
      order?.delivery_address?.city?.includes(searchQuery)
  );

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const exportOrderInvoice = (order) => {
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: "NotoSansBangla",
        fontSize: 11,
      },
      content: [
        {
          columns: [
            { image: companyLogo, width: 70 },
            {
              stack: [
                { text: "EnaBazar.com", style: "companyName" },
                { text: "IslamPur Road,Feni,3900", fontSize: 10, color: "#555" },
                { text: "ফোন: 0167484746 | ইমেইল: EnaBazar@gmail.com", fontSize: 10, color: "#555" },
              ],
              margin: [10, 0, 0, 0],
            },
            {
              text: "অর্ডার ইনভয়েস",
              style: "invoiceTitle",
              alignment: "right",
            },
          ],
        },
        { canvas: [{ type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
        { text: "\n" },
        {
          columns: [
            { text: `অর্ডার আইডি: ${order?._id}`, bold: true },
            {
              text: `তারিখ: ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "--"}`,
              alignment: "right",
            },
          ],
        },
        { text: "\n" },
        {
          style: "sectionHeader",
          text: "গ্রাহকের তথ্য",
          margin: [0, 0, 0, 6],
        },
        {
          table: {
            widths: ["25%", "75%"],
            body: [
              ["নাম:", order?.userId?.name || "--"],
              ["ফোন:", order?.delivery_address?.mobile || "--"],
              ["ইমেইল:", order?.userId?.email || "--"],
              ["ঠিকানা:", `${order?.delivery_address?.address_line || "--"}, ${order?.delivery_address?.city || "--"}, ${order?.delivery_address?.state || ""}`],
              ["স্ট্যাটাস:", order?.order_status || "--"],
              ["পেমেন্ট:", order?.paymentId || "Cash on Delivery"],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 15],
        },
        {
          style: "sectionHeader",
          text: "পণ্যের তালিকা",
          margin: [0, 0, 0, 6],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              [
                { text: "প্রোডাক্ট", style: "tableHeader" },
                { text: "পরিমাণ", style: "tableHeader" },
                { text: "মূল্য", style: "tableHeader" },
                { text: "সাবটোটাল", style: "tableHeader" },
              ],
              ...order?.products?.map((item) => [
                item?.productTitle || "--",
                item?.quantity || 0,
                (item?.price || 0).toFixed(2),
                ((item?.quantity || 0) * (item?.price || 0)).toFixed(2),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          columns: [
            { text: "" },
            {
              width: "auto",
              table: {
                body: [
                  ["সাবটোটাল:", `${order?.subTotalAmt || 0}`],
                  ["ডেলিভারি চার্জ:", `${order?.delivery_charge || 0}`],
                  [
                    { text: "মোট:", bold: true },
                    { text: `${order?.totalAmt || 0}`, bold: true },
                  ],
                ],
              },
              layout: "noBorders",
            },
          ],
          margin: [0, 15, 0, 20],
        },
        {
          columns: [
            { text: "" },
            {
              stack: [
                { text: "Authorized Signature", alignment: "right", margin: [0, 40, 0, 0], italics: true },
                { canvas: [{ type: "line", x1: 350, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
              ],
            },
          ],
        },
        {
          text: "ধন্যবাদ আমাদের সাথে কেনাকাটা করার জন্য!",
          style: "thankyou",
          alignment: "center",
          margin: [0, 40, 0, 0],
        },
      ],
      styles: {
        companyName: { fontSize: 14, bold: true, color: "#2c3e50" },
        invoiceTitle: { fontSize: 16, bold: true, color: "#e74c3c" },
        sectionHeader: { fontSize: 13, bold: true, color: "#2980b9" },
        tableHeader: {
          bold: true,
          fillColor: "#2980b9",
          color: "white",
          alignment: "center",
        },
        thankyou: { fontSize: 12, italics: true, color: "#27ae60" },
      },
    };

    pdfMake.createPdf(docDefinition).download(`order-${order?._id}.pdf`);
  };


const exportAllOrderDetailsPdf = (orders) => {
  const content = [];

  content.push({
    text: `সব অর্ডারের রিপোর্ট (${orders.length} টি অর্ডার)`,
    style: "header",
    margin: [0, 0, 0, 15],
  });

  const tableBody = [
    [
      { text: "অর্ডার ID", style: "tableHeader" },
      { text: "নাম", style: "tableHeader" },
      { text: "ফোন", style: "tableHeader" },
      { text: "ঠিকানা", style: "tableHeader" },
      { text: "স্ট্যাটাস", style: "tableHeader" },
      { text: "তারিখ", style: "tableHeader" },
      { text: "পেমেন্ট", style: "tableHeader" },
      { text: "মোট টাকা", style: "tableHeader" },
    ],
  ];

orders.forEach((order, index) => {
  content.push(
    { text: `অর্ডার #${index + 1}: ${order._id}`, style: "subHeader" },
    {
      table: {
        widths: ["25%", "75%"],
        body: [
          ["নাম:", order?.userId?.name || "--"],
          ["ফোন:", order?.delivery_address?.mobile || "--"],
          ["ঠিকানা:", `${order?.delivery_address?.address_line || "--"}, ${order?.delivery_address?.city || ""}`],
          ["স্ট্যাটাস:", order?.order_status || "--"],
          ["তারিখ:", new Date(order?.createdAt).toLocaleDateString()],
          ["পেমেন্ট:", order?.paymentId || "Cash on Delivery"],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 8],
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto"],
        body: [
          [
            { text: "প্রোডাক্ট", style: "tableHeader" },
            { text: "পরিমাণ", style: "tableHeader" },
            { text: "দাম", style: "tableHeader" },
            { text: "সাবটোটাল", style: "tableHeader" },
          ],
          ...order.products.map((p) => [
            p.productTitle || "--",
            p.quantity || 0,
            p.price?.toFixed(2) || "0.00",
            (p.quantity * p.price)?.toFixed(2) || "0.00",
          ]),
        ],
      },
      layout: "lightHorizontalLines",
    },
    {
      columns: [
        { text: "" },
        {
          width: "auto",
          table: {
            body: [
              ["Subtotal:", `${order?.subTotalAmt || 0}`],
              ["Delivery Charge:", `${order?.delivery_charge || 0}`],
              [
                { text: "মোট:", bold: true },
                { text: `${order?.totalAmt || 0}`, bold: true },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
      margin: [0, 10, 0, 20],
    }
  );

  // এখানে পেজ ব্রেক সরিয়ে দিলাম, আর কোনো কোড রাখলাম না
  // if (index !== orders.length - 1) {
  //   content.push({ text: "", pageBreak: "after" });
  // }
});


  content.push({
    table: {
      headerRows: 1,
      widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
      body: tableBody,
    },
    layout: "lightHorizontalLines",
  });

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [20, 30, 20, 30],
    defaultStyle: {
      font: "NotoSansBangla",
      fontSize: 9,
    },
    content,
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        alignment: "center",
        color: "#2c3e50",
      },
      tableHeader: {
        bold: true,
        fillColor: "#393a3bff",
        color: "white",
        alignment: "center",
        fontSize: 10,
      },
    },
  };

  pdfMake.createPdf(docDefinition).download("All_Orders_List.pdf");
};

const exportDeliveryLabel = (order) => {
  const docDefinition = {
    pageSize: { width: 300, height: 230 },
    pageMargins: [15, 15, 15, 15],
    defaultStyle: { font: "NotoSansBangla", fontSize: 10 },
    content: [
      {
        columns: [
          { image: companyLogo, width: 40 },
          {
            stack: [
              { text: "EnaBazar.com", bold: true, fontSize: 12 },
              { text: "ঠিকানা: IslamPur Road, Feni, 3900", fontSize: 8, color: "#555" },
              { text: "ফোন: 0167484746", fontSize: 8, color: "#555" },
            ],
            margin: [5, 0, 0, 0],
          },
        ],
      },
      { text: "\n" },
      { text: "ডেলিভারি ঠিকানা ", style: "header", alignment: "center", bold: true, fontSize: 12, margin: [0, 0, 0, 10] },
      {
        table: {
          widths: ["25%", "75%"],
          body: [
            ["নাম:", order?.userId?.name || "--"],
            ["ফোন:", order?.delivery_address?.mobile || "--"],
            ["ঠিকানা:", `${order?.delivery_address?.address_line || "--"}, ${order?.delivery_address?.city || ""}`],
            ["পেমেন্ট:", order?.paymentId || "Cash on Delivery"],
            ["মোট:", `${order?.totalAmt || 0} ৳`],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 30], // footer এর জন্য extra space
      },

      // ===== Footer manually placed =====
   {
  text: "আপনার ক্রয়ের জন্য ধন্যবাদ!\nwww.enabazar.com | সাপোর্ট: support@enabazar.com",
  fontSize: 8,
  color: "#666",
  alignment: "center",
  absolutePosition: { x: 15, y: 190 } // page bottom এর কাছাকাছি
}

    ],
    styles: {
      header: { fontSize: 12, bold: true },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};








  return (
    <div className="card my-4 shadow-md sm:rounded-lg bg-white">
     <div className="flex flex-col gap-4 px-5 py-3">
  {/* Title and Order Count */}
  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
    <div>
      <h2 className="text-lg font-semibold">Recent Orders</h2>
      <p className="text-[12px] text-gray-600">
        There are <span className="font-bold text-[#ff5252]">{filteredOrders?.length}</span>
         orders in this page
      </p>
    </div>

    {/* Search Box */}
    <div className="w-full sm:w-[300px]">
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resetPage={(page) => setCurrentPage(page)}
      />
    </div>
  </div>

  {/* Date Filters + Buttons */}
  <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-4 w-full">
    {/* Start Date */}
    <div className="w-full sm:w-auto">
      <input
        type="date"
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          setCurrentPage(1);
        }}
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>

    {/* Separator */}
    <div className="text-gray-500 text-center sm:text-left">to</div>

    {/* End Date */}
    <div className="w-full sm:w-auto">
      <input
        type="date"
        value={endDate}
        onChange={(e) => {
          setEndDate(e.target.value);
          setCurrentPage(1);
        }}
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 w-full !mt-3 sm:w-auto">
      <Button
        variant="contained"
        color="primary"
     onClick={() => exportAllOrderDetailsPdf(orders)}
        className="w-full sm:w-auto"
      >
        Export PDF
      </Button>

      <button
        className="px-4 py-2 bg-gray-300 text-black  rounded-md w-full sm:w-auto"
        onClick={() => {
          setStartDate("");
          setEndDate("");
          fetchOrders(1);
        }}
      >
        Clear
      </button>
    </div>
  </div>
</div>


      <div className="relative overflow-x-auto max-h-[600px] pr-2 mb-4 mt-5">
        <table className="w-full min-w-[1200px] text-sm text-left">
          <thead className="uppercase bg-[rgba(0,0,0,0.1)] border-b-[gray]">
            <tr className="!text-[12px]">
              <th className="px-3 py-2">&nbsp;</th>
              <th className="px-3 py-2 whitespace-nowrap">Order Id</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2 hidden sm:table-cell">Phone</th>
              <th className="px-3 py-2 hidden lg:table-cell">Address</th>
              <th className="px-3 py-2 hidden lg:table-cell">Pincode</th>
              <th className="px-3 py-2">Subtotal</th>
              <th className="px-3 py-2 hidden sm:table-cell">D.Charge</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2 hidden lg:table-cell">Email</th>
              <th className="px-3 py-2 hidden sm:table-cell">User Id</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 hidden sm:table-cell">Date</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((order, index) => (
              <React.Fragment key={order?._id}>

                <tr className="bg-white border-b border-[rgba(0,0,0,0.1)]">
                  <td className="px-3 py-2">
                    <Button
                      className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]"
                      onClick={() => toggleOrderProduct(index)}
                    >
                      {isOpenOrderProduct === index ? <FaAngleUp /> : <FaAngleDown />}
                    </Button>
                  </td>
                  <td className="px-3 py-2 text-[#ff5252]">{order?._id}</td>
                  <td className="px-3 py-2">{order?.paymentId || "Cash on Delivery"}</td>
                  <td className="px-3 py-2">{order?.userId?.name}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{order?.delivery_address?.mobile || "--"}</td>
                  <td className="px-3 py-2 hidden lg:table-cell">{order?.delivery_address?.address_line}</td>
                  <td className="px-3 py-2 hidden lg:table-cell">{order?.delivery_address?.pincode || "--"}</td>
                  <td className="px-3 py-2">{order?.subTotalAmt}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{order?.delivery_charge}</td>
                  <td className="px-3 py-2">{order?.totalAmt}</td>
                  <td className="px-3 py-2 hidden lg:table-cell">{order?.userId?.email}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{order?.userId?._id}</td>
                  <td className="px-3 py-2">
                    <Select value={order?.order_status || ""} onChange={(e) => handleChange(e, order?._id)} className="w-full h-[30px]">
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"confirm"}>Confirm</MenuItem>
                      <MenuItem value={"delivered"}>Delivered</MenuItem>
                    </Select>
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">
                    {new Date(order?.createdAt?.split("T")[0]).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <Button variant="outlined" size="small" onClick={() => handleViewOrderDetails(order)}>View</Button>
                  </td>
                </tr>


     {isOpenOrderProduct === index && (
                  <tr>
                    <td colSpan="15" className="pl-4 bg-[#fafafa] overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="capitalize bg-[rgba(0,0,0,0.1)] border-b-[gray]">
                          <tr>
                            <th className="px-3 py-2 w-[150px]">Product Id</th>
                            <th className="px-3 py-2 w-[150px]">Product Name</th>
                            <th className="px-3 py-2">Image</th>
                            <th className="px-3 py-2">Quantity</th>
                            <th className="px-3 py-2">Price</th>
                            <th className="px-3 py-2">Sub Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.products?.map((item) => (
                            <tr key={item?.productId?._id} className="bg-white border-b border-[rgba(0,0,0,0.2)]">
                              <td className="px-3 py-2 text-[#ff5252]">{item?.productId}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{item?.productTitle}</td>
                              <td className="px-3 py-2">
                                <img
                                  src={item?.image || '/no-image.png'}
                                  alt={item?.productTitle}
                                  className="w-[50px] h-[50px] object-cover rounded-md"
                                />
                              </td>
                              <td className="px-3 py-2">{item?.quantity}</td>
                              <td className="px-3 py-2">{item?.price}</td>
                              <td className="px-3 py-2">{item?.quantity * item?.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}


              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end py-4">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="small" />
      </div>

      {/* ========= ORDER DETAILS MODAL ========= */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>অর্ডারের বিস্তারিত</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <div className="space-y-4 text-[14px]">
              <p><strong>নাম:</strong> {selectedOrder?.userId?.name}</p>
              <p><strong>ফোন:</strong> {selectedOrder?.delivery_address?.mobile}</p>
              <p><strong>ঠিকানা:</strong> {selectedOrder?.delivery_address?.address_line}, {selectedOrder?.delivery_address?.city}</p>
              <p><strong>স্ট্যাটাস:</strong> {selectedOrder?.order_status}</p>

              <div>
                <strong>পণ্য:</strong>
                <table className="w-full mt-2 border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">প্রোডাক্ট</th>
                      <th className="border px-2 py-1">পরিমাণ</th>
                      <th className="border px-2 py-1">দাম</th>
                      <th className="border px-2 py-1">সাবটোটাল</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{item.productTitle}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">{item.price}</td>
                        <td className="border px-2 py-1">{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </DialogContent>


      
        <DialogActions>
  <Button onClick={handleCloseModal} color="inherit">বন্ধ করুন</Button>

  {/* Delivery Label Print */}
  <Button variant="contained" color="primary" onClick={() => {
    exportDeliveryLabel(selectedOrder);
  }}>
    ডেলিভারি লেবেল
  </Button>

  {/* Invoice Download */}
  <Button variant="contained" color="secondary" onClick={() => {
    exportOrderInvoice(selectedOrder);
    handleCloseModal();
  }}>
    ডাউনলোড ইনভয়েস
  </Button>
</DialogActions>

      </Dialog>
    </div>
  );
};

export default Orders;

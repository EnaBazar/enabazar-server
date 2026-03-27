import React, { useContext, useEffect, useState, useMemo } from "react";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, Typography } from "@mui/material";
import { GoTrash } from "react-icons/go";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";

const UserDetails = () => {
  const { openAlertBox } = useContext(MyContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [selectedCities, setSelectedCities] = useState([]);
  const [expandedCities, setExpandedCities] = useState([]);
  const [customMessage, setCustomMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState(null); // modal open

  // Fetch users
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchDataFromApi("/auth/getAllUser");
      if (res?.success) setUsers(res.users || []);
    } catch (error) {
      openAlertBox("error", "Users fetch করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteData(`/auth/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      openAlertBox("success", "User Deleted");
    } catch (error) {
      openAlertBox("error", "Delete করতে সমস্যা হয়েছে");
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.name || "";
      const email = user.email || "";
      const mobile = user.mobile || "";
      const addrString =
        user.address_details?.map((a) => `${a.city} ${a.upazila}`).join(" ") || "";

      const term = search.toLowerCase();
      return (
        name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        mobile.includes(term) ||
        addrString.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  // City statistics with upazila counts
  const cityStats = useMemo(() => {
    const stats = {};
    filteredUsers.forEach((user) => {
      user.address_details?.forEach((addr) => {
        if (!stats[addr.city]) stats[addr.city] = {};
        if (!stats[addr.city][addr.upazila]) stats[addr.city][addr.upazila] = 0;
        stats[addr.city][addr.upazila] += 1;
      });
    });
    return stats; // { city: { upazila: userCount } }
  }, [filteredUsers]);

  // City checkbox toggle
  const toggleCitySelection = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // City expand/collapse toggle
  const toggleCityExpansion = (city) => {
    setExpandedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // Send Custom SMS
  const sendCustomSMS = async () => {
    if (!customMessage.trim()) {
      openAlertBox("error", "Please enter a message before sending.");
      return;
    }

    if (selectedCities.length === 0) {
      openAlertBox("error", "Please select at least one city.");
      return;
    }

    let smsList = [];

    filteredUsers.forEach((user) => {
      user.address_details?.forEach((addr) => {
        if (selectedCities.includes(addr.city) && user.mobile) {
          smsList.push({
            mobile: user.mobile,
            message: `Dear ${user.name || "Customer"}, ${customMessage}`,
          });
        }
      });
    });

    // Remove duplicate mobiles
    const uniqueMap = new Map();
    smsList.forEach((item) => {
      if (!uniqueMap.has(item.mobile)) {
        uniqueMap.set(item.mobile, item);
      }
    });

    smsList = Array.from(uniqueMap.values());

    if (smsList.length === 0) {
      openAlertBox("error", "No users found.");
      return;
    }

    try {
      const res = await fetch("https://api.goroabazar.com/promosms/sendBulkSMS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smsList }),
      });

      const data = await res.json();
      if (data.success) {
        openAlertBox("success", data.message || `SMS sent successfully (${smsList.length})`);
        setCustomMessage("");
      } else openAlertBox("error", data.message || "SMS failed");
    } catch (error) {
      openAlertBox("error", "Network error. Please try again.");
    }
  };

  const highlightMatch = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200'>$1</mark>");
  };

  const handleOpenModal = (user) => setSelectedUser(user);
  const handleCloseModal = () => setSelectedUser(null);

  return (
    <section className="py-6 w-full text-[12px]">
      <div className="container mx-auto w-[95%] flex flex-col gap-6">

        {/* City Statistics */}
        <div className="bg-white shadow rounded p-3 border">
          <h3 className="text-sm font-semibold mb-2">City Statistics (Click to Select)</h3>
          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {Object.entries(cityStats).map(([city, upazilas]) => (
              <div key={city} className="flex flex-col border rounded">
                <label
                  className={`flex items-center justify-between px-2 py-1 cursor-pointer text-[11px]
                    ${selectedCities.includes(city) ? "bg-blue-100 border-blue-400" : "bg-gray-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={selectedCities.includes(city)}
                      onChange={() => toggleCitySelection(city)}
                    />
                    <span>{city} ({Object.values(upazilas).reduce((a,b)=>a+b,0)})</span>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] text-gray-500"
                    onClick={() => toggleCityExpansion(city)}
                  >
                    {expandedCities.includes(city) ? "▲" : "▼"}
                  </button>
                </label>

                {expandedCities.includes(city) && (
                  <div className="pl-6 pb-1 flex flex-col gap-1 text-[10px]">
                    {Object.entries(upazilas).map(([upazila, count]) => (
                      <span
                        key={upazila}
                        className="px-2 py-0.5 border rounded bg-gray-100 flex justify-between w-full sm:w-36"
                      >
                        <span>{upazila}</span>
                        <span>({count})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom SMS */}
        <div className="bg-white shadow rounded p-3 border flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Send Promotional SMS</h3>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type your message here..."
            className="border rounded p-2 w-full text-[12px]"
            rows={3}
          />
          <Button
            className="btn-orgnge !w-[40%]"
            variant="contained"
            size="small"
            onClick={sendCustomSMS}
          >
            Send
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded p-4 border overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-3 mb-3">
            <div>
              <h2 className="text-sm md:text-base font-semibold">Users List</h2>
              <p className="text-[11px] md:text-sm mt-1">
                Total Users: <span className="text-blue-500 font-bold">{filteredUsers.length}</span>
              </p>
            </div>
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-2 py-1 text-[11px] md:text-sm outline-none w-full md:w-64"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-[11px] md:text-sm border-collapse table-auto md:table-fixed">
              <thead className="bg-gray-100 uppercase text-gray-700">
                <tr>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Mobile</th>
                  <th className="p-2 text-left">Upazila</th>
                  <th className="p-2 text-left">City</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOpenModal(user)}
                    >
                      <td className="p-2">
                        <img
                          src={user.avatar || "/user.png"}
                          className="w-8 h-8 rounded-full"
                          alt={user.name || "User Avatar"}
                          onError={(e) => (e.target.src = "/user.png")}
                        />
                      </td>
                      <td className="break-words" dangerouslySetInnerHTML={{ __html: highlightMatch(user.name) }} />
                      <td className="break-words">{user.mobile}</td>
                      <td className="break-words">{user.address_details?.[0]?.upazila || "--"}</td>
                      <td className="break-words">{user.address_details?.[0]?.city || "--"}</td>
                      <td className="p-2">
                        {user.isBlocked ? (
                          <span className="text-red-500 font-semibold">Blocked</span>
                        ) : (
                          <span className="text-green-500 font-semibold">Active</span>
                        )}
                      </td>
                      <td className="p-2">
                        <Button
                          color="error"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                          className="flex items-center justify-center"
                        >
                          <GoTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex justify-end">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="text-[11px] md:text-sm"
            />
          </div>
        </div>

        {/* User Details Modal */}
        <Dialog open={!!selectedUser} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent dividers>
            {selectedUser && (
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Basic Info */}
                <Box display="flex" gap={3} alignItems="center">
                  <img src={selectedUser.avatar || "/user.png"} width={80} height={80} style={{ borderRadius: "50%" }} />
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Typography><b>Name:</b> {selectedUser.name}</Typography>
                    <Typography><b>Mobile:</b> {selectedUser.mobile}</Typography>
                    <Typography><b>Email:</b> {selectedUser.email}</Typography>
                    <Typography><b>Status:</b> {selectedUser.isBlocked ? "Blocked" : "Active"}</Typography>
                    <Typography><b>Addresses:</b></Typography>
                    {selectedUser.address_details?.map((a, idx) => (
                      <Typography key={idx} ml={2}>- {a.city}, {a.upazila}</Typography>
                    ))}
                  </Box>
                </Box>

                {/* Orders Section */}
                <Box>
                  <Typography variant="h6" mb={1}>Order History</Typography>
                  {selectedUser.orders?.length > 0 ? (
                    <Box className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-sm border-collapse table-auto">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            <th className="p-2 text-left">Order ID</th>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Items</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Confirmed</th>
                            <th className="p-2 text-left">Shipped</th>
                            <th className="p-2 text-left">Returned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                              <td className="p-2">{order._id}</td>
                              <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="p-2">{order.items.map(i => i.name).join(", ")}</td>
                              <td className="p-2">{order.items.map(i => i.quantity).reduce((a,b)=>a+b,0)}</td>
                              <td className="p-2">${order.items.map(i => i.price * i.quantity).reduce((a,b)=>a+b,0).toFixed(2)}</td>
                              <td className="p-2">{order.isConfirmed ? "✔" : "❌"}</td>
                              <td className="p-2">{order.isShipped ? "✔" : "❌"}</td>
                              <td className="p-2">{order.isReturned ? "✔" : "❌"}</td>
                            </tr>
                            
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  ) : (
                    <Typography>No orders found.</Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

      </div>
    </section>
  );
};

export default UserDetails;
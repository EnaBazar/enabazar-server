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

  const handlePrint = () => {
    window.print();
  };

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

  // Split Active / Blocked
  const activeUsers = useMemo(() => filteredUsers.filter((u) => !u.isBlocked), [filteredUsers]);
  const blockedUsers = useMemo(() => filteredUsers.filter((u) => u.isBlocked), [filteredUsers]);

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

  const handleOpenModal = async (user) => {
    try {
      const res = await fetchDataFromApi(`/order/user-orders/${user._id}`);
      setSelectedUser({
        ...user,
        orders: res?.orders || [],
      });
    } catch (error) {
      openAlertBox("error", "Orders load করতে সমস্যা হয়েছে");
      setSelectedUser({
        ...user,
        orders: [],
      });
    }
  };
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

        {/* ================= ACTIVE USERS ================= */}
        <div className="bg-white shadow rounded p-4 border overflow-x-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-3 mb-3">
            <div>
              <h2 className="text-sm md:text-base font-semibold">Active Users</h2>
              <div className="flex gap-4 mt-1 flex-wrap">
                <p className="text-[11px] md:text-sm">
                  Total:
                  <span className="text-blue-500 font-bold ml-1">{filteredUsers.length}</span>
                </p>
                <p className="text-[11px] md:text-sm">
                  Active:
                  <span className="text-green-600 font-bold ml-1">{activeUsers.length}</span>
                </p>
                <p className="text-[11px] md:text-sm">
                  Blocked:
                  <span className="text-red-500 font-bold ml-1">{blockedUsers.length}</span>
                </p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-2 py-1 text-[11px] md:text-sm outline-none w-full md:w-64"
            />
          </div>

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
                {activeUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
                {activeUsers
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
                        <span className="text-green-500 font-semibold">Active</span>
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
              count={activeUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="text-[11px] md:text-sm"
            />
          </div>
        </div>

        {/* ================= BLOCKED USERS ================= */}
        <div className="bg-red-50 shadow rounded p-4 border mt-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm md:text-base font-semibold text-red-600">Blocked Users List</h2>
            <span className="text-[11px] bg-red-100 text-red-600 px-2 py-1 rounded">
              {blockedUsers.length} Blocked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-[11px] md:text-sm border-collapse table-auto md:table-fixed">
              <thead className="bg-red-100 uppercase text-gray-700">
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
                {blockedUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No blocked users found
                    </td>
                  </tr>
                )}

                {blockedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-red-100 cursor-pointer"
                    onClick={() => handleOpenModal(user)}
                  >
                    <td className="p-2">
                      <img
                        src={user.avatar || "/user.png"}
                        className="w-8 h-8 rounded-full"
                        alt={user.name || "User"}
                        onError={(e) => { e.target.src = "/user.png"; }}
                      />
                    </td>
                    <td className="p-2 break-words">{user.name}</td>
                    <td className="p-2 break-words">{user.mobile}</td>
                    <td className="p-2 break-words">{user.address_details?.[0]?.upazila || "--"}</td>
                    <td className="p-2 break-words">{user.address_details?.[0]?.city || "--"}</td>
                    <td className="p-2">
                      <span className="text-red-500 font-semibold">Blocked</span>
                    </td>
                    <td className="p-2">
                      <Button
                        color="error"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                      >
                        <GoTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= USER DETAILS MODAL ================= */}
        <Dialog open={!!selectedUser} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>User Details</DialogTitle>

          <DialogContent dividers>
            {selectedUser && (
              <Box className="print-area" display="flex" flexDirection="column" gap={3}>
                {/* Header */}
                <Box textAlign="center" borderBottom="1px solid #eee" pb={2}>
                  <Typography variant="h5" fontWeight={600}>User Profile & Orders</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generated on: {new Date().toLocaleString()}
                  </Typography>
                </Box>

                {/* User Info */}
                <Box display="flex" gap={3} alignItems="center" p={2} border="1px solid #eee" borderRadius={2} bgcolor="#fafafa">
                  <img
                    src={selectedUser.avatar || "/user.png"}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full"
                    onError={(e) => (e.target.src = "/user.png")}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{selectedUser.name}</Typography>
                    <Typography variant="body2">Mobile: {selectedUser.mobile}</Typography>
                    <Typography variant="body2">Email: {selectedUser.email || "--"}</Typography>
                    <Typography variant="body2">
                      Address: {selectedUser.address_details?.map((a) => `${a.upazila}, ${a.city}`).join("; ") || "--"}
                    </Typography>
                  </Box>
                </Box>

                {/* Orders */}
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>Orders ({selectedUser.orders.length})</Typography>
                  {selectedUser.orders.length === 0 && (
                    <Typography variant="body2">No orders found</Typography>
                  )}
                  {selectedUser.orders.length > 0 && (
                    <Box overflow="auto">
                      <table className="w-full text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-gray-100 uppercase text-gray-700">
                            <th className="p-2 text-left">Order ID</th>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Amount</th>
                            <th className="p-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.orders.map((o) => (
                            <tr key={o._id} className="border-b">
                              <td className="p-2">{o._id}</td>
                              <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="p-2">{o.totalAmount} ৳</td>
                              <td className="p-2">{o.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
            <Button onClick={handlePrint} variant="contained">Print</Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

export default UserDetails;
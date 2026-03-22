import React, { useContext, useEffect, useState, useMemo } from "react";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
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
  const [customMessage, setCustomMessage] = useState("");

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
      const addrString = user.address_details?.map(a => `${a.city} ${a.upazila}`).join(" ") || "";

      const term = search.toLowerCase();
      return (
        name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        mobile.includes(term) ||
        addrString.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  // City statistics
  const cityStats = useMemo(() => {
    const stats = {};
    filteredUsers.forEach((user) => {
      user.address_details?.forEach((addr) => {
        if (!stats[addr.city]) stats[addr.city] = new Set();
        stats[addr.city].add(addr.upazila);
      });
    });
    return stats; // { city: Set of upazilas }
  }, [filteredUsers]);

  // Handle city checkbox
  const toggleCitySelection = (city) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  // Send custom SMS
  const sendCustomSMS = async () => {
    if (!customMessage.trim()) {
      openAlertBox("error", "Please enter a message before sending.");
      return;
    }
    if (selectedCities.length === 0) {
      openAlertBox("error", "Please select at least one city.");
      return;
    }

    const mobiles = [];
    filteredUsers.forEach((user) => {
      user.address_details?.forEach((addr) => {
        if (selectedCities.includes(addr.city) && user.mobile) {
          mobiles.push(user.mobile);
        }
      });
    });

    if (mobiles.length === 0) {
      openAlertBox("error", "No users found in the selected city/cities.");
      return;
    }

    try {
      const res = await fetch("/promosms/sendBulkSMS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobiles, message: customMessage }),
      });
      const data = await res.json();
      if (data.success) {
        openAlertBox("success", data.message);
        setCustomMessage("");
      } else {
        openAlertBox("error", data.message || "Failed to send SMS.");
      }
    } catch (error) {
      console.error(error);
      openAlertBox("error", "Unable to send SMS. Please try again later.");
    }
  };

  // Highlight search match
  const highlightMatch = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200'>$1</mark>");
  };

  return (
    <section className="py-6 w-full text-[12px]">
      <div className="container mx-auto w-[95%] flex flex-col gap-6">

        {/* City Statistics */}
        <div className="bg-white shadow rounded p-3 border">
          <h3 className="text-sm font-semibold mb-2">City Statistics (Click to Select)</h3>
          <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto">
            {Object.entries(cityStats).map(([city, upazilas]) => (
              <label
                key={city}
                className={`flex items-center gap-1 px-2 py-1 border rounded cursor-pointer text-[11px]
                ${selectedCities.includes(city) ? "bg-blue-100 border-blue-400" : "bg-gray-50"}`}
              >
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={selectedCities.includes(city)}
                  onChange={() => toggleCitySelection(city)}
                />
                <span>{city} ({upazilas.size})</span>
              </label>
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
            variant="contained"
            color="primary"
            size="small"
            onClick={sendCustomSMS}
          >
            Send SMS
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded p-3 border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b pb-2 mb-2">
            <div>
              <h2 className="text-sm font-semibold">Users List</h2>
              <p className="text-[11px] mt-1">
                Total Users: <span className="text-blue-500 font-bold">{filteredUsers.length}</span>
              </p>
            </div>
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-2 py-1 text-[11px] outline-none w-full md:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-gray-100 uppercase">
                <tr>
                  <th className="p-2">Image</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Upazila</th>
                  <th>City</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}

                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <img
                          src={user.avatar || "/user.png"}
                          className="w-8 h-8 rounded-full"
                          alt={user.name || "User Avatar"}
                          onError={(e) => (e.target.src = "/user.png")}
                        />
                      </td>
                      <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.name) }} />
                      <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.mobile) }} />
                      <td>{user.address_details?.[0]?.upazila || "--"}</td>
                      <td>{user.address_details?.[0]?.city || "--"}</td>
                      <td>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user._id)}
                        >
                          <GoTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="text-[11px]"
          />
        </div>
      </div>
    </section>
  );
};

export default UserDetails;
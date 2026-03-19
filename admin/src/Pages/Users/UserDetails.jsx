import React, { useState, useEffect, useRef, useContext } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Button, TablePagination } from "@mui/material";
import { GoTrash } from "react-icons/go";

const UserDetails = () => {
  const { openAlertBox } = useContext(MyContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [verifyFilter, setVerifyFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const timerRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await fetchDataFromApi(
        `/user/search-user?q=${encodeURIComponent(search)}&page=${page + 1}&limit=${rowsPerPage}&verify=${verifyFilter}`
      );
      if (res?.success) {
        setUsers(res.users);
        setTotal(res.total);
      }
    } catch {
      openAlertBox("error", "Failed to fetch users");
    }
  };

  useEffect(() => { fetchUsers(); }, [page, rowsPerPage, verifyFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if(timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setPage(0);
      fetchUsers();
    }, 300);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Do you want to delete this user?")) return;
    try {
      await deleteData(`/auth/${id}`);
      openAlertBox("success", "User deleted");
      fetchUsers();
    } catch {
      openAlertBox("error", "Delete failed");
    }
  };

  // City Stats
  const cityStats = users.reduce((acc, u) => {
    u.address_details?.forEach(addr => {
      if(addr.city) acc[addr.city] = (acc[addr.city] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-4">

      {/* City Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(cityStats).map(([city, count]) => (
          <div key={city} className="bg-white shadow rounded p-3 text-center">
            <p className="text-sm text-gray-500">City</p>
            <p className="font-bold text-[#ff5252] text-lg">{city}</p>
            <p className="text-xs mt-1">Users: {count}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Search Name or Mobile (বাংলা / English)"
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-2 py-1 w-full md:w-64"
        />
        <select
          value={verifyFilter}
          onChange={(e) => setVerifyFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Address</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.mobile}</td>
                <td className="p-2">
                  {u.address_details?.map((addr, i) => (
                    <span key={addr._id}>
                      {addr.address_line}, {addr.city} <b>[{addr.addressType}]</b>
                      {i !== u.address_details.length - 1 && "; "}
                    </span>
                  ))}
                </td>
                <td className="p-2">{u.verify_mobile ? "✅" : "❌"}</td>
                <td className="p-2">
                  <Button color="error" size="small" onClick={() => handleDelete(u._id)}>
                    <GoTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5,10,25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
      />
    </div>
  );
};

export default UserDetails;


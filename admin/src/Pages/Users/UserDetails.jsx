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
    const res = await fetchDataFromApi(
      `/auth/search-user?q=${encodeURIComponent(search)}&page=${page + 1}&limit=${rowsPerPage}}`
    );
    if (res?.success) {
      setUsers(res.users);
      setTotal(res.total);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, rowsPerPage, verifyFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPage(0);
      fetchUsers();
    }, 300);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteData(`/auth/${id}`);
      openAlertBox("success", "User deleted");
      fetchUsers();
    } catch {
      openAlertBox("error", "Delete failed");
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
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
            {users.map((u) => (
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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

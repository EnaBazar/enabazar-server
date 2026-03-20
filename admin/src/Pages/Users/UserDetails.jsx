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

  // Fetch Users
  const getUsers = async () => {
    try {
      const res = await fetchDataFromApi("/auth/getAllUser");
      if (res?.success) setUsers(res.users);
    } catch (error) {
      openAlertBox("error", "Users fetch করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Optimistic delete
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
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.mobile?.includes(search)
    );
  }, [users, search]);

  // City statistics
  const cityStats = useMemo(() => {
    const cityCount = {};
    users.forEach((user) => {
      const city = user.address_details?.[0]?.city;
      if (city) cityCount[city] = (cityCount[city] || 0) + 1;
    });
    return cityCount;
  }, [users]);

  return (
    <section className="py-10 w-full">
      <div className="container mx-auto w-[95%] flex flex-col gap-6">

        {/* City Stats List */}
        <div className="bg-white shadow-md rounded-md p-4 border">
          <h3 className="text-xl font-semibold mb-4">City Statistics</h3>
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(cityStats).length > 0 ? (
              <ul className="space-y-2">
                {Object.entries(cityStats).map(([city, count]) => (
                  <li
                    key={city}
                    className="flex justify-between items-center p-3 bg-[#ffebeb] rounded-md"
                  >
                    <span className="font-medium">{city}</span>
                    <span className="font-bold text-[#ff5252]">{count} Users</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No city data available</p>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-md rounded-md p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
            <div>
              <h2 className="text-xl font-semibold">Users List</h2>
              <p className="text-sm mt-1">
                Total Users: <span className="text-[#ff5252] font-bold">{users.length}</span>
              </p>
            </div>

            <input
              type="text"
              placeholder="Search user..."
              className="border rounded-md px-3 py-2 text-sm outline-none w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full overflow-x-auto mt-5">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="uppercase bg-[rgba(0,0,0,0.05)] text-[12px]">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={user?.avatar || "/user.png"}
                            alt={user.name || "User Avatar"}
                            onError={(e) => (e.target.src = "/user.png")}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3">{user.mobile || "--"}</td>
                   
<td className="px-4 py-3 max-w-[300px] text-[12px] overflow-hidden whitespace-nowrap">
  {user.address_details?.length > 0 ? (
    <span className="flex gap-2 items-center">
      {user.address_details
        .map((addr) => (
          <span key={addr._id} className="flex items-center gap-1">
            <span>
              {addr.address_line}, {addr.state},{addr.city}
            </span>
            <span className="bg-[#ff5252] text-white px-1 rounded text-[10px]">
              {addr.addressType}
            </span>
          </span>
        ))}
    </span>
  ) : (
    <span className="text-gray-400">No Address</span>
  )}
</td>


                      <td className="px-4 py-3">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user._id)}
                        >
                          <GoTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </section>
  );
};

export default UserDetails;
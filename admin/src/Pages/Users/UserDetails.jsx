import React, { useContext, useEffect, useState } from "react";
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

      if (res?.success) {
        setUsers(res?.users);
      }

    } catch (error) {
      openAlertBox("error", "Users fetch করতে সমস্যা হয়েছে");
    }
  };
// Fetch City
  const getCityStats = () => {
  const cityCount = {};

  users.forEach((user) => {
    const city = user.address_details?.[0]?.city;

    if (city) {
      cityCount[city] = (cityCount[city] || 0) + 1;
    }
  });

  return cityCount;
};
  useEffect(() => {
    getUsers();
  }, []);
const cityStats = getCityStats();


  // Delete user
  const handleDelete = async (id) => {

    try {

      await deleteData(`/auth/${id}`);

      openAlertBox("success", "User Deleted");

      getUsers();

    } catch (error) {

      openAlertBox("error", "Delete করতে সমস্যা হয়েছে");

    }

  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  // Search filter
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.mobile?.includes(search)
  );

  return (

    <section className="py-10 w-full">




      <div className="container mx-auto w-[95%]">
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  {Object.entries(cityStats).map(([city, count]) => (

    <div
      key={city}
      className="bg-white shadow-md rounded-md p-4 border hover:shadow-lg transition"
    >
      <h3 className="text-[14px] text-gray-500">City</h3>

      <p className="text-[18px] font-bold text-[#ff5252] mt-1">
        {city}
      </p>

      <p className="text-[13px] mt-1">
        Users : <span className="font-semibold">{count}</span>
      </p>

    </div>

  ))}

</div>


        <div className="shadow-md rounded-md p-5 bg-white">

          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4">

            <div>
              <h2 className="text-[18px] font-semibold">Users List</h2>
              <p className="text-[13px] mt-1">
                Total Users :
                <span className="text-[#ff5252] font-bold ml-1">
                  {users.length}
                </span>
              </p>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search user..."
              className="border rounded-md px-3 py-2 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-5">

            <table className="w-full text-sm text-left">

              <thead className="uppercase bg-[rgba(0,0,0,0.08)] text-[12px]">

                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (

                    <tr key={user._id} className="border-b">

                      <td className="px-4 py-3 font-medium">
                        {user.name}
                      </td>

                      <td className="px-4 py-3">
                        {user.mobile || "--"}
                      </td>

                      <td className="px-4 py-3">
                        {user.email || "--"}
                      </td>

                      <td className="px-4 py-3 max-w-[250px]">

                        {user.address_details?.length > 0 ? (

                          user.address_details.map((addr) => (

                            <p key={addr._id} className="text-[12px]">

                              {addr.address_line}, {addr.city}, {addr.state}

                              <span className="text-[#ff5252] ml-1">
                                ({addr.addressType})
                              </span>

                            </p>

                          ))

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
import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { GoTrash } from "react-icons/go";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";

const UserDetails = () => {
  const {openAlertBox } = useContext(MyContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
    const [userData, setUserData] = useState();

  // fetch all users
 

 useEffect(() => {
  const fetchAllUsers = async () => {
    try{
      const res = await fetchDataFromApi("/auth/getAllUser");
      if(res.success) setUserData(res.users);
    console.log(userData)
    }catch(err){
      openAlertBox("error","Users fetch করতে সমস্যা হয়েছে");
    }
  }
  fetchAllUsers();

}, []);
 
  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteId) {
        await deleteData(`/auth/${deleteId}`);
        openAlertBox("success", "User Deleted");
        getUsers();
      }
      setOpenConfirm(false);
    } catch (err) {
      openAlertBox("error", "Delete করতে সমস্যা হয়েছে");
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!userData || userData.length === 0) return <div>Loading Users...</div>;

  // safe: ensure userData is array
  const usersArray = Array.isArray(userData) ? userData : [userData];

  return (
    <div className="p-5">
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usersArray
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.mobile || "NONE"}</TableCell>
                  <TableCell>{user.email || "NONE"}</TableCell>
                  <TableCell>
                    {user.address_details?.length > 0 ? (
                      user.address_details.map((addr) => (
                        <div key={addr._id}>
                          {addr.address_line}, {addr.city}, {addr.state} ({addr.addressType})
                        </div>
                      ))
                    ) : (
                      "ঠিকানা নেই"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenConfirm(user._id)}
                    >
                      <GoTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={usersArray.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            আপনি কি নিশ্চিত এই ইউজার ডিলিট করতে চান?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};



export default UserDetails;
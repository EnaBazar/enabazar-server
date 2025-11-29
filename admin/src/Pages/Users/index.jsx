import React, { useContext, useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import { MdLocalPhone } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';
import { deleteData, fetchDataFromApi } from '../../utils/api';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { GoTrash } from 'react-icons/go';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'Userimage', label: 'USER IMAGE', minWidth: 80 },
  { id: 'username', label: 'USER NAME', minWidth: 100 },
  { id: 'useremail', label: 'USER EMAIL', minWidth: 150 },
  { id: 'userph', label: 'USER PHONE', minWidth: 100 },
  { id: 'createddate', label: 'CREATE DATE', minWidth: 100 },
];

const Users = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const [sortedIds, setSortedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMode, setDeleteMode] = useState("single"); // "single" | "multiple"

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getUsers();
  }, [currentPage, searchQuery]);

  const getUsers = () => {
    setIsLoading(true);
    fetchDataFromApi(`/auth/getAllUser`).then((res) => {
      setUserData(res?.users || []); // always array
      setIsLoading(false);
      setCurrentPage(res?.currentPage);
    });
  };

  const filteredUsers = userData?.filter(users =>
    users?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    users?.mobile?.toString()?.includes(searchQuery) ||
    users?.email?.toString()?.includes(searchQuery) ||
    users?.updatedAt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updatedItems = userData.map((item) => ({
      ...item,
      checked: isChecked,
    }));

    setUserData(updatedItems);
    if (isChecked) {
      const ids = updatedItems.map((item) => item._id);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckedboxChange = (e, id, index) => {
    const updatedItems = userData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setUserData(updatedItems);

    const selectedIds = updatedItems
      .filter((item) => item.checked)
      .map((item) => item._id);
    setSortedIds(selectedIds);
  };

  // Open dialog before delete
  const handleOpenConfirm = (id = null, mode = "single") => {
    setDeleteId(id);
    setDeleteMode(mode);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteMode === "single" && deleteId) {
      await deleteData(`/auth/${deleteId}`);
      context.openAlertBox("success", "User Deleted");
    }

    if (deleteMode === "multiple" && sortedIds.length > 0) {
      for (let id of sortedIds) {
        await deleteData(`/auth/${id}`);
      }
      context.openAlertBox("success", "Selected Users deleted");
      setSortedIds([]);
    }

    getUsers();
    setOpenConfirm(false);
  };

  return (
    <>
      <div className='card my-5 pt-5 shadow-md sm:rounded-lg bg-white '>
       <div className="flex flex-col sm:flex-row items-start sm:items-center w-full h-auto sm:h-[60px] px-5 py-3 sm:py-0 justify-between bg-gray-200 gap-3 sm:gap-0">
  {/* Left Section */}
  <div className="flex flex-col">
    <h2 className="text-base sm:text-lg font-semibold">Total Users</h2>
    <p className="text-[12px] sm:text-sm">
      There are{' '}
      <span className="font-bold text-[#ff5252]">{userData?.length}</span>{' '}
      Users in this page
    </p>
  </div>

  {/* Right Section */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-[30%]">
    {sortedIds.length !== 0 && (
      <Button
        variant="contained"
        size="small"
        color="error"
        onClick={() => handleOpenConfirm(null, "multiple")}
        className="w-full sm:w-auto"
      >
        Delete
      </Button>
    )}

    <SearchBox
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      resetPage={(page) => setCurrentPage(page)}
      className="w-full sm:w-auto"
    />
  </div>
</div>


        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow >
                <TableCell>
                  <Checkbox {...label}
                    size='small'
                    onChange={handleSelectAll}
                    checked={filteredUsers.length > 0 &&
                      filteredUsers.every(item => item.checked)} />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    className='!font-[600] !py-2'
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {
                !isLoading && filteredUsers?.length !== 0 &&
                filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.reverse()?.map((user, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox {...label}
                          size='small'
                          checked={user.checked === true ? true : false}
                          onChange={(e) => handleCheckedboxChange(e, user._id, index)} />
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-4 w-[45px] '>
                          <div className='img w-[45px] h-[45px] rounded-full overflow-hidden group'>
                            <Link to="/product/45745">
                              <img src={user?.avatar !== "" && user?.avatar !== undefined ? user?.avatar : '/user.png'} className='w-full h-[65px] group-hover:scale-105' />
                            </Link>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{user?.name}</TableCell>

                      <TableCell>
                        <span className='flex items-center gap-2'><MdOutlineMarkEmailRead className='text-[18px]' />{user?.email}</span>
                      </TableCell>

                      <TableCell>
                        <span className='flex items-center gap-2'><MdLocalPhone className='text-[18px]' />{user?.mobile === null ? 'NONE' : user?.mobile}</span>
                      </TableCell>

                      <TableCell>
                        <span className='flex items-center gap-2'><SlCalender className='text-[18px]' />{user?.createdAt?.split("T")[0]}</span>
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Button
                            className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !rounded-full !border !min-w-[35px] !border-[rgba(0,0,0,0.1)]'
                            onClick={() => handleOpenConfirm(user._id, "single")}
                          >
                            <GoTrash className='text-red-500' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={userData ? userData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* 🔹 Delete Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            আপনি কি নিশ্চিত {deleteMode === "multiple" ? "এই নির্বাচিত ইউজারগুলো" : "এই ইউজার"} ডিলিট করতে চান?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default Users;

import React, { useContext, useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import { IoMdAdd } from 'react-icons/io';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import { MyContext } from '../../App';
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'image', label: 'IMAGE', minWidth: 150 },
  { id: 'action', label: 'ACTION', minWidth: 100 },
];

const HomeSliderBanners = () => {
  const context = useContext(MyContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [slidesData, setSlidesData] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  

  useEffect(() => {
    getData();
  }, [context?.isOpenFullScreenPanel]);

  const getData = () => {
    fetchDataFromApi("/homeSlides").then((res) => {
      
        setSlidesData(res?.data);
    })
 
  };

 const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteMultipleData(`/homeSlides/${deleteId}`);
    context.openAlertBox('success', 'BannerV1 deleted');
    getData();
    setOpenConfirm(false);
    setDeleteId(null);
  };

  const deleteSlide = (id) => {
    deleteData(`/homeSlides/${id}`).then(() => {
      context.openAlertBox("success", "Slide deleted");
      getData();
    });
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
  {/* Header Section */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-0 mt-3 gap-3">
  <h2 className="text-[18px] sm:text-[20px] font-[600]">
    Home Slide Banner List
  </h2>

  <div className="w-full sm:w-auto flex items-center gap-3 justify-start sm:justify-end">
    <Button className="btn !bg-green-600 btn-sm !text-white w-full sm:w-auto">
      Export
    </Button>
    <Button
      className="btn-blue btn-sm !text-white w-full sm:w-auto flex items-center justify-center"
      onClick={() =>
        context.setIsOpenFullScreenPanel({
          open: true,
          model: "AddHomeSlide",
        })
      }
    >
      <IoMdAdd className="text-white text-[20px]" />
      Add Home Slide
    </Button>
  </div>
</div>

{/* Table Section */}
<div className="card my-5 shadow-md sm:rounded-lg bg-white overflow-x-auto">
  <TableContainer sx={{ maxHeight: 440 }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              width={column.minWidth}
              className="!font-[600] !py-2"
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {slidesData?.length !== 0 &&
          slidesData?.map((item, index) => {
            return (
              <TableRow key={item._id}>
                {/* Image Column */}
                <TableCell width={300}>
                  <div className="flex items-center gap-4 w-[300px]">
                    <div className="img w-full rounded-md overflow-hidden group">
                      <img
                        src={item?.images[0]}
                        alt="Slide"
                        className="w-full h-[65px] group-hover:scale-105 object-cover transition-all"
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Action Column */}
                <TableCell width={100}>
                  <div className="flex items-center gap-1">
                    <Button className="!w-[35px] !h-[35px] !bg-[#f1f1f1] !min-w-[35px] !border
                     !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]">
                      <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                    </Button>

                    <Button
         
                       onClick={() => handleOpenConfirm(item._id)}
                      className="!w-[35px] !h-[35px] !bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]"
                    >
                      <GoTrash className="text-[#ff5252] text-[20px]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>

  <TablePagination
    rowsPerPageOptions={[5, 10, 25, 100]}
    component="div"
    count={slidesData.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
</div>


     <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this BannerV1?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default HomeSliderBanners;

import React, { useContext, useEffect, useState } from 'react'
import Button from "@mui/material/Button"
import { IoMdAdd } from 'react-icons/io'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai'
import { GoTrash } from 'react-icons/go'
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi } from '../../utils/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// ✅ MUI Dialog Import
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";


const columns = [
  { id: 'image', label: 'IMAGE', minWidth: 150 },
  { id: 'name', label: 'CAT NAME', minWidth: 100 },
  { id: 'action', label: 'ACTION', minWidth: 100 },
];

const CategoryList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const context = useContext(MyContext);

  // ✅ Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDataFromApi("/category").then((res) => {
      context?.setCatData(res?.data);
    })
  }, [context?.isOpenFullScreenPanel]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // ✅ Delete function with Dialog confirm
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteData(`/category/${deleteId}`).then(() => {
        fetchDataFromApi("/category").then((res) => {
          context?.setCatData(res?.data);
        });
        context.openAlertBox("success", "Category Deleted Successfully");
      });
    }
    setOpenDialog(false);
    setDeleteId(null);
  };

  return (
    <>
   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-0 mt-3 gap-2">
  {/* Left Title */}
  <h2 className="text-[18px] sm:text-[20px] font-[600]">Category List</h2>

  {/* Right Controls */}
  <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
    <Button className="btn !bg-green-600 btn-sm !text-white">
      Export
    </Button>
    <Button
      className="btn-blue btn-sm !text-white flex items-center"
      onClick={() =>
        context.setIsOpenFullScreenPanel({
          open: true,
          model: "AddNewCategory",
        })
      }
    >
      <IoMdAdd className="text-white text-[20px]" />
      Add Category
    </Button>
  </div>
</div>


      <div className='card shadow-md sm:rounded-lg bg-white '>
        <br />

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow >
                {columns.map((column) => (
                  <TableCell
                    className='!font-[600] !py-2'
                    width={column.minWidth}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {context?.catData?.length !== 0 &&
                context?.catData?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell width={200}>
                      <div className='flex items-center gap-4 w-[100px]'>
                        <div className='img w-full rounded-md overflow-hidden group'>
                          <Link to="/product/45745" data-discover="true">
                            <LazyLoadImage
                              className='w-full h-[65px] group-hover:scale-105'
                              alt="image"
                              effect="blur"
                              wrapperProps={{
                                style: { transitionDelay: "1s" },
                              }}
                              src={item.images[0]}
                            />
                          </Link>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{item?.name}</TableCell>

                    <TableCell width={100}>
                      <div className='flex items-center gap-1'>
                        <Button
                          className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !min-w-[35px] !border 
                          !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]'
                          onClick={() =>
                            context.setIsOpenFullScreenPanel({
                              open: true,
                              model: 'Edit Category',
                              id: item?._id,
                            })
                          }
                        >
                          <AiOutlineEdit className='text-[rgba(0,0,0,0.7)] text-[20px]' />
                        </Button>

                        <Button
                          className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !min-w-[35px] !border 
                          !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]'
                          onClick={() => handleDeleteClick(item?._id)}
                        >
                          <GoTrash className='text-[#ff5252] text-[20px]' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={context?.catData?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CategoryList;

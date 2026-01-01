import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery
} from '@mui/material';
import { IoMdAdd } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi } from '../../utils/api';

const BannerV2List = () => {
  const context = useContext(MyContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [slidesData, setSlidesData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    getData();
  }, [context?.isOpenFullScreenPanel]);

  const getData = async () => {
    const res = await fetchDataFromApi('/bannerV2');
    setSlidesData(res?.data || []);
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteData(`/bannerV2/${deleteId}`);
    context.openAlertBox('success', 'BannerV2 deleted');
    getData();
    setOpenConfirm(false);
    setDeleteId(null);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3'>
        <h2 className='text-[20px] font-[600]'>BannerV2 List</h2>
        <Button
          className='btn-blue btn-sm !text-white flex items-center gap-2'
          onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Add BannerV2' })}
        >
          <IoMdAdd className='text-white text-[20px]' />
          Add BannerV2
        </Button>
      </div>

      <div className='card my-5 shadow-md sm:rounded-lg bg-white'>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className='!font-[600]'>IMAGE</TableCell>
                <TableCell className='!font-[600]'>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slidesData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <div className='flex items-center gap-3 w-full sm:w-[300px]'>
                      <div className='img w-full rounded-md overflow-hidden group'>
                        <img
                          src={item?.images[0] || '/no-image.png'}
                          alt='Slide'
                          className='w-full h-[65px] sm:h-[80px] object-cover group-hover:scale-105 
                          transition-transform duration-200'
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !min-w-[35px] !border 
                        !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]'
                        onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Edit BannerV2', id: item?._id })}
                      >
                        <AiOutlineEdit className='text-[rgba(0,0,0,0.7)] text-[20px]' />
                      </Button>

                      <Button
                        className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !min-w-[35px] !border 
                        !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]'
                        onClick={() => handleOpenConfirm(item._id)}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={slidesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className='sm:px-4'
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

export default BannerV2List;

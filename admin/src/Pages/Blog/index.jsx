import React, { useContext, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IoMdAdd } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi } from '../../utils/api';

// Strip HTML and truncate
const getPlainText = (html, maxLength = 150) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || '';
  return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
};

const columns = [
  { id: 'image', label: 'IMAGE', minWidth: 80 },
  { id: 'blogtitle', label: 'Title', minWidth: 150 },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'action', label: 'ACTION', minWidth: 100 },
];

const BlogList = () => {
  const context = useContext(MyContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [blogData, setBlogData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getData();
  }, [context?.isOpenFullScreenPanel]);

  const getData = () => {
    fetchDataFromApi("/blog").then((res) => {
      setBlogData(res?.blog || []);
    });
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteData(`/blog/${deleteId}`);
    context.openAlertBox("success", "Blog deleted");
    getData();
    setOpenConfirm(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 mt-3 gap-3'>
        <h2 className='text-xl font-semibold'>Blog List</h2>
        <Button
          className='btn-blue btn-sm !text-white flex items-center gap-2'
          onClick={() =>
            context.setIsOpenFullScreenPanel({ open: true, model: 'add Blog' })
          }
        >
          <IoMdAdd className='text-white text-lg' /> Add Blog
        </Button>
      </div>

      <div className='card my-5 shadow-md sm:rounded-lg bg-white'>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} width={column.minWidth} className='!font-semibold !py-2'>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {blogData.length > 0 &&
                blogData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <div className='w-20 h-16 rounded-md overflow-hidden'>
                          <img
                            src={item?.images?.[0]}
                            alt='Blog'
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className='text-sm font-medium'>{item?.blogtitle}</span>
                      </TableCell>

                      <TableCell>
                        <span className='text-sm text-gray-700'>{getPlainText(item?.description)}</span>
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Button
                            className='!w-9 !h-9 !bg-gray-100 !border !border-gray-200 !rounded-full hover:!bg-gray-300'
                            onClick={() =>
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: 'edit Blog',
                                id: item?._id,
                              })
                            }
                          >
                            <AiOutlineEdit className='text-gray-700 text-lg' />
                          </Button>
                          <Button
                            onClick={() => handleOpenConfirm(item._id)}
                            className='!w-9 !h-9 !bg-gray-100 !border !border-gray-200 !rounded-full hover:!bg-gray-300'
                          >
                            <GoTrash className='text-red-500 text-lg' />
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
          component='div'
          count={blogData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        />
      </div>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this blog?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color='error' variant='contained'>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogList;

import React, { useContext, useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import { IoMdAdd, IoMdRefresh } from 'react-icons/io';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Rating from '@mui/material/Rating';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi } from '../../utils/api';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'product', label: 'PRODUCT', minWidth: 150 },
  { id: 'category', label: 'CATEGORY', minWidth: 100 },
  { id: 'subcategory', label: 'SUB-CATEGORY', minWidth: 150 },
  { id: 'price', label: 'PRICE', minWidth: 100 },
  { id: 'sale', label: 'SALES', minWidth: 100 },
  { id: 'rating', label: 'RATING', minWidth: 100 },
  { id: 'action', label: 'ACTION', minWidth: 120 },
];

const Products = () => {
  const context = useContext(MyContext);
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productCat, setProductCat] = useState('');
  const [productsubCat, setProductsubCat] = useState('');
  const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortedIds, setSortedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMode, setDeleteMode] = useState("single"); // single | multiple

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi("/product/getAllProduct");
      if (res?.error === false) {
        const productArr = res.products.map(product => ({ ...product, checked: false })).reverse();
        setProductData(productArr);
        setFilteredData(productArr);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters and reload
  const handleRefresh = () => {
    setSearchTerm('');
    setProductCat('');
    setProductsubCat('');
    setProductThirdLevelCat('');
    getProducts();
  };

  useEffect(() => {
    getProducts();
  }, [context?.isOpenFullScreenPanel]);

  // filter products by searchTerm
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(productData);
    } else {
      const filtered = productData.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.catName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subCat?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, productData]);

  const fetchByCategory = async (url, setter) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(url);
      if (res?.error === false) {
        const products = res.products.map(p => ({ ...p, checked: false })).reverse();
        setProductData(products);
        setFilteredData(products);
        setter(url.split('/').pop());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeProductCat = (e) => fetchByCategory(`/product/getAllProductByCatId/${e.target.value}`, setProductCat);
  const handleChangeProductsubCat = (e) => fetchByCategory(`/product/getAllProductBySubCatId/${e.target.value}`, setProductsubCat);
  const handleChangeProductThirdLevelCat = (e) => fetchByCategory(`/product/getAllProductByThirdCatId/${e.target.value}`, setProductThirdLevelCat);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updated = filteredData.map(p => ({ ...p, checked: isChecked }));
    setFilteredData(updated);
    setSortedIds(isChecked ? updated.map(p => p._id).sort() : []);
  };

  const handleCheckedboxChange = (e, id) => {
    const updated = filteredData.map(p => p._id === id ? { ...p, checked: !p.checked } : p);
    setFilteredData(updated);
    setSortedIds(updated.filter(p => p.checked).map(p => p._id).sort());
  };

  // confirm dialog open
  const handleOpenConfirm = (id = null, mode = "single") => {
    setDeleteId(id);
    setDeleteMode(mode);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteMode === "single" && deleteId) {
      await deleteData(`/product/${deleteId}`);
      context.openAlertBox("success", "Product Deleted");
    }

    if (deleteMode === "multiple" && sortedIds.length > 0) {
      for (let id of sortedIds) {
        await deleteData(`/product/${id}`);
      }
      context.openAlertBox("success", "Selected products deleted");
      setSortedIds([]);
    }

    getProducts();
    setOpenConfirm(false);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <section className='p-2 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-0 mt-3">
  {/* Left Title */}
  <h2 className="text-[18px] sm:text-[20px] font-[600] mb-2 sm:mb-0">
    Products{" "}
    <span className="text-[12px] font-[600]">(Material UI Table)</span>
  </h2>

  {/* Right Controls */}
  <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end overflow-x-auto">
    <Button
      onClick={handleRefresh}
      variant="outlined"
      className="btn-sm whitespace-nowrap"
      size="small"
      startIcon={<IoMdRefresh />}
    >
      Refresh
    </Button>

    {sortedIds.length !== 0 && (
      <Button
        variant="contained"
        className="btn-sm whitespace-nowrap"
        size="small"
        color="error"
        onClick={() => handleOpenConfirm(null, "multiple")}
      >
        Delete
      </Button>
    )}

    <Button className="!bg-green-600 btn-sm !text-white whitespace-nowrap">
      Export
    </Button>

    <Button
      className="btn-blue btn-sm !text-white flex items-center justify-center whitespace-nowrap"
      onClick={() =>
        context.setIsOpenFullScreenPanel({ open: true, model: "Add Product" })
      }
    >
      <IoMdAdd className="text-white text-[20px]" />
      Add Product
    </Button>
  </div>
</div>





    <div className="flex flex-wrap items-start sm:items-center w-full px-5 justify-between gap-4 ">
  {/* Category Selectors */}
  <div className="flex flex-col w-full sm:w-[17%] min-w-[140px]">
    <h4 className="text-[14px] font-[600] mb-2 sm:mb-3 ">Category By</h4>
    <Select
      className="w-full h-[35px]"
      size="small"
      value={productCat}
      onChange={handleChangeProductCat}
      displayEmpty
    >
      <MenuItem value="">All</MenuItem>
      {context.catData?.map((cat) => (
        <MenuItem key={cat._id} value={cat._id}>
          {cat.name}
        </MenuItem>
      ))}
    </Select>
  </div>

  <div className="flex flex-col w-full sm:w-[17%] min-w-[140px]">
    <h4 className="text-[14px] font-[600] mb-2 sm:mb-3">Sub Category By</h4>
    <Select
      className="w-full h-[35px]"
      size="small"
      value={productsubCat}
      onChange={handleChangeProductsubCat}
      displayEmpty
    >
      <MenuItem value="">All</MenuItem>
      {context.catData?.flatMap((cat) =>
        cat.children?.map((sub) => (
          <MenuItem key={sub._id} value={sub._id}>
            {sub.name}
          </MenuItem>
        ))
      )}
    </Select>
  </div>

  <div className="flex flex-col w-full sm:w-[17%] min-w-[140px]">
    <h4 className="text-[14px] font-[600] mb-2 sm:mb-3">Third Level Category By</h4>
    <Select
      className="w-full h-[35px]"
      size="small"
      value={productThirdLevelCat}
      onChange={handleChangeProductThirdLevelCat}
      displayEmpty
    >
      <MenuItem value="">All</MenuItem>
      {context.catData?.flatMap((cat) =>
        cat.children?.flatMap((sub) =>
          sub.children?.map((third) => (
            <MenuItem key={third._id} value={third._id}>
              {third.name}
            </MenuItem>
          ))
        )
      )}
    </Select>
  </div>

  {/* Search Box */}
  <div className="w-full sm:w-[30%] ml-auto min-w-[140px]">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
</div>


        <br />

        {loading ? (
          <div className="text-center py-10"><CircularProgress /></div>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><Checkbox {...label} size='small' onChange={handleSelectAll} checked={filteredData.length > 0 && filteredData.every(item => item.checked)} /></TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} className='!font-[600] !py-2' style={{ minWidth: column.minWidth }}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center">No Products Found</TableCell></TableRow>
                  ) : (
                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                      <TableRow key={product._id}>
                        <TableCell><Checkbox {...label} size='small' checked={product.checked} onChange={(e) => handleCheckedboxChange(e, product._id)} /></TableCell>
                        <TableCell>
                          <div className='flex items-center gap-4 w-[300px]'>
                            <div className='img rounded-md overflow-hidden group'>
                              <Link to={`/product/${product._id}`}><LazyLoadImage className='w-full h-[65px] group-hover:scale-105' alt="product" effect="blur" src={product?.images?.[0] || '/placeholder.jpg'} /></Link>
                            </div>
                            <div className='info w-[75%]'>
                              <h3 className='font-[600] text-[12px] leading-4 hover:text-blue-700'><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
                              <span className='text-[12px]'>{product.brand}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.catName}</TableCell>
                        <TableCell>{product.subCat}</TableCell>
                        <TableCell>
                          <div className='flex flex-col gap-1'><span className='line-through text-[15px] font-[600]'>&#2547; {product.price}</span><span className='text-blue-700 text-[15px] font-[600]'>&#2547; {product.oldPrice}</span></div>
                        </TableCell>
                        <TableCell><span className='text-[14px]'><span className='font-[600]'>{product.sale}</span>Sale</span></TableCell>
                        <TableCell><Rating name='half-rating' size='small' defaultValue={product.rating} readOnly /></TableCell>

                        <TableCell>
                          <div className='flex items-center gap-1'>
                            <Button className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !rounded-full !min-w-[35px] !border !border-[rgba(0,0,0,0.1)]' onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Edit Product', id: product._id })}><AiOutlineEdit /></Button>
                            <Link to={`/product/${product._id}`}><Button className='!w-[35px] !h-[35px] !min-w-[35px] !bg-[#f1f1f1] !rounded-full !border !border-[rgba(0,0,0,0.1)]'><FaRegEye /></Button></Link>
                            <Button className='!w-[35px] !h-[35px] !bg-[#f1f1f1] !rounded-full !border !min-w-[35px] !border-[rgba(0,0,0,0.1)]' onClick={() => handleOpenConfirm(product._id, "single")}><GoTrash className='text-red-500' /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={filteredData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
          </>
        )}
  

      {/* 🔹 Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText className='text-[12px]'>
            আপনি কি নিশ্চিত {deleteMode === "multiple" ? "নির্বাচিত সব প্রোডাক্ট" : "এই প্রোডাক্ট"} ডিলিট করতে চান?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Products;

import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MyContext } from '../../App';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';

const AddWieght = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [isloading, setisLoading] = useState(false);
  const [editId, seteditId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Delete Dialog states
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(""); // "single" | "multiple"
  const [deleteId, setDeleteId] = useState(null);

  const context = useContext(MyContext);

  const getdata = () => {
    fetchDataFromApi("/product/productWieght/get").then((res) => {
      if (res?.error === false) {
        setData(res?.products);
      }
    });
  };

  const clearData = () => {
    setName("");
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = data.map((item) => item._id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  // === Delete Handlers with Dialog ===
  const handleOpenConfirmSingle = (id) => {
    setDeleteId(id);
    setDeleteMode("single");
    setOpenConfirm(true);
  };

  const handleOpenConfirmMultiple = () => {
    if (selectedItems.length === 0) {
      context.openAlertBox("error", "No items selected.");
      return;
    }
    setDeleteMode("multiple");
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteMode === "single" && deleteId) {
      await deleteData(`/product/productWieght/${deleteId}`);
      context.openAlertBox("success", "Product Deleted");
    } else if (deleteMode === "multiple") {
      for (let id of selectedItems) {
        await deleteData(`/product/productWieght/${id}`);
      }
      context.openAlertBox("success", "Selected Weights Deleted");
      setSelectedItems([]);
      setSelectAll(false);
    }
    getdata();
    setOpenConfirm(false);
    setDeleteId(null);
    setDeleteMode("");
  };

  const editItem = (id) => {
    fetchDataFromApi(`/product/productWieght/${id}`).then((res) => {
      setName(res?.products?.name);
      seteditId(res?.products?._id);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);

    if (name === "") {
      context.openAlertBox("error", "Please enter Product RAM");
      setisLoading(false);
      return;
    }

    if (editId === "") {
      postData(`/product/productWieght/create`, { name }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);
          setTimeout(() => {
            setisLoading(false);
            getdata();
            setName("");
          }, 300);
        } else {
          context.openAlertBox("error", res?.message);
          setisLoading(false);
        }
      });
    } else {
      editData(`/product/productWieght/updateProductWieght/${editId}`, { name }).then((res) => {
        if (res?.data?.error === false) {
          context.openAlertBox("success", res?.data?.message);
          setTimeout(() => {
            setisLoading(false);
            getdata();
            setName("");
            seteditId("");
          }, 300);
        } else {
          context.openAlertBox("error", res?.data?.message);
          setisLoading(false);
        }
      });
    }
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <>
 <div className="flex flex-col items-start gap-4 w-full">

  {/* Heading */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-0 mt-3 w-full">
    <h2 className="text-[20px] font-[600]">
      Products Weight <span className="text-[12px] font-[600]">(Material UI Table)</span>
    </h2>
  </div>

  {/* Form Section */}
  <div className="card w-full sm:w-2/3 my-4 pb-5 shadow-md sm:rounded-lg bg-gray-200">
    <form className="form py-3 p-6" onSubmit={handleSubmit}>
      <div className="col w-full">
        <h3 className="text-[16px] font-[600]">
          Product Weight<span className="text-red-400"> *</span>
        </h3>
        <input
          type="text"
          className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
            focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] 
            rounded-sm text-sm px-2"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
        <Button type="submit" className="btn-blue btn-sm flex justify-center gap-2">
          <FaCloudUploadAlt className="text-[20px]" />
          {isloading ? <CircularProgress color="inherit" size={20} /> : "Publish and View"}
        </Button>
        <Button type="button" className="btn-blue btn-sm flex justify-center gap-2" onClick={clearData}>
          Clear
        </Button>
      </div>
    </form>
  </div>

  {/* Bulk Delete */}
  {selectedItems.length > 0 && (
    <div className="w-full sm:w-2/3 flex justify-end mb-2">
      <Button
        variant="contained"
        color="error"
        onClick={handleOpenConfirmMultiple}
        className="!text-white btn-sm"
      >
        Delete Selected ({selectedItems.length})
      </Button>
    </div>
  )}

  {/* Table Section */}
  {data?.length !== 0 && (
    <div className="card w-full sm:w-2/3 my-4 pb-5 shadow-md sm:rounded-lg bg-gray-200 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="uppercase border-b-[2px] border-b-[rgba(0,0,0,0.2)]">
          <tr>
            <th className="px-4 py-3 w-14">
              <Checkbox
                {...label}
                size="small"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3">Weight</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="px-4 py-3 w-14">
                <Checkbox
                  {...label}
                  size="small"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                />
              </td>
              <td className="px-4 py-3">{item?.name}</td>
              <td className="px-4 py-3 flex justify-end gap-2">
                <Button
                  className="!w-[35px] !h-[35px] !bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]"
                  onClick={() => editItem(item?._id)}
                >
                  <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                </Button>
                <Button
                  className="!w-[35px] !h-[35px] !bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.1)] !rounded-full hover:!bg-[#ccc]"
                  onClick={() => handleOpenConfirmSingle(item?._id)}
                >
                  <GoTrash className="text-[#ff5252] text-[20px]" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Confirm Dialog */}
  <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {deleteMode === "multiple"
          ? `Are you sure you want to delete ${selectedItems.length} selected weights?`
          : "Are you sure you want to delete this weight?"}
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

    </>
  );
};

export default AddWieght;

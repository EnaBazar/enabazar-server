import { Button, Input, MenuItem, Select, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineModeEdit } from 'react-icons/md';
import { MyContext } from '../../App';
import { deleteData, editData } from '../../utils/api';

export const EditSubCatBox = (props) => {
  const context = useContext(MyContext);

  const [editMode, setEditMode] = useState(false);
  const [selectVal, setSelectVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: '',
    parentCatName: null,
    parentId: ''
  });

  useEffect(() => {
    setFormFields({
      name: props?.name || '',
      parentCatName: props?.selectedCatName || null,
      parentId: props?.selectedCat || ''
    });
    setSelectVal(props?.selectedCat || '');
  }, [props]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (event) => {
    setSelectVal(event.target.value);
    const selectedItem = props?.catData?.find(cat => cat._id === event.target.value);
    setFormFields(prev => ({
      ...prev,
      parentId: event.target.value,
      parentCatName: selectedItem?.name || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name) {
      context.openAlertBox("error", "Please enter Category Name");
      setIsLoading(false);
      return;
    }

    editData(`/category/${props?.id}`, formFields).then((res) => {
      setTimeout(() => {
        context.openAlertBox("success", res?.data?.message || "সফলভাবে আপডেট হয়েছে");
        context?.getCat();
        setIsLoading(false);
        setEditMode(false);
      }, 1000);
    });
  };

  const deleteCat = async (id) => {
    if (!id) {
      context.openAlertBox("error", "ID পাওয়া যায়নি");
      return;
    }

    if (!confirm("আপনি কি সত্যিই ডিলিট করতে চান?")) return;

    try {
      const res = await deleteData(`/category/${id}`);
      context.openAlertBox("success", res?.data?.message || "সাব-ক্যাটাগরি ডিলিট হয়েছে");
      context?.getCat();
    } catch {
      context.openAlertBox("error", "ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <form className='w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 p-2 sm:p-4' onSubmit={handleSubmit}>

      {editMode ? (
        <div className='flex flex-col sm:flex-row items-start sm:items-center w-full gap-2 sm:gap-4'>
          <Select
            className='w-full sm:w-[150px]'
            size="small"
            value={selectVal}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'without label' }}
            style={{ zoom: '75%' }}
          >
            {props?.catData?.map((item, index) => (
              <MenuItem key={index} value={item?._id}>{item?.name}</MenuItem>
            ))}
          </Select>

          <Input
            type='text'
            className='w-full sm:flex-1 h-[35px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-2 text-sm'
            name="name"
            value={formFields?.name}
            onChange={onChangeInput}
          />

          <div className='flex gap-2 mt-2 sm:mt-0'>
            <Button size='small' type='submit' variant='contained' className='btn-sml flex items-center justify-center'>
              {isLoading ? <CircularProgress color="inherit" size={18}/> : 'Edit'}
            </Button>
            <Button size='small' variant='outlined' onClick={() => setEditMode(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className='flex w-full items-center justify-between'>
          <span className='font-medium text-sm'>{props?.name}</span>
          <div className='flex items-center gap-2'>
            <Button
              className='!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black'
              onClick={() => setEditMode(true)}
            >
              <MdOutlineModeEdit />
            </Button>

            <Button
              className='!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black'
              onClick={() => deleteCat(props?.id)}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default EditSubCatBox;
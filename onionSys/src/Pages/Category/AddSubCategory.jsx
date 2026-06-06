import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from 'react-icons/fa';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { CircularProgress } from '@mui/material';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CategoryFormBlock = ({ level, catData, isThirdLevel = false, onSubmit }) => {
  const [formFields, setFormFields] = useState({
    name: '',
    parentCatName: null,
    parentId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleCatChange = (event, catName) => {
    setFormFields(prev => ({
      ...prev,
      parentId: event.target.value,
      parentCatName: catName
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name) {
      onSubmit('error', 'Please enter Category Name');
      setIsLoading(false);
      return;
    }

    if (!formFields.parentId) {
      onSubmit('error', 'Please select a Category');
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData('/category/create', formFields, { withCredentials: true });
      if (!res?.error) {
        setFormFields({ name: '', parentCatName: null, parentId: '' });

        setTimeout(() => {
          setIsLoading(false);
          onSubmit('success', res?.message, true);
          context.setIsOpenFullScreenPanel({ open: false });
          context?.getCat();
          navigate("/SubCategorylist");
        }, 2000);
      } else {
        onSubmit('error', res?.message);
        setIsLoading(false);
      }
    } catch (err) {
      onSubmit('error', 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <form className='form py-3 px-4 sm:px-6 md:px-12' onSubmit={handleSubmit}>
      <h4 className='font-semibold text-lg'>{level}</h4>

      <div className='scroll max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] overflow-y-auto pr-2 sm:pr-4 mt-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-3'>
          {/* Category */}
          <div>
            <h3 className='text-sm sm:text-[16px] font-semibold'>
              Category<span className='text-red-400'> *</span>
            </h3>
            <Select
              className='w-full h-[35px] mt-2'
              size='small'
              value={formFields.parentId}
              onChange={(e) => {
                const selectedItem = isThirdLevel
                  ? catData.flatMap(cat => cat?.children || []).find(child => child._id === e.target.value)
                  : catData.find(cat => cat._id === e.target.value);
                handleCatChange(e, selectedItem?.name || '');
              }}
            >
              {isThirdLevel
                ? catData?.flatMap(cat => (cat.children || []).map(child => (
                    <MenuItem key={child._id} value={child._id}>{child.name}</MenuItem>
                  )))
                : catData?.map(cat => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))}
            </Select>
          </div>

          {/* Sub Category Name */}
          <div>
            <h3 className='text-sm sm:text-[16px] font-semibold'>
              Sub Category Name<span className='text-red-400'> *</span>
            </h3>
            <input
              type='text'
              className='w-full h-[35px] border mt-2 border-[rgba(0,0,0,0.2)] 
                focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm sm:text-base'
              name='name'
              value={formFields.name}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className='mt-5 w-full sm:w-[250px] md:w-[350px]'>
        <Button type='submit' className='btn-blue btn-sm flex gap-2 sm:gap-4 justify-center w-full'>
          <FaCloudUploadAlt className='text-[20px]' />
          {isLoading ? <CircularProgress color='inherit' size={20} /> : 'Publish and View'}
        </Button>
      </div>
    </form>
  );
};

const AddSubCategory = () => {
  const context = useContext(MyContext);

  const handleResponse = (type, message, shouldClose = false) => {
    context.openAlertBox(type, message);
    if (shouldClose) {
      context.setIsOpenFullScreenPanel({ open: false });
      context?.getCat();
    }
  };

  return (
    <section className='p-5 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
      <CategoryFormBlock
        level='Add Sub Category'
        catData={context?.catData || []}
        onSubmit={handleResponse}
      />
      <CategoryFormBlock
        level='Add Third Level Category'
        catData={context?.catData || []}
        isThirdLevel={true}
        onSubmit={handleResponse}
      />
    </section>
  );
};

export default AddSubCategory;

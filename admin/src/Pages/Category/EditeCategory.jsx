import React, { useContext, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import UploadBox from '../../Components/UploadBox';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MyContext } from '../../App';
import { deleteImages, editData, fetchDataFromApi } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const EditCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
  });
  const [previews, setPreviews] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;
    fetchDataFromApi(`/category/${id}`).then((res) => {
      setFormFields(prev => ({ ...prev, name: res?.category?.name }));
      setPreviews(res?.category?.images || []);
    });
  }, []);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value,
      images: previews
    }));
  };

  const setPreviewsFun = (previewsArr) => {
    setPreviews(previewsArr);
    setFormFields(prev => ({ ...prev, images: previewsArr }));
  };

  const removeImg = (image, index) => {
    deleteImages(`/category/deleteImage?img=${image}`).then(() => {
      const updatedImages = [...previews];
      updatedImages.splice(index, 1);
      setPreviews(updatedImages);
      setFormFields(prev => ({ ...prev, images: updatedImages }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name) {
      context.openAlertBox("error", "Please enter Category Name");
      setIsLoading(false);
      return;
    }

    if (!previews.length) {
      context.openAlertBox("error", "Please add Category Image");
      setIsLoading(false);
      return;
    }

    editData(`/category/${context?.isOpenFullScreenPanel?.id}`, formFields, { withCredentials: true }).then((res) => {
      if (!res?.error) {
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({ open: false });
        }, 2500);
      } else {
        context.openAlertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className='p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>
      <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10">
        <form className='form py-3 px-2 sm:px-4 md:px-12' onSubmit={handleSubmit}>
          <div className='scroll max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] overflow-y-auto pr-2 sm:pr-4'>

            {/* Category Name */}
            <div className='w-full sm:w-1/2 mb-4'>
              <h3 className='text-sm sm:text-[16px] font-semibold'>
                Category Name<span className='text-red-400'> *</span>
              </h3>
              <input
                type='text'
                className='w-full h-[35px] border mt-2 border-[rgba(0,0,0,0.2)]
                  focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm sm:text-base'
                name='name'
                value={formFields.name}
                onChange={onchangeInput}
              />
            </div>

            {/* Category Images */}
            <h3 className='text-sm sm:text-[16px] font-semibold mt-4'>
              Category Image<span className='text-red-400'> *</span>
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-5 mt-2'>
              {previews?.map((image, index) => (
                <div className='relative w-full' key={index}>
                  <span
                    className='absolute w-5 h-5 rounded-full bg-red-700 -top-1 -right-1 flex items-center justify-center cursor-pointer z-50'
                    onClick={() => removeImg(image, index)}
                  >
                    <IoMdClose className='text-white text-[14px]' />
                  </span>
                  <div className='uploadBox p-0 w-full rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[120px] bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt="image"
                      effect="blur"
                      src={image}
                    />
                  </div>
                </div>
              ))}

              <UploadBox
                multiple={true}
                name="images"
                url="/category/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>

          <div className='mt-5 w-full sm:w-[250px] md:w-[350px]'>
            <Button type='submit' className='btn-blue btn-sm flex gap-2 sm:gap-4 justify-center w-full'>
              <FaCloudUploadAlt className='text-[20px]' />
              {isLoading ? <CircularProgress color="inherit" size={20} /> : 'Update Category'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;

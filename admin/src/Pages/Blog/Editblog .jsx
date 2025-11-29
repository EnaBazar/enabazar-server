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
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-wysiwyg';

const EditBlog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    images: [],
    blogtitle: '',
    description: '',
  });
  const [previews, setPreviews] = useState([]);
  const [html, setHtml] = useState('');
  const context = useContext(MyContext);
  const history = useNavigate();

  // Fetch blog data
  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;
    fetchDataFromApi(`/blog/${id}`).then((res) => {
      setFormFields({
        images: res?.blog?.images || [],
        blogtitle: res?.blog?.blogtitle || '',
        description: res?.blog?.description || '',
      });
      setPreviews(res?.blog?.images || []);
      setHtml(res?.blog?.description || '');
    });
  }, [context?.isOpenFullScreenPanel?.id]);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onchangeDescription = (e) => {
    setHtml(e.target.value);
    setFormFields((prev) => ({ ...prev, description: e.target.value }));
  };

  const setPreviewsFun = (arr) => {
    setPreviews(arr);
    setFormFields((prev) => ({ ...prev, images: arr }));
  };

  const removeImg = (image, index) => {
    const updatedImages = [...previews];
    deleteImages(`/category/deleteImage?img=${image}`).then(() => {
      updatedImages.splice(index, 1);
      setPreviews(updatedImages);
      setFormFields((prev) => ({ ...prev, images: updatedImages }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.blogtitle) {
      context.openAlertBox('error', 'Please enter blog title');
      setIsLoading(false);
      return;
    }
    if (!formFields.description) {
      context.openAlertBox('error', 'Please enter blog description');
      setIsLoading(false);
      return;
    }
    if (previews.length === 0) {
      context.openAlertBox('error', 'Please upload at least one image');
      setIsLoading(false);
      return;
    }

    editData(`/blog/${context?.isOpenFullScreenPanel?.id}`, formFields, { withCredentials: true }).then((res) => {
      if (!res?.error) {
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({ open: false });
          context?.getData();
          history('/blog/list');
        }, 1500);
        context.openAlertBox('success', 'Blog updated successfully');
      } else {
        context.openAlertBox('error', res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className='p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>
      <div className='max-w-6xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-10'>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          {/* Blog Title */}
          <div className='w-full'>
            <h3 className='text-[16px] font-semibold'>
              Blog Title <span className='text-red-400'>*</span>
            </h3>
            <input
              type='text'
              name='blogtitle'
              value={formFields.blogtitle}
              onChange={onchangeInput}
              className='w-full h-10 mt-2 border border-gray-300 rounded-sm px-2 focus:outline-none focus:border-gray-500'
            />
          </div>

          {/* Description */}
          <div className='w-full'>
            <h3 className='text-[16px] font-semibold'>
              Description <span className='text-red-400'>*</span>
            </h3>
            <Editor
              value={html}
              onChange={onchangeDescription}
              containerProps={{ style: { resize: 'vertical', minHeight: '150px', marginTop: '8px' } }}
            />
          </div>

          {/* Images */}
          <div>
            <h3 className='text-[16px] font-semibold mb-2'>
              Blog Images <span className='text-red-400'>*</span>
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {previews.map((image, index) => (
                <div key={index} className='relative w-full h-32 rounded-md overflow-hidden'>
                  <span
                    className='absolute top-1 right-1 w-6 h-6 rounded-full bg-red-700 flex items-center justify-center cursor-pointer z-10'
                    onClick={() => removeImg(image, index)}
                  >
                    <IoMdClose className='text-white text-[16px]' />
                  </span>
                  <LazyLoadImage
                    src={image}
                    alt='blog'
                    effect='blur'
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              ))}
              <UploadBox multiple={true} url='/blog/uploadImages' setPreviewsFun={setPreviewsFun} />
            </div>
          </div>

          {/* Submit Button */}
          <div className='w-full sm:w-1/3 mt-4'>
            <Button type='submit' className='btn-blue btn-sm flex items-center justify-center gap-2 w-full'>
              <FaCloudUploadAlt className='text-[20px]' />
              {isLoading ? <CircularProgress color='inherit' size={20} /> : 'Update Blog'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditBlog;

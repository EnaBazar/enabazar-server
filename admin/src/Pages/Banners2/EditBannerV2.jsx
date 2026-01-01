import React, { useEffect, useState, useContext } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';
import UploadBox from '../../Components/UploadBox';
import { Button, CircularProgress } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { deleteImages, editData, fetchDataFromApi } from '../../utils/api';

const EditBannerV2 = () => {
  const context = useContext(MyContext);
  const [productCat, setProductCat] = useState('');
  const [productsubCat, setProductsubCat] = useState('');
  const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerAlign, setBannerAlign] = useState('');
  const [formFields, setFormFields] = useState({
    catId: '',
    bannerTitle: '',
    subCatId: '',
    thirdsubCatId: '',
    price: '',
    bannerAlign: '',
  });

  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;
    if (id) {
      fetchDataFromApi(`/bannerV2/${id}`).then((res) => {
        const data = res?.bannerV2;
        if (!data) return;
        setFormFields({
          bannerTitle: data.bannerTitle || '',
          catId: data.catId || '',
          subCatId: data.subCatId || '',
          thirdsubCatId: data.thirdsubCatId || '',
          price: data.price || '',
          bannerAlign: data.bannerAlign || '',
        });
        setProductCat(data.catId);
        setProductsubCat(data.subCatId);
        setProductThirdLavelCat(data.thirdsubCatId);
        setBannerAlign(data.bannerAlign || '');
        setPreviews(data.images || []);
      });
    }
  }, [context?.isOpenFullScreenPanel?.id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const setPreviewsFun = (arr) => {
    setPreviews(arr);
    setFormFields((prev) => ({ ...prev, images: arr }));
  };

  const removeImg = (image, index) => {
    const updated = [...previews];
    deleteImages(`/category/deleteImage?img=${image}`).then(() => {
      updated.splice(index, 1);
      setPreviews(updated);
      setFormFields((prev) => ({ ...prev, images: updated }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.bannerTitle) {
      context.openAlertBox('error', 'Please enter banner title');
      setIsLoading(false);
      return;
    }
    if (!formFields.price) {
      context.openAlertBox('error', 'Please enter price');
      setIsLoading(false);
      return;
    }
    if (previews.length === 0) {
      context.openAlertBox('error', 'Please upload at least one image');
      setIsLoading(false);
      return;
    }

    editData(`/bannerV2/${context?.isOpenFullScreenPanel?.id}`, formFields, {
      withCredentials: true,
    }).then((res) => {
      if (!res?.error) {
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({ open: false });
        }, 1500);
      } else {
        context.openAlertBox('error', res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className='p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>
      <div className='max-w-6xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-10'>
        <form className='form flex flex-col gap-6' onSubmit={handleSubmit}>
          {/* Banner Title */}
          <div className='w-full sm:w-1/2'>
            <h3 className='text-[16px] font-semibold'>
              Banner Title <span className='text-red-400'>*</span>
            </h3>
            <input
              type='text'
              name='bannerTitle'
              value={formFields.bannerTitle}
              onChange={onChangeInput}
              className='w-full h-10 mt-2 border border-gray-300 rounded-sm px-2 focus:outline-none focus:border-gray-500'
            />
          </div>

          {/* Category Selects */}
          <div className='flex flex-col sm:flex-row gap-4 flex-wrap'>
            <div className='w-full sm:w-1/3'>
              <h3 className='text-[16px] font-semibold'>
                Category Name <span className='text-red-400'>*</span>
              </h3>
              {context?.catData?.length > 0 && (
                <Select
                  value={productCat}
                  size='small'
                  className='w-full mt-2 h-10'
                  onChange={(e) => {
                    setProductCat(e.target.value);
                    setFormFields((prev) => ({ ...prev, catId: e.target.value }));
                  }}
                >
                  {context.catData.map((cat, idx) => (
                    <MenuItem key={idx} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>

            <div className='w-full sm:w-1/3'>
              <h3 className='text-[16px] font-semibold'>
                SubCategory <span className='text-red-400'>*</span>
              </h3>
              {context?.catData?.length > 0 && (
                <Select
                  value={productsubCat}
                  size='small'
                  className='w-full mt-2 h-10'
                  onChange={(e) => {
                    setProductsubCat(e.target.value);
                    setFormFields((prev) => ({ ...prev, subCatId: e.target.value }));
                  }}
                >
                  {context.catData.flatMap((cat) =>
                    cat.children?.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              )}
            </div>

            <div className='w-full sm:w-1/3'>
              <h3 className='text-[16px] font-semibold'>
                Third Level Category <span className='text-red-400'>*</span>
              </h3>
              {context?.catData?.length > 0 && (
                <Select
                  value={productThirdLavelCat}
                  size='small'
                  className='w-full mt-2 h-10'
                  onChange={(e) => {
                    setProductThirdLavelCat(e.target.value);
                    setFormFields((prev) => ({ ...prev, thirdsubCatId: e.target.value }));
                  }}
                >
                  {context.catData.flatMap((cat) =>
                    cat.children?.flatMap((sub) =>
                      sub.children?.map((third) => (
                        <MenuItem key={third._id} value={third._id}>
                          {third.name}
                        </MenuItem>
                      ))
                    )
                  )}
                </Select>
              )}
            </div>
          </div>

          {/* Banner Align & Price */}
          <div className='flex flex-col sm:flex-row gap-4 flex-wrap'>
            <div className='w-full sm:w-1/3'>
              <h3 className='text-[16px] font-semibold'>
                Banner Align <span className='text-red-400'>*</span>
              </h3>
              <Select
                value={bannerAlign}
                size='small'
                className='w-full mt-2 h-10'
                onChange={(e) => {
                  setBannerAlign(e.target.value);
                  setFormFields((prev) => ({ ...prev, bannerAlign: e.target.value }));
                }}
              >
                <MenuItem value={null}>None</MenuItem>
                <MenuItem value='right'>Right</MenuItem>
                <MenuItem value='left'>Left</MenuItem>
              </Select>
            </div>

            <div className='w-full sm:w-1/3'>
              <h3 className='text-[16px] font-semibold'>
                Price <span className='text-red-400'>*</span>
              </h3>
              <input
                type='number'
                name='price'
                value={formFields.price}
                onChange={onChangeInput}
                className='w-full h-10 mt-2 border border-gray-300 rounded-sm px-2 focus:outline-none focus:border-gray-500'
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className='text-[16px] font-semibold mb-2'>
              Banner Images <span className='text-red-400'>*</span>
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4'>
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
                    alt='banner'
                    effect='blur'
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              ))}
              <UploadBox multiple={true} url='/bannerV2/uploadImages' setPreviewsFun={setPreviewsFun} />
            </div>
          </div>

          {/* Submit Button */}
          <div className='mt-6 w-full sm:w-1/3'>
            <Button
              type='submit'
              className='btn-blue btn-sm flex items-center justify-center gap-2 w-full'
            >
              <FaCloudUploadAlt className='text-[20px]' />
              {isLoading ? <CircularProgress color='inherit' size={20} /> : 'Edit Banner V1'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditBannerV2;

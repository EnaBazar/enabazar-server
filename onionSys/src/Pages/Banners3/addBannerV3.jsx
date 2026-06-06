import React, { useState, useContext } from 'react';
import { MenuItem, Select, Button, CircularProgress } from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../../Components/UploadBox';
import { MyContext } from '../../App';
import { deleteImages, postData } from '../../utils/api';

const AddBannerV3 = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    bannerTitle: '',
    catId: '',
    subCatId: '',
    thirdsubCatId: '',
    bannerAlign: '',
    price: '',
    images: []
  });

  const [productCat, setProductCat] = useState('');
  const [productSubCat, setProductSubCat] = useState('');
  const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
  const [bannerAlign, setBannerAlign] = useState('');
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormFields(prev => ({ ...prev, [field]: value }));
  };

  const removeImg = (image, index) => {
    const updatedImages = [...previews];
    deleteImages(`/category/deleteImage?img=${image}`).then(() => {
      updatedImages.splice(index, 1);
      setPreviews(updatedImages);
      handleChange('images', updatedImages);
    });
  };

  const setPreviewsFun = (arr) => {
    setPreviews(arr);
    handleChange('images', arr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.bannerTitle || !formFields.price || previews.length === 0) {
      context.openAlertBox('error', 'Please fill all required fields');
      setIsLoading(false);
      return;
    }

    postData('/bannerV3/create', formFields, { withCredentials: true })
      .then((res) => {
        setIsLoading(false);
        if (!res.error) {
          context.openAlertBox('success', res.message);
          context.setIsOpenFullScreenPanel({ open: false });
          history('/bannerV3/list');
        } else {
          context.openAlertBox('error', res.message);
        }
      });
  };

  return (
    <section className="p-6 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200">
      <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Grid for Banner Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Banner Title */}
            <div>
              <h3 className="text-[16px] font-[600]">Banner Title<span className="text-red-400"> *</span></h3>
              <input
                type="text"
                name="bannerTitle"
                value={formFields.bannerTitle}
                onChange={(e) => handleChange('bannerTitle', e.target.value)}
                className="w-full h-[35px] border border-gray-300 rounded-sm mt-2 px-2 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* Category */}
            <div>
              <h3 className="text-[16px] font-[600]">Category<span className="text-red-400"> *</span></h3>
              <Select
                value={productCat}
                onChange={(e) => { setProductCat(e.target.value); handleChange('catId', e.target.value); }}
                size="small"
                className="w-full h-[35px] mt-2"
              >
                {context?.catData?.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </div>

            {/* SubCategory */}
            <div>
              <h3 className="text-[16px] font-[600]">SubCategory<span className="text-red-400"> *</span></h3>
              <Select
                value={productSubCat}
                onChange={(e) => { setProductSubCat(e.target.value); handleChange('subCatId', e.target.value); }}
                size="small"
                className="w-full h-[35px] mt-2"
              >
                {context?.catData?.map(cat => cat.children?.map(sub => (
                  <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                )))}
              </Select>
            </div>

            {/* Third Level Category */}
            <div>
              <h3 className="text-[16px] font-[600]">Third Level Category</h3>
              <Select
                value={productThirdLevelCat}
                onChange={(e) => { setProductThirdLevelCat(e.target.value); handleChange('thirdsubCatId', e.target.value); }}
                size="small"
                className="w-full h-[35px] mt-2"
              >
                {context?.catData?.map(cat => cat.children?.map(sub => sub.children?.map(third => (
                  <MenuItem key={third._id} value={third._id}>{third.name}</MenuItem>
                ))))}
              </Select>
            </div>

            {/* Banner Align */}
            <div>
              <h3 className="text-[16px] font-[600]">Banner Align</h3>
              <Select
                value={bannerAlign}
                onChange={(e) => { setBannerAlign(e.target.value); handleChange('bannerAlign', e.target.value); }}
                size="small"
                className="w-full h-[35px] mt-2"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-[16px] font-[600]">Price<span className="text-red-400"> *</span></h3>
              <input
                type="number"
                name="price"
                value={formFields.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full h-[35px] border border-gray-300 rounded-sm mt-2 px-2 text-sm focus:outline-none focus:border-gray-500"
              />
            </div>

          </div>

          {/* Banner Images */}
          <div>
            <h3 className="text-[16px] font-[600]">Banner Images<span className="text-red-400"> *</span></h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {previews.map((img, index) => (
                <div key={index} className="relative w-[150px] h-[150px] rounded-md overflow-hidden">
                  <IoMdClose
                    className="absolute top-1 right-1 text-white bg-red-600 rounded-full cursor-pointer z-10"
                    onClick={() => removeImg(img, index)}
                  />
                  <LazyLoadImage src={img} effect="blur" className="w-full h-full object-cover" alt="banner" />
                </div>
              ))}
              <UploadBox multiple={true} url="/bannerV3/uploadImages" setPreviewsFun={setPreviewsFun} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full sm:w-[350px]">
            <Button type="submit" className="btn-blue btn-sm flex gap-2 w-full sm:w-auto">
              <FaCloudUploadAlt className="text-[20px]" />
              {isLoading ? <CircularProgress color="inherit" size={20}/> : 'Add Banner V1'}
            </Button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default AddBannerV3;

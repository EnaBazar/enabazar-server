import React, { useState } from 'react';
import { FaRegImages } from 'react-icons/fa6';
import { uploadImages } from '../../utils/api';
import  CircularProgress  from '@mui/material/CircularProgress';


const UploadBox = (props) => {
  const [uploading, setUploading] = useState(false);

  const onChangeFile = async (e, apiEndPoint) => {
    const formdata = new FormData();
   
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    // Check if all files are valid
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type.toLowerCase()));
    if (invalidFiles.length > 0) {
      props?.openAlertBox?.("error", "Please select only JPG, PNG or WEBP image files");
      return;
    }

    setUploading(true);

    files.forEach(file => {
      formdata.append(props?.name || "images", file);
    });

    try {
      const res = await uploadImages(apiEndPoint, formdata);
      console.log("Upload response:", res);
      setUploading(false);

      if (res?.images && Array.isArray(res.images)) {
     if (props.setPreviewsFun) {
    props.setPreviewsFun(res.images);  // ✅ For normal image uploads
  } else if (props.setBannerImagesFun) {
    props.setBannerImagesFun(res.images);  // ✅ For banner image uploads
  }
      } else {
        props?.openAlertBox?.("error", "Image upload failed or invalid server response");
      }

    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      props?.openAlertBox?.("error", "An error occurred during image upload");
    }
  };

  return (
   <div className='uploadBox p-3 w-full sm:w-full rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] sm:h-[180px] bg-gray-200 cursor-pointer hover:bg-gray-300 flex flex-col items-center justify-center relative'>
  {
    uploading === true ? (
      <CircularProgress />
    ) : (
      <>
        <FaRegImages className='text-[50px] sm:text-[60px] opacity-30 mb-2' />
        <h4 className='text-[14px] sm:text-[16px] text-center'>
          {uploading ? "Uploading..." : "Image Upload"}
        </h4>
        <input
          type='file'
          accept='image/*'
          multiple={props.multiple ?? false}
          className='absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer'
          onChange={(e) => onChangeFile(e, props?.url)}
          name="images"
        />
      </>
    )
  }
</div>

  );
};

export default UploadBox;

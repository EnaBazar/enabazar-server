import React from 'react'
import { IoMdClose } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import UploadBox from '../../Components/UploadBox';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../App';
import { deleteImages, postData } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import {useNavigate} from "react-router-dom";


const AddHomeSlide = () => {
  const [previews,setPreviews] = useState([]);
const context = useContext(MyContext);
     const history = useNavigate();
    const [isLoading,setIsLoading]= useState(false);
    const [formFields, setFormFields]= useState({
         
           images:[],
    });
    
    
    
    const setPreviewsFun = (previewsArr) => {
      setPreviews(previewsArr);
    
      setFormFields(prev => ({
      ...prev,
      images: previewsArr
    }));
    };
    const removeImg = (image, index) => {
      const updatedImages = [...previews];
    
      deleteImages(`/homeSlides/deleteImage?img=${image}`)
        .then((res) => {
          updatedImages.splice(index, 1);
    
          // আপডেট করা previews সেট করা হচ্ছে
          setPreviews(updatedImages);
    
          // formFields.images আপডেট করা হচ্ছে সঠিকভাবে
        setFormFields(prev => ({
            ...prev,
            images: updatedImages
          }));
    
        });
    };
    
    
    
     const handleSubmit = (e) => {
          
        e.preventDefault();
          setIsLoading(true);
          
      
         
          if(previews?.length===0)
            {
              context.openAlertBox("error","Please entry Slide Image")
               setIsLoading(false);
              return false
               
            }
       
          postData("/homeSlides/add", formFields,{withCredentials:true}).then((res)=>{
            console.log(res)
            if(res?.error !== true){
              
              setTimeout(() =>{
              setIsLoading(false)
            
            context.setIsOpenFullScreenPanel({
              open:false
            })
            
      history("/homeSliderlist")

              },2500)
         
            context.openAlertBox("success",res?.message);
          
        
    
         
        
        
            }else{
            context.openAlertBox("error",res?.message);
            setIsLoading(false);
             
            }
           
          })
        }
    
    
  return (
      
   <section className="p-5 bg-red">
  <form className="form py-3 p-6 md:p-12" onSubmit={handleSubmit}>
    <div className="scroll max-h-[70vh] overflow-y-scroll pr-2 md:pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-5">
        {previews?.length !== 0 &&
          previews?.map((image, index) => {
            return (
              <div className="uploadBoxWrapper relative" key={index}>
                <span
                  className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[2px] -right-[2px] flex items-center justify-center cursor-pointer z-50"
                  onClick={() => removeImg(image, index)}
                >
                  <IoMdClose className="text-white text-[17px]" />
                </span>

                <div className="uploadBox p-0 w-full rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center flex-col relative">
                  <LazyLoadImage
                    className="w-full h-full object-cover"
                    alt="image"
                    effect="blur"
                    wrapperProps={{
                      style: { transitionDelay: "1s" },
                    }}
                    src={image}
                  />
                </div>
              </div>
            );
          })}

        {/* UploadBox */}
        <UploadBox
          multiple={false}
          name="images"
          url="/homeSlides/uploadImages"
          setPreviewsFun={setPreviewsFun}
        />
      </div>
    </div>

    <br />
    <br />

    <div className="w-full sm:w-[300px] md:!w-[350px]">
      <Button
        type="submit"
        className="btn-blue btn-sm flex gap-4 w-full justify-center"
      >
        <FaCloudUploadAlt className="text-[20px]" />

        {isLoading === true ? (
          <CircularProgress color="inherit" />
        ) : (
          "Add Sliders And View"
        )}
      </Button>
    </div>
  </form>
</section>

  )
}
export default AddHomeSlide;
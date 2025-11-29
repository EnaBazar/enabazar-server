import React, { useContext, useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import UploadBox from '../../Components/UploadBox';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MyContext } from '../../App';
import { deleteImages, postData } from '../../utils/api';
import  CircularProgress  from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


const AddCategory = () => {
  
  const [isLoading,setIsLoading]= useState(false);
  const [formFields, setFormFields]= useState({
         name: "",
         images:[],
  });
  
  
const [previews,setPreviews] = useState([]);
const context = useContext(MyContext);
const history = useNavigate();
const onchangeInput=(e)=>{
      
  const {name,value} = e.target;
  
  setFormFields(()=>{
    return{
      ...formFields,
      [name]:value
      
    }
  })

}


const setPreviewsFun = (previewsArr) => {
  setPreviews(previewsArr);

  setFormFields(prev => ({
  ...prev,
  images: previewsArr
}));
};
const removeImg = (image, index) => {
  const updatedImages = [...previews];

  deleteImages(`/category/deleteImage?img=${image}`)
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
      
      if(formFields.name==="")
        {
          context.openAlertBox("error","Please entry Category Name")
         setIsLoading(false);
         
          return false
            
        }
     
      if(previews?.length===0)
        {
          context.openAlertBox("error","Please entry Category Image")
           setIsLoading(false);
          return false
           
        }
   
      postData("/category/create", formFields,{withCredentials:true}).then((res)=>{
        console.log(res)
        if(res?.error !== true){
          
          setTimeout(() =>{
          setIsLoading(false)
        
        context.setIsOpenFullScreenPanel({
          open:false
        })
        
        context?.getCat();
        history("/Categorylist")
          },2500)
     
        context.openAlertBox("success",res?.message);
      
    

     
    
    
        }else{
        context.openAlertBox("error",res?.message);
        setIsLoading(false);
         
        }
       
      })
    }

  return (
      
   <section className='p-6 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>
  <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 md:p-10">
    <form className='form py-3' onSubmit={handleSubmit}>
      <div className='scroll max-h-[80vh] overflow-y-auto pr-4'>

        {/* Category Name */}
        <div className='col w-full md:w-[25%]'>
          <h3 className='text-[16px] font-[600]'>
            Category Name <span className='text-red-400'>*</span>
          </h3>
          <input
            type='text'
            className='w-full h-[35px] border mt-2 border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2'
            name='name'
            value={formFields.name}
            onChange={onchangeInput}
          />
        </div>

        <br />

        {/* Category Image */}
        <h3 className='text-[16px] font-[600]'>
          Category Image <span className='text-red-400'>*</span>
        </h3>
        <br />

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4'>
          {previews?.length > 0 &&
            previews.map((image, index) => (
              <div className='uploadBoxWrapper relative' key={index}>
                <span
                  className='absolute w-5 h-5 rounded-full bg-red-700 -top-1 -right-1 flex items-center justify-center cursor-pointer z-50'
                  onClick={() => removeImg(image, index)}
                >
                  <IoMdClose className='text-white text-[17px]' />
                </span>
                <div className='uploadBox w-full h-[150px] rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center'>
                  <LazyLoadImage
                    className='w-full h-full object-cover'
                    alt="image"
                    effect="blur"
                    src={image}
                  />
                </div>
              </div>
            ))
          }

          {/* Upload Component */}
          <UploadBox
            multiple={true}
            name="images"
            url="/category/uploadImages"
            setPreviewsFun={setPreviewsFun}
          />
        </div>

      </div>

      <br /><br />

      {/* Submit Button */}
      <div className='w-full md:w-[350px]'>
        <Button type='submit' className='btn-blue btn-sm flex items-center gap-3 w-full justify-center'>
          <FaCloudUploadAlt className='text-[20px]' />
          {isLoading ? <CircularProgress color="inherit" size={20} /> : 'Add Category'}
        </Button>
      </div>

    </form>
  </div>
</section>

  )
}
export default AddCategory;

import React,{useContext, useEffect, useState} from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from 'react-icons/io';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MyContext } from '../../App';
import { deleteImages, editData, fetchDataFromApi, postData} from '../../utils/api';
import { CircularProgress } from '@mui/material';
import { data, useNavigate, useParams} from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Editor from 'react-simple-wysiwyg';

 const EditProduct = () => {
   
     const [html, setHtml] = useState('');
     const [formFields, setFormFields]= useState({
             name: "",
             description: "",
             images:[],
             brand: "",
             price: "",
             oldPrice: "",
             category:"",
             catName: "",
                   catId: "",
                   subCatId: "",
                   subCat: "",
                   thirdsubCatId: "",
                   thirdsubCat: "",
                   countInStock: "",
                   rating: "",
                   isFeatured: false,
                   discount: "",
                   productRam: [],
                   size: [],
                   productWeight: [],
                           bannerTitlename:"",
            bannerimages:[],
               isDisplayOnHomeBanner:false
                    
                    
     });
     
  const [previews,setPreviews] = useState([]);
  const [bannerpreviews,setBannerPreviews] = useState([]);
  const context = useContext(MyContext);
  const history = useNavigate();
  const [productCat, setProductCat] = useState('');
  const [productsubCat, setProductsubCat] = useState('');
  const [productFeatured, setProductFeatured] = useState('');
  const [productRam, setProductRam] = useState([]);
  const [productRamData, setProductRamData] = useState([]);
  const [productwightData, setProductwightData] = useState([]);
  const [productsizeData, setProductsizeData] = useState([]);
  const [productwight, setProductwight] = useState([]);
  const [productsize, setProductsize] = useState([]);
   const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
   const [productData, setProductData] = useState([]);
  const [isLoading,setIsLoading]= useState(false);
    const [checkedSwitch,setCheckedSwitch]= useState(false);
  
  // ✅ Sub Category Filter করা
const filteredSubCats = context?.catData?.find(cat => cat._id === productCat)?.children || [];

// ✅ Third Category Filter করা
const filteredThirdCats = filteredSubCats.find(sub => sub._id === productsubCat)?.children || [];
const label = { inputProps: { 'aria-label': 'Switch demo' } };

  
  const onChangeInput=(e)=>{
      
  const {name,value} = e.target;
  
  setFormFields(()=>{
    return{
      ...formFields,
      [name]:value
      
    }
  })

}
  

const onchangeDescription = (e) => {
  setHtml(e.target.value);
  setFormFields(prev => ({
    ...prev,
    description: e.target.value
  }));
};

    const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    formFields.isDisplayOnHomeBanner = event.target.checked
 
  };
  useEffect(()=>{
    
        fetchDataFromApi("/product/productRAMS/get").then((res)=>{
          if(res?.error===false){
            setProductRamData(res?.products)
          }
        })
        
           fetchDataFromApi("/product/productSize/get").then((res)=>{
          if(res?.error===false){
            setProductsizeData(res?.products)
          }
        })
           
              fetchDataFromApi("/product/productWieght/get").then((res)=>{
          if(res?.error===false){
            setProductwightData(res?.products)
          }
        })
    
    
    
    
   fetchDataFromApi(`/product/${context?.isOpenFullScreenPanel?.id}`).then((res)=>{
     
   setFormFields({
          name: res?.products?.name,
          description: res?.products?.description,
          images: res?.products?.images,
          brand: res?.products?.brand ,
          price: res?.products?.price,
          oldPrice: res?.products?.oldPrice,
          category: res?.products?.category,
          catName: res?.products?.catName,
          catId: res?.products?.catId,
          subCatId: res?.products?.subCatId,
          subCat: res?.products?.subCat,
          thirdsubCatId: res?.products?.thirdsubCatId,
          thirdsubCat: res?.products?.thirdsubCat,
          countInStock: res?.products?.countInStock,
          rating: res?.products?.rating,
          isFeatured: res?.products?.isFeatured,
          discount: res?.products?.discount,
          productRam: res?.products?.productRam ,
          size: res?.products?.size,
          productWeight: res?.products?.productWeight,
                 bannerTitlename: res?.products?.bannerTitlename,
                 bannerimages:res?.products?.bannerimages,
                    isDisplayOnHomeBanner:res?.products?.isDisplayOnHomeBanner
                 
        });
setHtml(res?.products?.description || "");
setProductCat(res?.products?.catId);
setProductsubCat(res?.products?.subCatId);
setProductThirdLavelCat(res?.products?.thirdsubCatId);
setProductFeatured(res?.products?.isFeatured);
setProductRam(res?.products?.productRam);
setProductwight(res?.products?.productWeight);
setProductsize(res?.products?.size);
setCheckedSwitch(res?.products?.isDisplayOnHomeBanner)
setPreviews(res?.products?.images);
setBannerPreviews(res?.products?.bannerimages);
    });
  }, []);
     

  
  
  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value
  formFields.category = event.target.value
  };
  
  const selectCatByName =(name)=>{
   
    formFields.catName=name
  }
  
  
  const handleChangeProductsubCat = (event) => {
    setProductsubCat(event.target.value);
      formFields.subCatId=event.target.value
  };
   const selectSubCatByName=(name)=>{
 
    formFields.subCat=name
  }
   
     const handleChangeProductThirdLavelCat = (event) => {
    setProductThirdLavelCat(event.target.value);
      formFields.thirdsubCatId=event.target.value
  };
     const selectThirdLavelCatByName=(name)=>{

    formFields.thirdsubCat=name
  }
  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value
  };
  const handleChangeProductRam = (event) => {
    
    const {
      
      target: {value},
      
    }= event;
    setProductRam(
      typeof value === "string" ? value.split(",") : value
    );
    formFields.productRam = value; 
  }; 
  const handleChangeProductwight = (event) => {
     const {
      
      target: {value},
      
    }= event;
    setProductwight(
      typeof value === "string" ? value.split(",") : value
    );
    formFields.productWeight = value; 
    
  
  };
  
  const handleChangeProductsize = (event) => {
   const {
      
      target: {value},
      
    }= event;
    setProductsize(
      typeof value === "string" ? value.split(",") : value
    );
    formFields.size = value; 
    
  };
    
 const onChangeRating = (e) => {
   setFormFields(()=> (
    { ...formFields,
     rating: e.target.value
     
   }
  ))
   
 }
  const setPreviewsFun = (previewsArr) => {
  setPreviews(previewsArr);

  setFormFields(prev => ({
  ...prev,
  images: previewsArr
}));
};
  
  const setBannerImagesFun = (previewsArr) => {
  setBannerPreviews(previewsArr);
  setFormFields(prev => ({
    ...prev,
    bannerimages: previewsArr 
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
  
  
  const removeBannerImg = (image, index) => {
  
  const updatedImages = [...bannerpreviews];

  deleteImages(`/category/deleteImage?img=${image}`)
    .then((res) => {
      updatedImages.splice(index, 1);
      // আপডেট করা previews সেট করা হচ্ছে
      setBannerPreviews(updatedImages);
      // formFields.images আপডেট করা হচ্ছে সঠিকভাবে
    setFormFields(prev => ({
    ...prev,
    bannerimages: updatedImages
        
      }));

    });
};
  
const handleSubmit=(e)=>{
e.preventDefault(); // ✅

        if(formFields.name==="")
        {
        context.openAlertBox("error","Please entry Product Name")
         setIsLoading(false);
        return        
        }    
        if(formFields.description==="")
        {context.openAlertBox("error","Please entry description Name")
         setIsLoading(false);     
        return      
        }          
        if(formFields.catId==="")
        {
        context.openAlertBox("error","Please entry ProductCategory")
        setIsLoading(false);      
        return         
        }       
        if(formFields.price==="")
        {context.openAlertBox("error","Please entry Price")
        setIsLoading(false);   
        return       
        }   
        if(formFields.oldPrice==="")
        {
          context.openAlertBox("error","Please entry OldPrice")
         setIsLoading(false);
         
          return 
            
        }
        if(formFields.countInStock==="")
        {
          context.openAlertBox("error","Please entry Product stock")
         setIsLoading(false);
         
          return 
            
        }   
        if(formFields.brand==="")
        {
          context.openAlertBox("error","Please entry Brand Name")
         setIsLoading(false);
         
          return 
            
        }
        if(formFields.rating==="")
        {
          context.openAlertBox("error","Please entry Rating")
         setIsLoading(false);
         
          return 
            
        }
        if(formFields.discount==="")
        {
          context.openAlertBox("error","Please entry Discount")
         setIsLoading(false);
         
          return 
            
        }
        if(previews?.length===0)
        {
          context.openAlertBox("error","Please entry Category Image")
           setIsLoading(false);
          return 
           
        }
        
        
setIsLoading(true)

editData(`/product/updateProduct/${context?.isOpenFullScreenPanel?.id}`, formFields).then((res) => {

 
  if(res?.data?.error === false) {
  
  context.openAlertBox("success","Your Product Add SuccessFully")
    // Load off without delay
    setIsLoading(false); 

    // Using timeout for panel and redirect to /products
    setTimeout(() => {
      context.setIsOpenFullScreenPanel({
        open: false
      });
      history("/products");
    }, 1000);  // Timeout decreased to 1 second
    
  } else {
    setIsLoading(false); // Loading off in case of error
    context.openAlertBox("error", res?.data?.message || "Something went wrong");
  }

});
}

  return (
  <section className='p-6 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>

  <form className='form py-3 ' onSubmit={handleSubmit}>
 <div className='scroll !sm:w-[full] max-h-[70vh] overflow-y-scroll pr-2 md:pr-4'>

  
  
  <div className='grid grid-cols-1 mb-3'>
  <div className='col'>
  <h3 className='text-[16px] font-[600]'>Product Name<span className='text-red-400'> *</span></h3>
  <input type='text' className='w-full h-[30px] border mt-3 px-3 border-[rgba(0,0,0,0.2)] 
  focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm'
  name='name'
   value={formFields.name} 
  onChange={onChangeInput}
  />
  </div>
  </div>
  
  <div className='grid grid-cols-1 mb-3'>
    <div className='col'>
      <h3 className='text-[16px] font-[600]'>
        Description <span className='text-red-400'>*</span>
      </h3>
  
<Editor
  value={html}
  onChange={onchangeDescription}
  containerProps={{
    style: {
      resize: 'vertical',
      minHeight: '200px',
      marginTop: '8px'
    }
  }}
/>

    </div>
  </div>
  
  
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
  {/* Category */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Category<span className="text-red-400"> *</span>
    </h3>
    {context?.catData?.length !== 0 && (
      <Select
        className="w-full h-[40px] mt-2"
        size="small"
        value={productCat}
        onChange={handleChangeProductCat}
      >
        {context?.catData?.map((cat, index) => (
          <MenuItem
            value={cat?._id}
            key={index}
            onClick={() => selectCatByName(cat?.name)}
          >
            {cat?.name}
          </MenuItem>
        ))}
      </Select>
    )}
  </div>

{/* Sub Category */}
<div className="col">
  <h3 className="text-[16px] font-[600]">Sub Category<span className="text-red-400"> *</span></h3>
  <Select
    className="w-full h-[40px] mt-2"
    size="small"
    value={productsubCat}
    onChange={handleChangeProductsubCat}
  >
    {filteredSubCats.map((subCat) => (
      <MenuItem
        key={subCat?._id}
        value={subCat?._id}
        onClick={() => selectSubCatByName(subCat?.name)}
      >
        {subCat?.name}
      </MenuItem>
    ))}
  </Select>
</div>

{/* Third Level Category */}
<div className="col">
  <h3 className="text-[16px] font-[600]">Third Level Category<span className="text-red-400"> *</span></h3>
  <Select
    className="w-full h-[40px] mt-2"
    size="small"
    value={productThirdLavelCat}
    onChange={handleChangeProductThirdLavelCat}
  >
    {filteredThirdCats.map((thirdCat) => (
      <MenuItem
        key={thirdCat?._id}
        value={thirdCat?._id}
        onClick={() => selectThirdLavelCatByName(thirdCat?.name)}
      >
        {thirdCat?.name}
      </MenuItem>
    ))}
  </Select>
</div>

  {/* Price */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Price<span className="text-red-400"> *</span>
    </h3>
    <input
      type="number"
      className="w-full h-[40px] border mt-2 px-3 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] 
      rounded-sm text-sm"
      name="price"
      value={formFields.price}
      onChange={onChangeInput}
    />
  </div>

  {/* Old Price */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Old Price<span className="text-red-400"> *</span>
    </h3>
    <input
      type="number"
      className="w-full h-[40px] border mt-2 px-3 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] 
      rounded-sm text-sm"
      name="oldPrice"
      value={formFields.oldPrice}
      onChange={onChangeInput}
    />
  </div>

  {/* Is Featured */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Is Featured?<span className="text-red-400"> *</span>
    </h3>
    <Select
      className="w-full h-[40px] mt-2"
      size="small"
      value={productFeatured}
      onChange={handleChangeProductFeatured}
    >
      <MenuItem value={null}>None</MenuItem>
      <MenuItem value={true}>true</MenuItem>
      <MenuItem value={false}>false</MenuItem>
    </Select>
  </div>

  {/* Stock */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Stock<span className="text-red-400"> *</span>
    </h3>
    <input
      type="number"
      className="w-full h-[40px] border mt-2 px-3 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] 
      rounded-sm text-sm"
      name="countInStock"
      value={formFields.countInStock}
      onChange={onChangeInput}
    />
  </div>

  {/* Brand */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Brand<span className="text-red-400"> *</span>
    </h3>
    <input
      type="text"
      className="w-full h-[40px] border mt-2 px-3 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] 
      rounded-sm text-sm"
      name="brand"
      value={formFields.brand}
      onChange={onChangeInput}
    />
  </div>
</div>

   
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
  
  {/* Discount */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Discount<span className="text-red-400"> *</span>
    </h3>
    <input
      type="number"
      className="w-full h-[40px] border mt-2 px-3 border-[rgba(0,0,0,0.2)]
        focus:outline-none focus:border-[rgba(0,0,0,0.4)]
        hover:border-[rgba(0,0,0,0.4)] rounded-md text-sm"
      name="discount"
      value={formFields.discount}
      onChange={onChangeInput}
    />
  </div>

  {/* Product Rams */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">Product Rams</h3>
    {productRamData?.length !== 0 && (
      <Select
        multiple
        className="w-full mt-2"
        size="small"
        value={productRam}
        onChange={handleChangeProductRam}
      >
        {productRamData?.map((item, index) => (
          <MenuItem key={index} value={item?.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    )}
  </div>

  {/* Product Weight */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">Product Weight</h3>
    {productwightData?.length !== 0 && (
      <Select
        multiple
        className="w-full mt-2"
        size="small"
        value={productwight}
        onChange={handleChangeProductwight}
      >
        {productwightData?.map((item, index) => (
          <MenuItem key={index} value={item?.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    )}
  </div>

  {/* Product Size */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">Product Size</h3>
    {productsizeData?.length !== 0 && (
      <Select
        multiple
        className="w-full mt-2"
        size="small"
        value={productsize}
        onChange={handleChangeProductsize}
      >
        {productsizeData?.map((item, index) => (
          <MenuItem key={index} value={item?.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    )}
  </div>

  {/* Product Rating */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">Product Rating</h3>
    <Rating
      name="rating"
      value={formFields.rating}
      onChange={onChangeRating}
    />
  </div>

</div>




  <div className="col w-full p-5 px-0">
  <h3 className="font-[700] text-[18px] mb-2">Media & Images</h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
    {previews?.length !== 0 &&
      previews?.map((image, index) => (
        <div className="uploadBoxWrapper relative" key={index}>
          {/* Close/Delete Button */}
          <span
            className="absolute w-[22px] h-[22px] rounded-full bg-red-600 -top-2 -right-2 
              flex items-center justify-center cursor-pointer z-50 shadow-md hover:bg-red-700"
            onClick={() => removeImg(image, index)}
          >
            <IoMdClose className="text-white text-[16px]" />
          </span>

          {/* Image Box */}
          <div
            className="uploadBox w-full rounded-md overflow-hidden border border-dashed 
              border-[rgba(0,0,0,0.3)] h-[150px] bg-gray-200 
              cursor-pointer hover:bg-gray-300 flex items-center justify-center relative"
          >
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
      ))}

    {/* Upload New Images */}
    <UploadBox
      multiple={true}
      name="images"
      url="/product/uploadimages"
      setPreviewsFun={setPreviewsFun}
    />
  </div>
</div>

  
  
  
 <div className="col w-full p-5 px-0">
  <div className="shadow-md bg-white rounded-md p-4 w-full">
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-[700] text-[18px]">Banner Images</h3>
      <Switch {...label} onChange={handleChangeSwitch} checked={checkedSwitch} />
    </div>

    {/* Image Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
      {bannerpreviews?.length !== 0 &&
        bannerpreviews?.map((image, index) => (
          <div className="uploadBoxWrapper relative" key={index}>
            {/* Delete Button */}
            <span
              className="absolute w-[22px] h-[22px] rounded-full bg-red-600 -top-2 -right-2 
                flex items-center justify-center cursor-pointer z-50 shadow hover:bg-red-700"
              onClick={() => removeBannerImg(image, index)}
            >
              <IoMdClose className="text-white text-[16px]" />
            </span>

            {/* Preview */}
            <div
              className="uploadBox w-full rounded-md overflow-hidden border border-dashed 
                border-[rgba(0,0,0,0.3)] h-[150px] bg-gray-200 cursor-pointer hover:bg-gray-300 
                flex items-center justify-center relative"
            >
              <LazyLoadImage
                className="w-full h-full object-cover"
                alt="banner"
                effect="blur"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
                src={image}
              />
            </div>
          </div>
        ))}

      {/* Upload New Banner */}
      <UploadBox
        multiple={true}
        name="bannerimages"
        url="/product/uploadBannerimages"
        setBannerImagesFun={setBannerImagesFun}
      />
    </div>
  </div>
</div>

{/* Banner Title */}
<div className="col w-full mt-4">
  <h3 className="font-[700] text-[18px] mb-2">Title</h3>
  <input
    type="text"
    className="w-full h-[35px] px-3 border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] 
      hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm"
    name="bannerTitlename"
    value={formFields.bannerTitlename}
    onChange={onChangeInput}
    placeholder="Enter banner title"
  />
</div>

  
  
  


  </div>
  
  
  <br/>
      <Button type='submit' className='btn-blue btn-lg  flex gap-4'>  
      <FaCloudUploadAlt className='text-[20px]'/>  
         {       
        isLoading === true ? <CircularProgress color="inherit"/>   
        :
        'Publish and View'
         }
      </Button>
  </form>

  </section>
  )
}
 export default EditProduct;

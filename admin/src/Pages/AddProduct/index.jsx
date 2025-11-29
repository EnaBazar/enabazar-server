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
import { deleteImages, fetchDataFromApi, postData } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import { useNavigate} from 'react-router-dom';
import Switch from '@mui/material/Switch';


 const AddProduct = () => {
   
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
  
  
const label = { inputProps: { 'aria-label': 'Switch demo' } };
   
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
     
const onChangeInput = (e) => {
  const { name, value } = e.target;

  setFormFields(prev => ({
    ...prev,
    [name]: value
  }));
}
  
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
  },[])
  
  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value
  formFields.category = event.target.value
  };
  
  
    const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    formFields.isDisplayOnHomeBanner = event.target.checked
 
  };
// ✅ Sub Category Filter করা
const filteredSubCats = context?.catData?.find(cat => cat._id === productCat)?.children || [];

// ✅ Third Category Filter করা
const filteredThirdCats = filteredSubCats.find(sub => sub._id === productsubCat)?.children || [];

  
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

   
  
  
  
  
  const handleSubmitg=(e)=>{
e.preventDefault(0); // ✅

 if(formFields.name==="")
        {
          context.openAlertBox("error","Please entry Product Name")
         setIsLoading(false);
         
          return false
            
        }

 if(formFields.description==="")
        {
          context.openAlertBox("error","Please entry description Name")
         setIsLoading(false);
         
          return false
            
        }



         if(formFields.catId==="")
        {
          context.openAlertBox("error","Please entry ProductCategory")
         setIsLoading(false);
         
          return false
            
        }


        
         if(formFields.price==="")
        {
          context.openAlertBox("error","Please entry Price")
         setIsLoading(false);
         
          return false
            
        }
        
             if(formFields.oldPrice==="")
        {
          context.openAlertBox("error","Please entry OldPrice")
         setIsLoading(false);
         
          return false
            
        }
    


     if(formFields.countInStock==="")
        {
          context.openAlertBox("error","Please entry Product stock")
         setIsLoading(false);
         
          return false
            
        }
        
         if(formFields.brand==="")
        {
          context.openAlertBox("error","Please entry Brand Name")
         setIsLoading(false);
         
          return false
            
        }
             if(formFields.rating==="")
        {
          context.openAlertBox("error","Please entry Rating")
         setIsLoading(false);
          return false
            
        }
        
             if(formFields.discount==="")
        {
          context.openAlertBox("error","Please entry Discount")
         setIsLoading(false);
          return false
            
        }
           if(previews?.length===0)
        {
          context.openAlertBox("error","Please entry Category Image")
           setIsLoading(false);
           return false
           
        }
        
        
       setIsLoading(true)
    
       postData("/product/create", formFields).then((res) => {
   
  
   
  
  if (res.error === false) {
     context.openAlertBox("success",res?.message)
     setTimeout(() =>{
          setIsLoading(false)
          
   
        context.setIsOpenFullScreenPanel({
          open:false
        })
        
        history("/products")
          },2500)
   
   
  } else {
    setIsLoading(false);
    context.openAlertBox("error", res?.message || "Something went wrong");
  }
  
});
  }
  
  
  
  
  
  
  
  
  return (
  <section className='p-6 min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200'>

  <form className='form py-3 ' onSubmit={handleSubmitg}>

 <div className='scroll !sm:w-[full] max-h-[70vh] overflow-y-scroll pr-2 md:pr-4'>
  
  <div className='grid grid-cols-1 mb-3'>
  <div className='col'>
  <h3 className='text-[16px] font-[600]'>Product Name<span className='text-red-400'> *</span></h3>
  <input type='text' className='w-full h-[30px] border mt-2 border-[rgba(0,0,0,0.2)] 
  focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm'
  name='name'
   value={formFields.name} 
  onChange={onChangeInput}
  />
  </div>
  </div>
  <div className='grid grid-cols-1 mb-3'>
  <div className='col'>
  <h3 className='text-[16px] font-[600]'>Discription<span className='text-red-400'> *</span></h3>
  <textarea type='text' className='w-full h-[140px] border mt-2 border-[rgba(0,0,0,0.2)] 
  focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm'
    name='description'
   value={formFields.description} 
  onChange={onChangeInput}
  />
  </div>
  </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-3 gap-4">
  {/* Category */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Category<span className="text-red-400"> *</span>
    </h3>
    {context?.catData?.length !== 0 && (
      <Select
        className="w-full h-[40px] mt-2"
        labelId="product-cat-label"
        id="productCatDrop"
        size="small"
        value={productCat}
        onChange={handleChangeProductCat}
      >
        {context?.catData?.map((cat, index) => (
          <MenuItem
            key={cat?._id || index}
            value={cat?._id}
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
      className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] 
      hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2"
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
      className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] 
      hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2"
      name="oldPrice"
      value={formFields.oldPrice}
      onChange={onChangeInput}
    />
  </div>

  {/* Featured */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Is Featured?<span className="text-red-400"> *</span>
    </h3>
    <Select
      className="w-full h-[40px] mt-2"
      labelId="product-featured-label"
      id="productFeaturedDrop"
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
      className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] 
      hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2"
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
      className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] 
      hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2"
      name="brand"
      value={formFields.brand}
      onChange={onChangeInput}
    />
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4">
  {/* Discount */}
  <div className="col">
    <h3 className="text-[16px] font-[600]">
      Discount<span className="text-red-400"> *</span>
    </h3>
    <input
      type="number"
      className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] 
      hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2"
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
        className="w-full h-[40px] mt-2"
        labelId="productRam-label"
        id="productRamDrop"
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
        className="w-full h-[40px] mt-2"
        labelId="productWeight-label"
        id="productWightDrop"
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
        className="w-full h-[40px] mt-2"
        labelId="productSize-label"
        id="productsizeDrop"
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
      name="half-rating"
      defaultValue={1}
      precision={0.5}
      onChange={onChangeRating}
    />
  </div>
</div>

  
  
  
  
  
  
<div className="col w-full p-5 px-0">
  <h3 className="font-[700] text-[18px] mb-2">Media & Images</h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-5">
    {/* Image Previews */}
    {previews?.length !== 0 &&
      previews.map((image, index) => (
        <div className="uploadBoxWrapper relative" key={index}>
          {/* Remove Button */}
          <span
            className="absolute w-[20px] h-[20px] rounded-full bg-red-700 -top-[2px] -right-[2px] 
            flex items-center justify-center cursor-pointer z-50"
            onClick={() => removeImg(image, index)}
          >
            <IoMdClose className="text-white text-[17px]" />
          </span>

          {/* Image Box */}
          <div
            className="uploadBox p-0 w-full rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] 
            h-[150px] bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center flex-col relative"
          >
            <LazyLoadImage
              className="w-full h-full object-cover"
              alt="image"
              effect="blur"
              wrapperProps={{ style: { transitionDelay: "1s" } }}
              src={image}
            />
          </div>
        </div>
      ))}

    {/* Upload Box */}
    <UploadBox
      multiple={true}
      name="images"
      url="/product/uploadimages"
      setPreviewsFun={setPreviewsFun}
    />
  </div>
</div>

  
 <div className="col w-full p-5 px-0">
  <div className="shadow-mg bg-white rounded-md p-4 w-full">
    <div className="flex items-center justify-between flex-wrap gap-2">
      <h3 className="font-[700] text-[18px] mb-2">Banner Images</h3>
      <Switch {...label} onChange={handleChangeSwitch} checked={checkedSwitch} />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-5 mt-3">
      {bannerpreviews?.length !== 0 &&
        bannerpreviews.map((image, index) => (
          <div className="uploadBoxWrapper relative" key={index}>
            {/* Remove Button */}
            <span
              className="absolute w-[20px] h-[20px] rounded-full bg-red-700 -top-[2px] -right-[2px] 
                flex items-center justify-center cursor-pointer z-50"
              onClick={() => removeBannerImg(image, index)}
            >
              <IoMdClose className="text-white text-[17px]" />
            </span>

            {/* Image Box */}
            <div
              className="uploadBox p-0 w-full rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] 
                h-[150px] bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center flex-col relative"
            >
              <LazyLoadImage
                className="w-full h-full object-cover"
                alt="image"
                effect="blur"
                wrapperProps={{ style: { transitionDelay: "1s" } }}
                src={image}
              />
            </div>
          </div>
        ))}

      {/* Upload Box */}
      <UploadBox
        multiple={true}
        name="bannerimages"
        url="/product/uploadBannerimages"
        setBannerImagesFun={setBannerImagesFun}
      />
    </div>
  </div>

  {/* Title Input */}
  <h3 className="font-[700] text-[18px] mb-2 mt-5">Title</h3>
  <input
    type="text"
    className="w-full h-[40px] border mt-2 border-[rgba(0,0,0,0.2)] 
      focus:outline-none focus:border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.4)] rounded-sm text-sm px-2"
    name="bannerTitlename"
    value={formFields.bannerTitlename}
    onChange={onChangeInput}
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
 export default AddProduct;

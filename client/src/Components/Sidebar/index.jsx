
"use client"
import React, { useContext, useEffect, useState } from 'react';
import "../Sidebar/style.css";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Collapse} from 'react-collapse';
import { FaAngleDown } from 'react-icons/fa6';
import { FaAngleUp } from 'react-icons/fa6';
import  Button  from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';

import { useLocation, useParams} from 'react-router-dom';
import { postData } from '../../utils/api';

const Sidebar =(props) =>{
    
            const context = useContext(MyContext)
    const [isOpenCategoryFilter,SetIsOpenCategoryFilter] =useState(true);
    const [isOpenAvailFilter,SetIsOpenAvailFilter] =useState(true);
    const [isOpenSizeFilter,SetIsOpenSizeFilter] =useState(true);
        const [catId, setCatId] = useState('')
          const [value, setValue] = useState();

   
     const { id } = useParams();
        
  const [filters, setfilters] = useState({
          
          catId:[],
          subCatId:[],
          thirdsubCatId:[],
          minPrice:'',
          maxPrice:'',
          rating:'',
          page:1,
          limit:25
        });
        
        
        const [price, setPrice] = useState([0, 600000])
        const [url, setUrl] = useState('');

        const location = useLocation();
    
    
    
     const handleCheckboxChange = (field, value) => {

      context?.setSearchData([]);
    const currentValues = filters[field] || [];
    const updatedValues = currentValues?.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setfilters((prev)=>({
      ...prev,
      [field]: updatedValues,
    })) 

    if (field === 'catId') {
      
       setfilters((prev)=>({
      ...prev,
    subCatId: [],
    thirdsubCatId: []
    })) 
      
   
    }

    
  };

         
      
     useEffect(()=>{
     const url = window.location.href;  
      const queryParameters = new URLSearchParams(location.search);
      
      if(url.includes("catId")){
        const categoryId = queryParameters.get("catId");
        const catArr = [];
        catArr.push(categoryId);
      
        filters.catId = catArr;
        filters.subCatId = [];
        filters.thirdsubCatId = [];
        filters.rating = [];
            context?.setSearchData([]);
      }
        if(url.includes("subCatId")){
        const subcategoryId = queryParameters.get("subCatId");
        const subcatArr = [];
        subcatArr.push(subcategoryId);
        filters.subCatId = subcatArr;
        filters.catId = [];
        filters.thirdsubCatId = [];
        filters.rating = [];
        context?.setSearchData([]);
      }
           
                 
        if(url.includes("thirdsubCatId")){
        const thridcategoryId = queryParameters.get("thirdsubCatId");
        const thirdcatArr = [];
        thirdcatArr.push(thridcategoryId);
        filters.thirdsubCatId = thirdcatArr;
        filters.catId = [];
        filters.subCatId = [];
        filters.rating = [];
        context?.setSearchData([]);
        }
           filters.page = 1;
           setTimeout(()=>{
           filtesData();            
           },500)
           },[location]) 

        const filtesData=()=>{
        props.setIsLoading(true);

if(context?.searchData?.products?.length > 0){
            props.setProductsData(context?.searchData);
            props.setIsLoading(false);
            props.setTotalPage(context?.searchData?.totalPages);
            window.scrollTo(0, 0);
}else{
        postData(`/product/filters`, filters).then((res)=>{
            props.setProductsData(res);
            props.setIsLoading(false);
            props.setTotalPage(res?.totalPages);
            window.scrollTo(0, 0);
          });
}
  }; 
  useEffect(()=>{
    filters.page = props.page;
    filtesData();
  },[filters, props.page])
                 
    useEffect(() => {
    setfilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);
        
    
 
    return(
      
    <aside className='sidebar py-5 sticky top-[140px] z-[50] '>
    <div className='box !mb-5'>
     <h3 className='w-full !mb-3 text-[16px] font-[600]  link flex items-center pr-5'>Filter By Category
     <Button className=' !w-[30%] !h-[30px] !min-w-[30px]   !rounded-full !ml-auto !text-[black] '
      onClick={()=>SetIsOpenCategoryFilter(!isOpenCategoryFilter)}>
     {
         isOpenCategoryFilter===true ? <FaAngleUp/> : <FaAngleDown/>
         
     }
    
     </Button>
      </h3>
   <Collapse isOpened={isOpenCategoryFilter}>
                <div className='scroll py-2 px-4 relative -left-[13px]'>
                 {context?.catData?.map((item, index) => (
                 <FormControlLabel
                   key={index}
                   value={item?._id}
                   control={<Checkbox size='sm'/>}
                   checked={filters?.catId?.includes(item?._id) }
                   label={item?.name}
                   onChange={() => handleCheckboxChange('catId',item?._id)}
                   className='w-full'
                   />
                   ))}
                  </div>
                 </Collapse>
      </div> 
           
   
               
      <div className='box !mb-5'>
      <h3 className='w-full !mb-3 text-[16px] font-[600]  link flex items-center pr-5'>
       Filter By Price 
      </h3>
      <RangeSlider
      value={price}
      onInput={setPrice}
      min={100}
      max={60000}
      step={25}
      
       />
      
      <div className='flex !pt-4 pb-2 text-[13px]  priceRange'>

      <span >
      From: <strong className='text-dark'> Rs: {price[0]}</strong>
      </span>
      <span className='!ml-auto'>
      To: <strong > Rs: {price[1]}</strong>
      </span>
      </div>
      </div>
      
      <div className='box mt-4'>
      <h3 className='w-full !mb-3 text-[16px] font-[600]  link flex items-center pr-5'>
       Filter By Rating 
      </h3>
      <div className='w-full'>
      <Rating name="size-small" defaultValue={5} size="small" readOnly/>
      </div>
    
      <div className='w-full'>
      <Rating name="size-small" defaultValue={4} size="small" readOnly/>
      </div>
      
      <div className='w-full'>
      <Rating name="size-small" defaultValue={3} size="small" readOnly/>
      </div>
      
      <div className='w-full'>
      <Rating name="size-small" defaultValue={2} size="small" readOnly/>
      </div>
      
      <div className='w-full'>
      <Rating name="size-small" defaultValue={1} size="small" readOnly/>
      </div>
      </div>
    
      </aside>    
        
    )
    
    
}

export default Sidebar;
import { Button } from '@mui/material';
import React, { useContext, useState } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { MyContext } from '../../App';
import { FaAngleDown } from 'react-icons/fa';
import EditSubCatBox from './EditSubCatBox';





 const SubCategoryList = () => {
      const context = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(0);
    
    
    const expend = (index) => {
      
      if (isOpen === index){
        
        setIsOpen(!isOpen);
      }else{
        setIsOpen(index);
      }
    }
    
    
  return (
<>
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-0 mt-3 gap-2">
  {/* Left Title */}
  <h2 className="text-[18px] sm:text-[20px] font-[600]">Sub Category List</h2>

  {/* Right Controls */}
  <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
    <Button className="btn !bg-green-600 btn-sm !text-white">
      Export
    </Button>

    <Button
      className="btn-blue btn-sm !text-white flex items-center"
      onClick={() =>
        context.setIsOpenFullScreenPanel({
          open: true,
          model: "AddNewSubCategory",
        })
      }
    >
      <IoMdAdd className="text-white text-[20px]" />
      Add Sub Category
    </Button>
  </div>
</div>



<div className='card my-5 pt-5 pb-5 px-5 shadow-md sm:rounded-lg bg-gray-300 '>
{
  
  context?.catData?.length !== 0 &&
  <ul className='w-full'>
  {
    context?.catData?.map((firstLavelCat, index)=> {
      return(
        
        
      <li className='w-full  bg-[#bababb] mb-1 ' key={index}>
      <div className='flex items-center w-full p-2 bg-[#f9fafc] rounded-sm px-2'>
      
      <span className='font-[500] flex items-center gap-4 text-[16px]'>
      {firstLavelCat?.name}
      </span>
      <Button className='!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !ml-auto'
      onClick={() => expend(index)}
      >
      <FaAngleDown/>
      </Button>
      </div>
        
        
        {
          isOpen === index && 
          <>
          {firstLavelCat?.children?.length !== 0 &&
           <ul className='w-full'>
            {firstLavelCat?.children?.map((subCat, index_) => {
              
              
               return(
                 
                 
                 <li className='w-full py-1' key={index_}>
                  
                 <EditSubCatBox 
                 name={subCat?.name}
                 id={subCat?._id}
                 catData={context?.catData}
                 index={index_}
                 selectedCat={subCat?.parentId}
                 selectedCatName={subCat?.parentCatName}
                 
                 />
                 
                 {
                   subCat?.children?.length !== 0 && 
                   <ul className='pl-4'>
                   {
                     subCat?.children?.map((thridlevel,index_)=> {
                       
                       return(
                         
                         <li 
                         key={index_}
                         className='w-full rounded-sm text-[#2d2d2e] bg-[#f1f1f1]'
                         >
                 <EditSubCatBox 
                 name={thridlevel?.name}
                 catData={firstLavelCat?.children}
                 index={index_}
                 selectedCat={thridlevel?.parentId}
                 selectedCatName={thridlevel?.parentCatName}
                  id={thridlevel?._id}
                 />
                         
                         </li>
                       )
                     })
                     
                     
                   }
                   </ul>
                 }
                 
                 
                 </li>
               )
             })
            }
           
           
           </ul>
           
           }
          </>
        }
        </li>
        
      )
      
    })
  }
  </ul>
}
</div>


</>
  )
}
export default SubCategoryList;

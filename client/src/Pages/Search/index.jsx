import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from "../../Components/ProductItem";
import ProductItemListView from "../../Components/ProductItemListView";
import Button from '@mui/material/Button';
import { IoGridSharp } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import ProductLodingGrid from '../../Components/ProductLoding/ProductLoadingGrid';
import Sidebar from '../../Components/Sidebar';
import { useParams } from 'react-router-dom';
import { postData } from '../../utils/api';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const SearchPage = () => {
  const [itemView, setItemView] = useState('grid'); // ✅ default view
  const [anchorEl, setAnchorEl] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
 const [selectedSortVal , setSelectedSortVal] = useState("name, A to Z") 
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id } = useParams();

const handleSortBy = (name, order, products, value) => {
  setSelectedSortVal(value);
  postData(`/product/sortBy`,{
    
    products: products,
    sortBy: name,
    order: order,
    
  }).then((res)=>{
    setProductsData(res);
    setAnchorEl(null)
  })
}
console.log(productsData)
  return (
    <section className='py-5 pb-0'>
      <div className='container pb-3'>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/" className='link transition'>Home</Link>
          <Link underline="hover" color="inherit" href="/" className='link transition'>Fashion</Link>
        </Breadcrumbs>
      </div>

      <div className='bg-white p-2 '>
        <div className='container flex gap-5'>

          {/* Sidebar */}
          <div className="sidebarwrapper w-[20%] shadow-md  border-1 border-[rgba(0,0,0,0.2)] !mt-3 p-3  rounded-md bg-[#dfd9d9]">
            <Sidebar
        
              productsData={productsData}
              setProductsData={setProductsData} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPage={setTotalPage}
    
              
            />

        
          </div>

          {/* Product Content */}
          <div className='rightContent w-[80%] py-3'>
            <div className='bg-[#dfd9d9] p-2 w-full mb-3 mt-4 shadow-md  border-1 border-[rgba(0,0,0,0.2)] 
            rounded-md flex items-center justify-between sticky top-[140px] z-[90]'>
              <div className='col1 flex items-center itemViewActions'>
                <Button className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${itemView === "list" && 'active'}`}
                  onClick={() => setItemView('list')}>
                  <LuMenu className='text-[rgba(0,0,0,0.7)] text-[20px]' />
                </Button>
                <Button className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${itemView === "grid" && 'active'}`}
                  onClick={() => setItemView('grid')}>
                  <IoGridSharp className='text-[rgba(0,0,0,0.7)] text-[20px]' />
                </Button>
                <span className='text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]'>
                  There are {productsData?.products?.length || 0} products.
                </span>
              </div>

              {/* Sorting */}
              <div className='col2 ml-auto flex items-center justify-end gap-3'>
                <span className='text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]'>Sort-By</span>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  className='!bg-white !text-[10px] !text-[black]'
                >
                 {selectedSortVal}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                       MenuListProps={{
                    
                    "aria-labelledby" : "basic-button",
                  }}
                >
                        <MenuItem
                        
                         onClick={()=>handleSortBy('name', 'asc', productsData, 'Name, A to Z')}
                         className='!text-[13px] !text-[#000] !capitalize'
                         >Name, A to Z
                        
                        
                        
                        </MenuItem>
                        
                         <MenuItem
                        
                         onClick={()=>handleSortBy('name', 'desc', productsData, 'Name, Z to A')}
                         className='!text-[13px] !text-[#000] !capitalize'
                         >Name, Z to A
                        
                        
                        
                        </MenuItem>
                        
                         <MenuItem
                        
                         onClick={()=>handleSortBy('name', 'asc', productsData, 'Price, High to low')}
                         className='!text-[13px] !text-[#000] !capitalize'
                         >Price, high to low
                        
                        
                        
                        </MenuItem>
                        
                          <MenuItem
                        
                         onClick={()=>handleSortBy('name', 'desc', productsData, 'Price, low to high')}
                         className='!text-[13px] !text-[#000] !capitalize'
                         >Price, low to high
                        
                        
                        
                        </MenuItem>
                </Menu>
              </div>
            </div>

          
              <div className={`grid ${itemView==='grid' ? 'grid-cols-4 md:grid-cols-5 gap-4' : 'grid-cols-1 md:grid-cols-1 gap-4'} !mt-5 `}>
              
              {
                itemView === 'grid'  ? (
                <>
             {
               isLoading === true ? <ProductLodingGrid view={itemView}/> 
              
              : 
              
        productsData?.products?.length !== 0 &&  productsData?.products?.map((item, index)=>{
                
              return(
              <ProductItem key={index}  item={item}/>
              )
              })
              }
              </>
              ):(
                  
                  <>
                  
                   {
           isLoading === true ? <ProductLodingGrid view={itemView}/> 
              
              : 
              
           productsData?.products?.length !== 0 &&  productsData?.products?.map((item, index)=>{
                return(
                   <ProductItemListView key={index} item={item}/>
                )
              })
              }
                  
                  
                  
                  
              </>
          
                
                  
                  
                )
              
              }
             
              </div>
              {
                totalpage > 1 &&
                
              <div className='flex items-center justify-center !mt-10'>
              <Pagination 
              showFirstButton showLastButton
              count={totalpage} 
              page={page}
              onChange={(e,value)=>setPage(value)}
               />
              </div>
              }
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;

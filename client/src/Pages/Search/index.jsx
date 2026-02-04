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

const SearchPage = () => {

  const [itemView, setItemView] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");

  const open = Boolean(anchorEl);
  const { id } = useParams();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortBy = (name, order, products, value) => {
    setSelectedSortVal(value);

    postData(`/product/sortBy`, {
      products: products,
      sortBy: name,
      order: order,
    }).then((res) => {
      setProductsData(res);
      setAnchorEl(null);
    });
  };

  return (
    <section className='py-3 md:py-5 pb-0'>
      {/* Breadcrumb */}
      <div className='container pb-3 '>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/" className='link transition'>
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/" className='link transition'>
            Fashion
          </Link>
        </Breadcrumbs>
      </div>

      <div className='bg-white p-2 '>
        <div className='container flex flex-col lg:flex-row gap-5'>

          {/* Sidebar */}
          <div className="
            hidden md:block
            w-full md:w-[30%] lg:w-[20%]
            shadow-md
            border border-[rgba(0,0,0,0.2)]
            mt-3
            p-3
            rounded-md
            bg-[#dfd9d9]
          ">
            <Sidebar
              productsData={productsData}
              setProductsData={setProductsData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPage={setTotalPage}
            />
          </div>

          {/* Right Content */}
          <div className='w-full lg:w-[80%] py-3 '>

            {/* Top Bar */}
            <div className='
              bg-[#dfd9d9]
              p-2
              w-full
              mb-3
              mt-4
              shadow-md
              border border-[rgba(0,0,0,0.2)]
              rounded-md
              flex flex-wrap
              items-center
              justify-between
              sticky
              top-[80px]
              md:top-[140px]
              z-[90] !mb-5
            '>

              <div className='flex items-center gap-2 !mb-2'>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${itemView === "list" && 'active'}`}
                  onClick={() => setItemView('list')}
                >
                  <LuMenu className='text-[20px]' />
                </Button>

                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${itemView === "grid" && 'active'}`}
                  onClick={() => setItemView('grid')}
                >
                  <IoGridSharp className='text-[20px]' />
                </Button>

                <span className='text-[12px] md:text-[14px] font-[500] text-[rgba(0,0,0,0.7)]'>
                  There are {productsData?.products?.length || 0} products
                </span>
              </div>

              {/* Sort */}
              <div className='flex items-center gap-2 mt-2 md:mt-0'>
                <span className='text-[12px] md:text-[14px] font-[500] text-[rgba(0,0,0,0.7)]'>
                  Sort-By
                </span>

                <Button
                  onClick={handleClick}
                  className='!bg-white !text-[11px] !text-black truncate max-w-[160px]'
                >
                  {selectedSortVal}
                </Button>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={() => handleSortBy('name', 'asc', productsData, 'Name, A to Z')}>
                    Name, A to Z
                  </MenuItem>
                  <MenuItem onClick={() => handleSortBy('name', 'desc', productsData, 'Name, Z to A')}>
                    Name, Z to A
                  </MenuItem>
                  <MenuItem onClick={() => handleSortBy('price', 'desc', productsData, 'Price, High to Low')}>
                    Price, High to Low
                  </MenuItem>
                  <MenuItem onClick={() => handleSortBy('price', 'asc', productsData, 'Price, Low to High')}>
                    Price, Low to High
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/* Products */}
            <div
              className={`grid gap-4 mt-5 ${
                itemView === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                  : 'grid-cols-1'
              }`}
            >
              {isLoading ? (
                <ProductLodingGrid view={itemView} />
              ) : (
                productsData?.products?.map((item, index) =>
                  itemView === 'grid' ? (
                    <ProductItem key={index} item={item} />
                  ) : (
                    <ProductItemListView key={index} item={item} />
                  )
                )
              )}
            </div>

            {/* Pagination */}
            {totalpage > 1 && (
              <div className='flex justify-center mt-10'>
                <Pagination
                  showFirstButton
                  showLastButton
                  count={totalpage}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;

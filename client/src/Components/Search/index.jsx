import React, { useState, useContext } from 'react';
import '../Search/style.css';
import { Button } from '@mui/material';
import { IoSearch } from "react-icons/io5";
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const search = () => {
    setIsLoading(true);
    if (searchQuery !== "") {
      fetchDataFromApi(`/product/search/get?q=${searchQuery}&page=${1}&limit=${3}`).then((res) => {
        context?.setSearchData(res);
            context?.setIsOpenSearchPanel(false)
        setTimeout(() => {
          setIsLoading(false);
          history("/search");
      
        }, 700);
      });
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Search Box */}
      <div className='w-[100%] h-[30px] bg-white !rounded-md relative'>
        <input
          type='text'
          placeholder='Search'
          className='w-full h-[35px] focus:outline-none bg-inherit p-3 text-[16px] lg:text-[14px]'
          value={searchQuery}
          onChange={onChangeInput}
        />
        <Button
          className='!absolute top-[1px] right-[5px] z-50 !w-[36px] 
          !min-w-[36px] h-[37px] !rounded-full !text-black text-[20px]'
          onClick={search}
          
        >
          <IoSearch className='text-[#4e4e4e] text-[25px]' />
        </Button>
      </div>

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Search;

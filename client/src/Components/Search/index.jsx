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
    <div className="relative w-full max-w-xl">
  <div className="flex items-center h-[42px]  rounded-full 
    border border-gray-300 focus-within:border-[#FC8934] 
    focus-within:shadow-sm transition">

    <input
      type="text"
      placeholder="Search..."
      className="flex-1 h-full bg-transparent px-4 text-[14px] 
      outline-none placeholder:text-gray-400"
      value={searchQuery}
      onChange={onChangeInput}
    />

    <Button
      onClick={search}
      className="!min-w-[40px] !w-[40px] !h-[40px] 
      !rounded-full !text-black hover:!bg-[#FC8934]/10"
    >
      <IoSearch className="text-[20px] text-gray-600" />
    </Button>
  </div>
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

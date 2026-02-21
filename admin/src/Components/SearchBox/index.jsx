import React, { useRef } from 'react';
import { IoSearch } from 'react-icons/io5';

const SearchBox = ({ searchQuery, setSearchQuery, resetPage, searchDate, setSearchDate }) => {
  const searchInput = useRef();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === "" && resetPage) {
      resetPage(1);
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    if (resetPage) resetPage(1);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Text Search */}
      <div className='w-full h-auto bg-[#f1f1f1] relative overflow-hidden'>
        <IoSearch className='absolute top-[13px] left-[10px] z-50 pointer-events-none opacity-30' />
        <input
          type='text'
          className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] bg-[#f1f1f1] p-2 pl-8 
            focus:outline-none hover:border-[rgba(0,0,0,0.5)] focus:border-[rgba(0,0,0,0.5)] 
            rounded-md text-[13px]'
          placeholder="Search here..."
          value={searchQuery}
          ref={searchInput}
          onChange={handleInputChange}
        />
      </div>



    </div>
  );
};


export default SearchBox;

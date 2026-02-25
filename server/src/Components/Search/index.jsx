import React from 'react' 
import '../Search/style.css';
import { Button } from '@mui/material';
import {IoSearch} from "react-icons/io5";





const Search =() =>{
    
    
    return(
         
        <div className='searchBox w-[100%] h-[40px] bg-[#e5e5e5] rounded-[5px] relative'>
        <input type='text' placeholder='Search' className='w-full h-[35px] focus:outline-none bg-inherit p-3 text-[14px]'/>
        <Button className='!absolute top-[1px] right-[5px] z-50 !w-[36px] !min-w-[36px] h-[37px] !rounded-full !text-black text-[20px]' ><IoSearch/></Button>
      
        </div>
    )
}
export default Search;
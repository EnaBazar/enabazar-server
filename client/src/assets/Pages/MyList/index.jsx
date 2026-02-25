import React from 'react'
import  Button  from '@mui/material/Button';
import {BsFillBagCheckFill} from 'react-icons/bs';
import MyListItems from '../MyList/MyListItems';
import AccountSidebar from '../../Components/AccountSidebar';

const MyList = () => {
  
  return (
      
    <section className='py-10 w-full'>
    <div className='container flex gap-3'>
    <div className='col1 w-[20%]'>
    <AccountSidebar/>
    </div>
    
    
    <div className='col2 w-[70%]'>
    <div className='shadow-md rounded-md p-5 bg-white'>
   
   <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.2)]'>
   <h2>Your List</h2>
   <p>There are <span className='font-bold text-[#ff5252]'>2</span> products your List</p>
   </div>
     <MyListItems />
     <MyListItems />
     <MyListItems />
     <MyListItems />
     <MyListItems />
     <MyListItems/>
     
   
   </div>
    </div>
    </div>
    </section>
        

  )
}
export default MyList;

import React, { useContext } from 'react'
import  Button  from '@mui/material/Button';
import MyListItems from '../MyList/MyListItems';
import AccountSidebar from '../../Components/AccountSidebar';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const MyList = () => {

  window.scrollTo(0,0)
  const context = useContext(MyContext);
  return (
      
   <section className="py-10 w-full">
  <div className="container flex flex-col lg:flex-row gap-5 w-[90%] lg:w-[80%] mx-auto">

    {/* Sidebar */}
    <div className="col1 w-full lg:w-[20%]">
      <AccountSidebar />
    </div>

    {/* Main Content */}
    <div className="col2 w-full lg:w-[70%]">
      <div className="shadow-md rounded-md p-5 bg-white">

        {/* Header */}
        <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.2)]">
          <h2 className="text-[16px] font-semibold">Your List</h2>
          <p className="text-[14px] mt-1">
            There are <span className="font-bold text-[#ff5252]">{context?.myListData?.length}</span> products in your List
          </p>
        </div>

        {/* Items */}
        {context?.myListData?.length !== 0 ? (
          context?.myListData?.map((item, index) => (
            <MyListItems item={item} key={index} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-3 gap-5 text-center">
            <img src="/MyListempty.png" className="w-[150px] sm:w-[200px] mx-auto" alt="Empty List" />
            <h3 className="text-[16px] font-medium">My List is Currently empty</h3>
            <Link to="/">
              <Button className="btn-org btn-sm">Continue Shopping</Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  </div>
</section>

        

  )
}
export default MyList;

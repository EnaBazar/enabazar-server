import React, { useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FiGift } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { MyContext } from '../../App';




const DashboardBoxes = (props) => {
const context = useContext(MyContext);



  return (
    <Swiper
      spaceBetween={10}
      
      navigation={context?.windowWidth < 992 ? false : true}
      modules={[Navigation]}
      className="dashboardBoxesSlider"
      breakpoints={{
        320: { slidesPerView: 1 },   // Mobile
        480: { slidesPerView: 2 },   // Small devices
        768: { slidesPerView: 3 },   // Tablets
        1024: { slidesPerView: 4 },  // Small laptops
        1280: { slidesPerView: 5 },  // Large screens
      }}
    >
      {/* Users */}
      <SwiperSlide>
        <div className='box p-4 bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 border border-[rgba(0,0,0,0.2)] flex items-center gap-4'>
          <FiGift className='!text-[30px] text-[#fff]' />
          <div className='info !w-[70%] text-[#fff]'>
            <h3>Users</h3>
            <b className='flex justify-center'>{props?.users} </b>
          </div>
          <IoStatsChart className='text-[#fff] text-[50px]' />
        </div>
      </SwiperSlide>

      {/* Orders */}
      <SwiperSlide>
        <div className='box p-4 bg-green-600 rounded-md cursor-pointer hover:bg-green-700 border border-[rgba(0,0,0,0.2)] flex items-center gap-4'>
          <FiPieChart className='!text-[30px] text-[#fff]' />
          <div className='info !w-[70%] text-[#fff]'>
            <h3>Orders</h3>
            <b className='flex justify-center'>{props?.orders}</b>
          </div>
          <IoStatsChart className='text-[#fff] text-[50px]' />
        </div>
      </SwiperSlide>

      {/* Products */}
      <SwiperSlide>
        <div className='box p-4 bg-red-500 rounded-md cursor-pointer hover:bg-red-700 border border-[rgba(0,0,0,0.2)] flex items-center gap-4'>
          <BsBank className='!text-[30px] text-[#fff]' />
          <div className='info !w-[70%] text-[#fff]'>
            <h3>Products</h3>
            <b className='flex justify-center'>{props?.products}</b>
          </div>
          <IoStatsChart className='text-[#fff] text-[50px]' />
        </div>
      </SwiperSlide>

      {/* Category */}
      <SwiperSlide>
        <div className='box p-4 bg-blue-700 rounded-md cursor-pointer hover:bg-blue-800 border border-[rgba(0,0,0,0.2)] flex items-center gap-4'>
          <RiProductHuntLine className='!text-[30px] text-[#fff]' />
          <div className='info !w-[70%] text-[#fff]'>
            <h3>Category</h3>
            <b className='flex justify-center'>{props?.category}</b>
          </div>
          <IoStatsChart className='text-[#fff] text-[50px]' />
        </div>
      </SwiperSlide>

      {/* Sales */}
      <SwiperSlide>
        <div className='box p-4 bg-blue-400 rounded-md cursor-pointer hover:bg-blue-500 border border-[rgba(0,0,0,0.2)] flex items-center gap-4'>
          <RiProductHuntLine className='!text-[30px] text-[#fff]' />
          <div className='info !w-[70%] text-[#fff]'>
            <h3>Sales</h3>
            <b className='flex justify-center'>{props?.totalsSalesAmount} &#2547;</b>
          </div>
          <IoStatsChart className='text-[#fff] text-[50px]' />
        </div>
      </SwiperSlide>
    </Swiper>
  )
}

export default DashboardBoxes;

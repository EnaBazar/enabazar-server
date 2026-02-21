import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { MyContext } from '../../App';

const HomeSlider = ({ data = [] }) => {

    const context = useContext(MyContext);
  return (
    <div className="homeslider pb-2 pt-5 lg:pb-5 relative z-[99]">
      <div className="container">
        <Swiper
          spaceBetween={40}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={context?.windowWidth < 992 ? false : true}
          modules={[Autoplay, Pagination]}
          className="sliderHome"
        >
          {data?.length > 0 &&
            data.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className=" relative
                    item rounded-[10px] overflow-hidden
                    min-h-[18vh] lg:min-h-[55vh]
                  "
                >
                  <img
                    src={item?.images?.[0]}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;

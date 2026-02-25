import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FreeMode, Navigation, Pagination, Autoplay } from "swiper/modules";

import { useContext } from "react";
import { MyContext } from "../../App";
import BannerBoxV3 from "../BannarBoxV3";

const AdsBannerSlider = ({ data = [] }) => {
  const context = useContext(MyContext);

  return (
    <div className="!py-5 w-full">
      <Swiper
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 10 },
          480: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 2, spaceBetween: 15 },
          1280: { slidesPerView: 2, spaceBetween: 15 },
        }}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
        className="mySwiper smlBtn"
      >
        {data.length > 0 ? (
          data.map((item, index) => (
            <SwiperSlide
              key={item?._id || index}
              className="flex justify-center items-center"
            >
              <BannerBoxV3
                info={item?.alignInfo}
                image={item?.images?.[0]}
                item={item}
              />
            </SwiperSlide>
          ))
        ) : (
          <p className="text-center py-5">No banners available</p>
        )}
      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;

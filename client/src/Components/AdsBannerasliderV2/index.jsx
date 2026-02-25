import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useContext } from "react";
import { MyContext } from "../../App";
import BannerBoxV4 from "../BannarBoxV4";

const AdsBannerSliderV2 = ({ data = [] }) => {
  const context = useContext(MyContext);

  return (
    <div className="py-5 w-full">
  <Swiper
  loop={true}
  autoHeight={true}
  autoplay={{ delay: 2500, disableOnInteraction: false }}

  /* 🔥 MOBILE SCROLL FIX */
  touchStartPreventDefault={true}
  touchMoveStopPropagation={true}
  simulateTouch={true}
  resistanceRatio={0}
  grabCursor={true}

  breakpoints={{
    0: { slidesPerView: 1, spaceBetween: 5 },
    480: { slidesPerView: 1, spaceBetween: 5 },
    768: { slidesPerView: 2, spaceBetween: 15 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
    1280: { slidesPerView: 3, spaceBetween: 20 },
  }}
  navigation={context?.windowWidth < 992 ? false : true}
  pagination={{ clickable: true }}
  modules={[Navigation, Pagination, Autoplay]}
  className="mySwiper smlBtn"
>

        {data.length > 0 ? (
          data.map((item, index) => (
            <SwiperSlide
              key={item?._id || index}
              className="flex justify-center items-stretch"
            >
              {/* Full height banner */}
              <BannerBoxV4 
              info={item?.alignInfo} image={item?.images?.[0]} item={item} />
            </SwiperSlide>
          ))
        ) : (
          <p className="text-center py-5">No banners available</p>
        )}
      </Swiper>
    </div>
  );
};

export default AdsBannerSliderV2;

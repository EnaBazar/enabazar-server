import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectFade, Pagination, Navigation, Autoplay } from 'swiper/modules';

import { useContext } from 'react';
import { MyContext } from '../../App';
import BannerBoxV3 from '../BannarBoxV3';

const AdsBannerSliderV2 = ({ data = [] }) => {
  const context = useContext(MyContext);

  return (
    <div className="py-5 w-full ">
      <Swiper
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 5 },
          480: { slidesPerView: 1, spaceBetween: 5 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 20 },
        }}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[EffectFade, Pagination, Navigation, Autoplay]}
        className="mySwiper smlBtn"
      >
        {data.length > 0 ? (
          data.map((item, index) => (
            <SwiperSlide
              key={item?._id || index}
              className="flex  justify-center items-center"
            >
              {/* Responsive height */}
              <div className="w-full  ">
                <BannerBoxV3
                  info={item?.alignInfo}
                  image={item?.images?.[0]}
                  item={item}
                />
              </div>
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

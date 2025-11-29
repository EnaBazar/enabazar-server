import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectFade, Pagination, Navigation, Autoplay } from 'swiper/modules';
import BannerBoxV2 from '../BannarBoxV2';
import { useContext } from 'react';
import { MyContext } from '../../App';

const AdsBannerSliderV2 = ({ data = [] }) => {

    const context = useContext(MyContext);
  return (
    <div className="py-5 w-full">
      <Swiper
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {          // ✅ ছোট মোবাইল
            slidesPerView: 2,
            spaceBetween: 10,
          },
          480: {        // ✅ মাঝারি মোবাইল
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {        // ✅ ট্যাবলেট
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {       // ✅ ল্যাপটপ
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {       // ✅ বড় স্ক্রিন
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[EffectFade, Pagination, Navigation, Autoplay]}
        className="mySwiper smlBtn"
      >
        {data.length > 0 ? (
          data.map((item, index) => (
            <SwiperSlide key={item?._id || index}>
              <BannerBoxV2
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

export default AdsBannerSliderV2;

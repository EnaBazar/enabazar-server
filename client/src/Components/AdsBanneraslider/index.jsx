import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FreeMode, Navigation, Pagination, Autoplay } from 'swiper/modules';
import BannerBox from '../BannerBox';
import BannerBoxV2 from '../BannarBoxV2';
import { useContext } from 'react';
import { MyContext } from '../../App';

const AdsBannerSlider = ({ data = [] }) => {
  const context = useContext(MyContext);
  return (
    <div className="py-5 w-full">
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
          0: {          // ছোট মোবাইল
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {        // মাঝারি মোবাইল
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {        // ট্যাবলেট
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {       // ল্যাপটপ
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
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

export default AdsBannerSlider;

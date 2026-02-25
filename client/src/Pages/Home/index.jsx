import React, { useContext, useEffect, useState } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
// Components
import HomeCatSlider from "../../Components/HomeCatSlider";
import AdsBannerSlider from "../../Components/AdsBanneraslider";
import AdsBannerSliderV2 from "../../Components/AdsBannerasliderV2";
import ProductsSlider from "../../Components/ProductsSlider";
import BlogItem from "../../Components/BlogItem";
import HomeSliderV2 from "../../Components/HomeSliderV2";
import BannerBoxV2 from "../../Components/BannarBoxV2";
import ProductLoding from "../../Components/ProductLoding";
import HomeSlider from "../../Components/HomeSlider";
import { Pagination } from "@mui/material";



const Home = () => {
  const context = useContext(MyContext);
  const [value, setValue] = useState(0);
  const [homeSlideData, setHomeSlideData] = useState([]);
  const [propularProductsData, setPropularProductsData] = useState([]);
  const [allProductsData, setAllProductsData] = useState([]);
  const [allFeaturedProductsData, setAllFeaturedProductsData] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [bannerV2Data, setBannerV2Data] = useState([]);
  const [bannerV3Data, setBannerV3Data] = useState([]);
  const [blogData, setBlogData] = useState([]);

  // ✅ Initial Data Load
  useEffect(() => {


    fetchDataFromApi("/homeSlides").then((res) =>
      setHomeSlideData(res?.data || [])
    );

    fetchDataFromApi("/product/getAllProduct").then((res) =>
      setAllProductsData(res?.products || [])
    );

    fetchDataFromApi("/product/getAllProductFeatured").then((res) =>
      setAllFeaturedProductsData(res?.products || [])
    );

    fetchDataFromApi("/bannerV1").then((res) => 
      setBannerV1Data(res?.data || [])
    );
 fetchDataFromApi("/bannerV2").then((res) => 
      setBannerV2Data(res?.data || [])
    );

 fetchDataFromApi("/bannerV3").then((res) => 
      setBannerV3Data(res?.data || [])
    );


    fetchDataFromApi("/blog").then((res) => setBlogData(res?.blog || []));
  }, []);

  // ✅ Popular Products (by Category)
  useEffect(() => {
    if (context?.catData?.length) {
      fetchDataFromApi(
        `/product/getAllProductByCatId/${String(context?.catData[0]?._id)}`
      ).then((res) => {
        if (res?.error === false) {
          setPropularProductsData(res?.products || []);
        }
      });
    }
  }, [context?.catData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByCatId = (id) => {
    setPropularProductsData([]);
    fetchDataFromApi(`/product/getAllProductByCatId/${String(id)}`).then(
      (res) => {
        if (res?.error === false) {
          setPropularProductsData(res?.products || []);
        }
      }
    );
  };

  return (
  <>
  {/* Home Slider */}
  {homeSlideData?.length !== 0 && <HomeSlider data={homeSlideData} />}

  {/* Categories */}
  {context?.catData?.length !== 0 && (
    <HomeCatSlider data={context?.catData} />
  )}

  {/* Popular Products */}
  <section className="mt-10 bg-white py-8">
    <div className="container">
      <div className="flex items-center justify-between flex-col lg:flex-row">
        <div className="leftsec w-full lg:w-[60%]">
          <h2 className="text-[20px] font-[600]">Popular Products</h2>
          <p className="text-[14px] font-[400] mt-0 mb-0">
          অফারটি মিস করতে না চান তাহলে ওডার করুন,এখন উপভোগ করুন
          </p>
        </div>

        <div className="rightsec w-full lg:w-[60%]">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="category tabs"
          >
            {context?.catData?.length !== 0 &&
              context?.catData?.map((cat, index) => (
                <Tab
                  key={cat?._id || index}
                  label={cat?.name}
                  onClick={() => filterByCatId(cat?._id)}
                />
              ))}
          </Tabs>
        </div>
      </div>

      {propularProductsData?.length === 0 && <ProductLoding />}
      {propularProductsData?.length !== 0 && (
        <ProductsSlider items={10} data={propularProductsData} />
      )}
    </div>
  </section>

  {/* Middle Slider + Banner */}
  <section className="!mt-10">
    <div className="container flex flex-col lg:flex-row gap-5 ">
      {/* Slider */}
      <div className="part1 w-full lg:w-[65%]">
        {allProductsData?.length !== 0 && (
          <HomeSliderV2 data={allProductsData} />
        )}
      </div>

      {/*  frist Banners */}
      <div className="part2 w-full  lg:w-[35%] flex flex-row lg:flex-col items-center justify-between gap-4">
        <BannerBoxV2
          info={bannerV1Data[bannerV1Data?.length - 1]?.alignInfo}
          image={bannerV1Data[bannerV1Data?.length - 1]?.images[0]}
          item={bannerV1Data[bannerV1Data?.length - 1]}
        />
        <BannerBoxV2
          info={bannerV1Data[bannerV1Data?.length - 2]?.alignInfo}
          image={bannerV1Data[bannerV1Data?.length - 2]?.images[0]}
          item={bannerV1Data[bannerV1Data?.length - 2]}
        />
      </div>
    </div>
  </section>

  {/* Free Shipping Banner */}
  <section className="!mt-5 bg-white py-8">
    <div className="container">
      <div className="freeShipping w-full m-auto py-4 p-4 border-2 border-[#ff5252] flex items-center justify-between rounded-md mb-7">
        <div className="col1 flex items-center gap-4">
          <LiaShippingFastSolid className="text-[50px]" />
          <span className="text-[15px] font-[600] uppercase">
            Free Shipping
          </span>
        </div>

        <div className="col2">
          <p className="mb-0 font-[700]">
           ১৫০০ টাকার বেশী পন্য ক্রয় করলে ,সারা বাংলাদেশ ডেলিভারি সম্পূর্ন ফ্রী!
          </p>
        </div>


      </div>


    </div>
  </section>

  {/* Latest Products */}
  <section className="!mt-6 bg-white " >
    <div className="container">
      <h2 className="text-[20px] font-[600]">Latest Products</h2>
      <p className="text-[14px] font-[400]">
        Do not miss this current offers until the end of March..
      </p>

      {allProductsData?.length === 0 && <ProductLoding />}
      {allProductsData?.length !== 0 && (
        <ProductsSlider items={6} data={allProductsData} />
      )}
   



        {/*  Second Banners */}
         <div className="w-full !mb-5 ">
      {bannerV1Data?.length !== 0 && (
        <AdsBannerSliderV2 data={bannerV2Data} />
      )}
</div>
  
    </div>
  </section>

  {/* Featured Products */}
  <section className="!mt-3 bg-white ">
    <div className="container">
      <h2 className="text-[20px] font-[600]">Featured Products</h2>
      <p className="text-[14px] font-[400]">
        Do not miss this current offers until the end of March..
      </p>

      {allFeaturedProductsData?.length === 0 && <ProductLoding />}
      {allFeaturedProductsData?.length !== 0 && (
        <ProductsSlider items={6} data={allFeaturedProductsData} />
      )}


    </div>

     {/*  3rd Banners */}
<div className="w-full !mb-5 !p-3">
   {bannerV1Data?.length !== 0 && (
        <AdsBannerSlider data={bannerV3Data} />
      )}
</div>
  </section>

{/* Blog Section */}
{blogData?.length > 0 && (
  <section className="mt-3 bg-white py-8 blogSection">
    <div className="container mx-auto px-4">
      <h2 className="text-[20px] font-[600] !mb-6 sm:mb-8 lg:mb-10">From The Blog</h2>

<Swiper
  spaceBetween={20}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true, // hover করলে থামবে (optional)
  }}
  breakpoints={{
    0: { slidesPerView: 2, spaceBetween: 10 },
    640: { slidesPerView: 2, spaceBetween: 15 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 25 },
    1280: { slidesPerView: 4, spaceBetween: 30 },
  }}
  navigation={false}
  loop={true}              // autoplay smooth করার জন্য recommended
  modules={[FreeMode, Navigation, Autoplay]}
  className="BlogSlider"
>

        {blogData?.map((item, index) => (
          <SwiperSlide key={item?._id || index} className="flex justify-center">
            <BlogItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
)}

</>
  );
};

export default Home;

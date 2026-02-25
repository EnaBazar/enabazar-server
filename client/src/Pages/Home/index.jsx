import React, { useContext, useEffect, useState } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

// Components
import HomeCatSlider from "../../components/HomeCatSlider";
import AdsBannerSlider from "../../components/AdsBanneraslider";
import AdsBannerSliderV2 from "../../components/AdsBannerasliderV2";
import ProductsSlider from "../../components/ProductsSlider";
import BlogItem from "../../components/BlogItem";
import HomeSliderV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/BannarBoxV2";
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
  const [blogData, setBlogData] = useState([]);

  // ✅ Initial Data Load
  useEffect(() => {
    window.scrollTo(0, 0);

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
            Do not miss this current offers until the end of March..
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
  <section className="mt-10">
    <div className="container flex flex-col lg:flex-row gap-5">
      {/* Slider */}
      <div className="part1 w-full lg:w-[65%]">
        {allProductsData?.length !== 0 && (
          <HomeSliderV2 data={allProductsData} />
        )}
      </div>

      {/* Banners */}
      <div className="part2 w-full lg:w-[35%] flex flex-row lg:flex-col items-center justify-between gap-4">
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
          <p className="mb-0 font-[500]">
            Free Delivery Now On Your First Order and Over $200
          </p>
        </div>

        <p className="font-bold text-[30px]">- Only $200*</p>
      </div>

      {bannerV1Data?.length !== 0 && (
        <AdsBannerSliderV2 data={bannerV1Data} />
      )}
    </div>
  </section>

  {/* Latest Products */}
  <section className="!mt-0 bg-white ">
    <div className="container">
      <h2 className="text-[20px] font-[600]">Latest Products</h2>
      <p className="text-[14px] font-[400]">
        Do not miss this current offers until the end of March..
      </p>

      {allProductsData?.length === 0 && <ProductLoding />}
      {allProductsData?.length !== 0 && (
        <ProductsSlider items={6} data={allProductsData} />
      )}


   {bannerV1Data?.length !== 0 && (
        <AdsBannerSlider data={bannerV1Data} />
      )}

  
    </div>
  </section>

  {/* Featured Products */}
  <section className="mt-10 bg-white py-8">
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
  </section>

{/* Blog Section */}
{blogData?.length > 0 && (
  <section className="mt-3 bg-white py-8 blogSection">
    <div className="container mx-auto px-4">
      <h2 className="text-[20px] font-[600] !mb-6 sm:mb-8 lg:mb-10">From The Blog</h2>

      <Swiper
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 10 },       // Mobile
          640: { slidesPerView: 2, spaceBetween: 15 },     // Small tablets
          768: { slidesPerView: 2, spaceBetween: 20 },     // Tablets
          1024: { slidesPerView: 3, spaceBetween: 25 },    // Laptops
          1280: { slidesPerView: 4, spaceBetween: 30 },    // Desktop
        }}
        navigation={true}
        modules={[FreeMode, Navigation]}
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

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";
import {
  MdBrandingWatermark,
  MdFilterVintage,
  MdRateReview,
} from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsPatchCheckFill } from "react-icons/bs";
import Rating from "@mui/material/Rating";
import { Button, CircularProgress } from "@mui/material";

const ProductDetails = () => {
  const [product, setProduct] = useState();
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
   const [reviewsData, setReviewsData] = useState();
  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderBig.current.swiper.slideTo(index);
    zoomSliderSml.current.swiper.slideTo(index);
  };

    const getReviews=()=>{
        fetchDataFromApi(`/auth/getReviews?productId=${id}`).then((res)=> {
            if( res?.error == false){
               setReviewsData(res?.reviews) 
             
            }
        })
    }

  // Fetch product
  useEffect(() => {
    setLoading(true);
    fetchDataFromApi(`/product/${id}`)
      .then((res) => {
        if (res?.error === false) {
          setProduct(res.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
      getReviews()
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-red-500">
        No Product Found
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between py-0 mt-3">
        <h2 className="text-[18px] md:text-[20px] font-[600]">
          Product Details
        </h2>
      </div>

      <br />

      {/* PRODUCT CONTENT — RESPONSIVE */}
      <div className="productDetails flex flex-col md:flex-row gap-10">

        {/* LEFT: IMAGES */}
        <div className="w-full md:w-[40%]">
          {product?.images?.length !== 0 && (
            <div className="flex gap-3">

              {/* MAIN IMAGE */}
              <div className="zoomContainer w-full md:w-[85%] h-[300px] md:h-[500px] rounded-md overflow-hidden">
                <Swiper
                  ref={zoomSliderBig}
                  slidesPerView={1}
                  navigation={false}
                >
                  {product.images.map((item, index) => (
                    <SwiperSlide key={index}>
                      <InnerImageZoom
                        zoomType="hover"
                        zoomScale={1}
                        src={item}
                        className="object-contain w-full h-full"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* THUMBNAIL IMAGES (only md+) */}
              <div className="slider hidden md:block w-[15%]">
                <Swiper
                  ref={zoomSliderSml}
                  direction="vertical"
                  slidesPerView={4}
                  spaceBetween={10}
                  navigation={true}
                  modules={[Navigation]}
                  className="productslidezoom !h-[400px]"
                >
                  {product.images.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`item rounded-md overflow-hidden cursor-pointer group ${
                          slideIndex === index
                            ? "opacity-60"
                            : "opacity-100"
                        }`}
                        onClick={() => goto(index)}
                      >
                        <img
                          src={item}
                          className="w-full h-[80px] object-cover transition-all group-hover:scale-105"
                          alt="thumbnail"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="w-full md:w-[60%]">
          <h1 className="text-[20px] md:text-[25px] font-[500] mb-5">
            {product?.name}
          </h1>

          {/* Brand */}
          <div className="flex items-center py-2">
            <span className="w-[40%] md:w-[30%] font-[500] flex items-center gap-2 text-[14px]">
              <MdBrandingWatermark /> Brand:
            </span>
            <span className="text-[13px]">{product?.brand}</span>
          </div>

          {/* Category */}
          <div className="flex items-center py-2">
            <span className="w-[40%] md:w-[30%] font-[500] flex items-center gap-2 text-[14px]">
              <BiSolidCategoryAlt /> Category:
            </span>
            <span className="text-[13px]">{product?.catName}</span>
          </div>

          {/* Price */}
          <div className="flex items-center py-2 gap-2">
            <span className="w-[40%] md:w-[30%] font-[500] flex items-center gap-2 text-[14px]">
              Price:
            </span>
            <span className="text-blue-700 text-[15px] font-[600] bg-gray-200 p-1 rounded-md">
              ৳ {product?.price}
            </span>
            <span className="line-through text-[14px] bg-red-200 p-1 rounded-md">
              ৳ {product?.oldPrice}
            </span>
          </div>

          {/* RAM */}
          {product?.productRam?.length > 0 && (
            <div className="flex items-center py-2">
              <span className="w-[40%] md:w-[30%] font-[500] flex items-center gap-2 text-[14px]">
                <MdFilterVintage /> RAM:
              </span>
              <div className="flex items-center gap-2">
                {product.productRam.map((ram, i) => (
                  <span key={i} className="text-[12px] bg-gray-200 p-1 rounded-md">
                    {ram}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <br />
          <h2 className="text-[18px] md:text-[20px] font-[500] mb-3">
            Product Description
          </h2>
<div
  dangerouslySetInnerHTML={{
    __html: product?.description
  }}
/>

       

        </div>
      </div>

      <br />
      <br />

      {/* Back Button */}
      <div className="w-full md:w-[80%] flex items-center justify-end">
        <Button
          type="button"
          className="btn-blue btn-sm"
          onClick={() => navigate("/Products")}
        >
          Back
        </Button>
      </div>

      <h2 className="text-[16px] md:text-[18px] font-[500] mt-3">
        Customer Reviews
      </h2>

      {/* Sample Review UI */}
      <div className="reviewsWrap mt-3 !mb-3">
     {
        reviewsData?.length!==0 &&
        <div className='scroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden !mt-5 '>   
    {
        reviewsData?.map((review,index)=>{
  return(
     <div className="reviews w-full p-4 bg-white shadow-sm border rounded-md flex items-center gap-5 mb-3">

          {/* Avatar */}
          <img
            src={review?.image}
            alt="avatar"
            className="w-[60px] h-[60px] md:w-[75px] md:h-[75px] rounded-full border"
          />

          {/* Review Info */}
          <div className="info w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] md:text-[15px] font-[500]">
              {review?.userName}
              </h4>
              <Rating defaultValue={review?.rating}  readOnly size="small" />
            </div>

            <span className="text-[11px] md:text-[12px] font-[500]">
             {review?.createdAt.split("T")[0]}
            </span>

            <p className="text-[12px] md:text-[13px] mt-2">
             {review?.review}
            </p>
          </div>
          
        </div>
  )   
            
        })
    }
     
     
    </div> 
    }
      </div>

   


      <br />
    </>
  );
};

export default ProductDetails;

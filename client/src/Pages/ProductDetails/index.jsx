import React, { useEffect, useState, useRef } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import ProductZoom from '../../Components/ProductZoom';
import ProductsSlider from '../../components/ProductsSlider';
import ProductDetailsComponant from '../../Components/ProductDetailsComponant';
import { fetchDataFromApi } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Reviews } from './addReviews';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [relatedproductData, setRelatedproductData] = useState([]);

  const { id } = useParams();
  const reviewSec = useRef();

  // ✅ Reviews fetch (dependency শুধু id)
  useEffect(() => {
    fetchDataFromApi(`/auth/getReviews?productId=${id}`).then((res) => {
      if (res?.error === false) {
        setReviewsCount(res?.reviews.length);
      }
    });
  }, [id]);

  // ✅ Product fetch
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    fetchDataFromApi(`/product/${id}`).then((res) => {
      if (res?.error === false) {
      setProductData(res?.products);
      // Related products fetch
      fetchDataFromApi(`/product/getAllProductBySubCatId/${res?.products?.subCatId}`).then((res2) => {
      if (res2?.error === false) {
      const filteredData = res2?.products?.filter((item) => item._id !== id);
      setRelatedproductData(filteredData);
      }
      });

        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      } else {
        setIsLoading(false);
      }
    });
  }, [id]);

  // ✅ Scroll to reviews
  const gotoreviews = () => {
    window.scrollTo({
      top: reviewSec?.current?.offsetTop - 170,
      behavior: 'smooth',
    });
    setActiveTab(1);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="link transition !text-[14px]">
              Home
            </Link>
            <Link to="/" className="link transition !text-[14px]">
              Fashion
            </Link>
            <span className="link transition !text-[14px]">Best shirts</span>
          </Breadcrumbs>
        </div>
      </div>

      {/* Product Section */}
<section className="bg-white py-5">
  {isLoading ? (
    <div className="flex items-center justify-center min-h-[300px]">
      <CircularProgress />
    </div>
  ) : (
    <>
      {/* Product Details */}
      <div className="container flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center !mb-8">
        {/* Product Images */}
        <div className="productZoomContainer w-full lg:w-[40%] rounded-md !mt-4 !mb-0 lg:!mt-8">
          <ProductZoom images={productData?.images} />
        </div>

        {/* Product Content */}
        <div className="productContent w-full lg:w-[60%] lg:pr-10 mt-6 lg:mt-0">
          <ProductDetailsComponant
            item={productData}
            reviewsCount={reviewsCount}
            gotoreviews={gotoreviews}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="container pt-8 lg:pt-10 !mt-0">
        <div className="flex flex-wrap items-center gap-5 sm:gap-8 !mb-5">
          <span
            className={`link text-[15px] sm:text-[17px] cursor-pointer font-[500] ${
              activeTab === 0 ? 'text-[#ff5252]' : ''
            }`}
            onClick={() => setActiveTab(0)}
          >
            Description
          </span>

          <span
            className={`link text-[15px] sm:text-[17px] cursor-pointer font-[500] ${
              activeTab === 1 ? 'text-[#ff5252]' : ''
            }`}
            onClick={() => setActiveTab(1)}
            ref={reviewSec}
          >
            Reviews ({reviewsCount})
          </span>
        </div>

        {/* Description Tab */}
        {activeTab === 0 && (
          <div className="shadow-md py-4 sm:py-5 px-4 sm:px-8 w-full rounded-md border border-[rgba(0,0,0,0.2)] text-[14px] sm:text-[15px]">
            {productData?.description}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 1 && (
          <div className="shadow-md py-4 sm:py-5 px-4 sm:px-8 w-full lg:w-[80%] rounded-md border border-[rgba(0,0,0,0.2)]">
            {productData && (
              <Reviews
                productId={productData?._id}
                setReviewsCount={setReviewsCount}
              />
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedproductData?.length > 0 && (
        <div className="container !pt-6">
          <h2 className="text-[18px] sm:text-[20px] font-[600]">
            Related Products
          </h2>
          <p className="text-[13px] sm:text-[14px] font-[400] mb-3">
            Do not miss these current offers until the end of March..
          </p>
          <ProductsSlider data={relatedproductData} />
        </div>
      )}
    </>
  )}
</section>

    </>
  );
};

export default ProductDetails;

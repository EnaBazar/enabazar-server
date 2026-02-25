import React from 'react';
import "../BannarBoxV2/style.css";
import { Link } from 'react-router-dom';

const BannerBoxV2 = (props) => {
  // alignment check
  const isLeft = props.info === "left";
  const isCenter = props.info === "center"; // যদি future এ center alignment লাগে
  const isRight = props.info === "right";

  return (
    
     <Link
      to={`/product?catId=${props?.item?.catId}`}>
    <div className="bannerBoxV2 w-full overflow-hidden lg:max-h-[150px] rounded-[10px] group relative">
      {/* Image */}
      <img
        src={props.image}
        alt="banner"
        className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
      />

      {/* Info box */}
      <div
        className={`info absolute inset-0 flex flex-col justify-center gap-2 p-3 sm:p-5 z-10
          ${isLeft ? "items-start text-left" : ""}
          ${isCenter ? "items-center text-center" : ""}
          ${isRight ? "items-end text-right" : ""}
        `}
      >
        {/* Title */}
        <h2 className="text-[10px] sm:text-[14px] font-semibold text-[#dfdede] w-full">
          {props?.item?.bannerTitle?.length > 40
            ? props?.item?.bannerTitle?.substr(0, 40) + "..."
            : props?.item?.bannerTitle}
        </h2>

        {/* Price */}
        <span className="text-[16px] sm:text-[20px] text-red-600 font-semibold w-full">
          &#2547; {props?.item?.price}
        </span>

        {/* Button / Link */}
        <div className="w-full">
          <Link
            to={`/product?catId=${props?.item?.catId}`}
            className="inline-block mt-2 text-[11px] sm:text-[12px] font-semibold 
            text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default BannerBoxV2;

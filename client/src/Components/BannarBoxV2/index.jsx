import React from "react";
import "../BannarBoxV2/style.css";
import { Link } from "react-router-dom";

const BannerBoxV2 = (props) => {
  const isLeft = props.info === "left";
  const isCenter = props.info === "center";
  const isRight = props.info === "right";

  return (
    <Link
      to={`/product?catId=${props?.item?.catId}`}
      className="block"
    >
      <div className="bannerBoxV2 w-full overflow-hidden lg:max-h-[150px] rounded-[10px] group relative">
        
        {/* Image */}
        <img
          src={props.image}
          alt="banner"
          className="w-full h-[90px] sm:h-full object-cover transition-all duration-200 group-hover:scale-105"
        />

        {/* Info box */}
        <div
          className={`info absolute inset-0 flex flex-col justify-center gap-1 p-3 !mt-3 !mb-3 sm:p-5 z-10
            ${isLeft && "items-start text-left"}
            ${isCenter && "items-center text-center"}
            ${isRight && "items-end text-right"}
          `}
        >
          {/* Title */}
          <h2 className="text-[11px] sm:text-[14px] font-semibold text-[#dfdede]">
            {props?.item?.bannerTitle?.length > 40
              ? props?.item?.bannerTitle?.slice(0, 40) + "..."
              : props?.item?.bannerTitle}
          </h2>

          {/* Price */}
          <span className="text-[14px] sm:text-[20px] text-red-600 font-semibold">
            &#2547; {props?.item?.price}
          </span>

          {/* Button (not Link) */}
<div
  className="inline-flex items-center justify-center mt-1
  text-[10px] sm:text-[11px]
  font-semibold
  text-white bg-red-500
  w-[62px] h-[18px]
  rounded"
>
  SHOP NOW
</div>



        </div>
      </div>
    </Link>
  );
};

export default BannerBoxV2;

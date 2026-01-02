import React from "react";
import "../BannarBoxV3/style.css";
import { Link } from "react-router-dom";

const BannerBoxV3 = ({ info, image, item }) => {
  const isLeft = info === "left";
  const isCenter = info === "center";
  const isRight = info === "right";

  return (
    <Link to={`/product?catId=${item?.catId}`} className="block w-full">
      <div className="bannerBoxV3 w-full h-[200px] sm:h-[250px] lg:h-[300px] rounded-[10px] overflow-hidden relative group">
        
        {/* Image */}
        <img
          src={image}
          alt="banner"
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Info box */}
        <div
          className={`info absolute inset-0 flex flex-col justify-center gap-1 p-4 z-10
            ${isLeft && "items-start text-left"}
            ${isCenter && "items-center text-center"}
            ${isRight && "items-end text-right"}
          `}
        >
          {/* Title */}
          <h2 className="text-[12px] sm:text-[16px] font-semibold text-white drop-shadow-md">
            {item?.bannerTitle?.length > 40
              ? item?.bannerTitle.slice(0, 40) + "..."
              : item?.bannerTitle}
          </h2>

          {/* Price */}
          <span className="text-[14px] sm:text-[20px] text-red-500 font-semibold drop-shadow-md">
            &#2547; {item?.price}
          </span>

          {/* Button */}
          <div
            className="inline-flex items-center justify-center mt-2
            text-[10px] sm:text-[12px]
            font-semibold
            text-white bg-red-500
            w-[70px] h-[22px]
            rounded"
          >
            SHOP NOW
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BannerBoxV3;

import React from "react";
import "../BannarBoxV3/style.css";
import { Link } from "react-router-dom";

const BannerBoxV4 = ({ info, image, item }) => {
  const isLeft = info === "left";
  const isCenter = info === "center";
  const isRight = info === "right";

  return (
    <Link to={`/product?catId=${item?.catId}`} className="block w-full h-full">
      <div className="bannerBoxV2 w-full h-full rounded-[10px] overflow-hidden relative group">
        {/* Image */}
        <img
          src={image}
          alt="banner"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay Content */}
        <div
          className={`absolute inset-0 z-10 flex flex-col justify-center gap-1 p-3 sm:p-5
            ${isLeft && "items-start text-left"}
            ${isCenter && "items-center text-center"}
            ${isRight && "items-end text-right"}
          `}
        >
          <h2 className="text-[12px] sm:text-[14px] font-semibold text-[#dfdede] leading-tight">
            {item?.bannerTitle?.length > 40
              ? item.bannerTitle.slice(0, 40) + "..."
              : item?.bannerTitle}
          </h2>

          <span className="text-[14px] sm:text-[20px] text-red-600 font-semibold">
            &#2547; {item?.price}
          </span>

          <div className="mt-1 inline-flex items-center justify-center text-[10px] sm:text-[11px] font-semibold text-white bg-red-500 w-[70px] h-[22px] rounded">
            SHOP NOW
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BannerBoxV4;

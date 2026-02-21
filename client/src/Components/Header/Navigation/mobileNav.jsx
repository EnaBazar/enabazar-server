import React, { useContext } from "react";
import { IoHomeOutline, IoSearch } from "react-icons/io5";
import { LuHeart } from "react-icons/lu";
import { BsBagCheck } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { MyContext } from "../../../App";

export const MobileNav = () => {
  const context = useContext(MyContext);

  const handleSearchClick = () => {
   
    context.setIsOpenSearchPanel(!context.isOpenSearchPanel)
  };

  const navItems = [
    { to: "/", label: "Home", icon: <IoHomeOutline size={25} /> },
    {
      to: "/search", // route নেই
      label: "Search",
      icon: <IoSearch size={25} />,
      onClick: handleSearchClick,
    },
    { to: "/my-list", label: "WishList", icon: <LuHeart size={25} /> },
    { to: "/oders", label: "Orders", icon: <BsBagCheck size={25} /> },
    { to: "/my-account", label: "Account", icon: <FiUser size={25} /> },
  ];

  return (
    <div
      className="mobileNav fixed bottom-0 left-0 w-full 
        bg-white px-3 py-2 grid grid-cols-5 place-items-center gap-3 
        border-t shadow-md z-50"
    >
      {navItems.map((item) => (
        <NavLink

          key={item.label}
             className={({ isActive }) =>
            `flex flex-col items-center w-[40px] min-w-[40px] font-bold transition-colors
             ${isActive ? "text-[#ff5252]" : "text-gray-700"}`
          }
          to={item.to || "#"} // ফাঁকা হলে "#" fallback
          end
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault(); // route change বন্ধ করলাম
              item.onClick();
            }
          }}
       
        >
          {item.icon}
          <span className="text-[14px]">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

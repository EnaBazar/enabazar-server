import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import CategoryPanel from "./CategoryPanel";
import "../Navigation/style.css";
import { MyContext } from "../../../App";
import { MobileNav } from "./mobileNav";

const Navigation = (props) => {
  const context = useContext(MyContext);

  const [isOpenCatPanel, setisOpenCatPanel] = useState(false);
  const [catData, setCatData] = useState([]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // ✅ keyboard state

  /* ---------------- CATEGORY DATA ---------------- */
  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  useEffect(() => {
    setisOpenCatPanel(props.isOpenCatPanel);
  }, [props.isOpenCatPanel]);

  const openCategoryPanel = () => {
    setisOpenCatPanel(true);
  };

  /* ---------------- KEYBOARD DETECT (MOBILE) ---------------- */
  useEffect(() => {
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight;

      if (heightDiff > 150) {
        setIsKeyboardOpen(true); // keyboard open
      } else {
        setIsKeyboardOpen(false); // keyboard closed
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      {context?.windowWidth > 992 && (
        <nav className="py-2 navigation">
          <div className="container flex items-center justify-start lg:justify-end gap-8">
            {/* Category Button */}
            <div className="CatMenu col_1 w-[10%]">
              <Button
                className="!text-black gap-2 min-w-auto justify-start"
                onClick={openCategoryPanel}
              >
                <RiMenu2Fill className="text-[14px]" />
                Categories
                <LiaAngleDownSolid className="text-[12px] ml-auto font-bold" />
              </Button>
            </div>

            {/* Nav Links */}
            <div className="col_2 w-full lg:w-[90%]">
              <ul className="flex items-center gap-3 nav !font-[600]">
                <li className="list-none">
                  <Link to="/" className="link transition">
                    <Button className="link transition !text-[12px] !font-[600] !text-[rgba(0,0,0,0.8)] hover:!text-[#f58822]">
                      Home
                    </Button>
                  </Link>
                </li>

                {catData?.length !== 0 &&
                  catData.map((cat, index) => (
                    <li className="list-none relative" key={index}>
                      <Link to={`/product?catId=${cat?._id}`}>
                        <Button className="!text-[12px] !font-[600] !text-[rgba(0,0,0,0.8)] hover:!text-[#f58822]">
                          {cat?.name}
                        </Button>
                      </Link>

                      {/* Submenu */}
                      {cat?.children?.length !== 0 && (
                        <div className="submenu absolute top-[125%] left-0 min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                          <ul>
                            {cat.children.map((subCat, i) => (
                              <li key={i} className="relative">
                                <Link to={`/product?subCatId=${subCat?._id}`}>
                                  <Button className="w-full !justify-start !text-left">
                                    {subCat?.name}
                                  </Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* ================= CATEGORY PANEL ================= */}
      {catData?.length !== 0 && (
        <CategoryPanel
          isOpenCatPanel={isOpenCatPanel}
          setisOpenCatPanel={setisOpenCatPanel}
          propsSetisOpenCatPanel={props.setisOpenCatPanel}
          data={catData}
        />
      )}

      {/* ================= MOBILE NAV ================= */}
      {context?.windowWidth < 992 && !isKeyboardOpen && (
        <div className="transition-all duration-300">
          <MobileNav />
        </div>
      )}
    </>
  );
};

export default Navigation;

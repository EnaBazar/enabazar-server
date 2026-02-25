import React, { useContext, useState } from "react"
import Button from '@mui/material/Button';
import {RiMenu2Fill} from "react-icons/ri";
import {LiaAngleDownSolid} from "react-icons/lia";
import { Link } from "react-router-dom";
import {GoRocket} from "react-icons/go";
import CategoryPanel from "./CategoryPanel"
import "../Navigation/style.css"
import { fetchDataFromApi } from "../../../../../admin/src/utils/api";
import { useEffect } from "react";
import { MyContext } from "../../../App";
import { MobileNav } from "./mobileNav";

const Navigation =(props) => {
  
  const [isOpenCatPanel,setisOpenCatPanel] = useState(false);
  const [catData, setCatData]= useState([]);
  const context = useContext(MyContext)
  const [openMenu, setOpenMenu] = useState(null);
  
        useEffect(() => {
      setCatData(context?.catData);   
    },[context?.catData]);
        
             useEffect(() => {
      setisOpenCatPanel(props.isOpenCatPanel);   
    },[props.isOpenCatPanel]);  


  const openCategoryPanel =() =>{
    setisOpenCatPanel(true);
  }
  
    return(
        <>
        {context?.windowWidth > 992 && (
  <nav className="py-2 navigation">
    <div className="container flex items-center justify-start lg:justify-end gap-8">

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

      <div className="col_2 w-full lg:w-[90%]">
        <ul className="flex items-center gap-3 nav !font-[600]">
          <li className="list-none">
            <Link to="/" className="link transition text-[14px] !font-[600]">
              <Button className="link transition !text-[10px] lg:!text-[12px] !font-[600] !text-[rgba(0,0,0,0.8)] hover:!text-[#f58822]">
                Home
              </Button>
            </Link>
          </li>

          {catData?.length !== 0 &&
            catData.map((cat, index) => (
              <li className="list-none relative" key={index}>
                <Link
                  to={`/product?catId=${cat?._id}`}
                  className="link transition text-[12px] font-[500]"
                >
                  <Button className="link transition !text-[10px] lg:!text-[12px] !font-[600] !text-[rgba(0,0,0,0.8)] hover:!text-[#f58822]">
                    {cat?.name}
                  </Button>
                </Link>

                {cat?.children?.length !== 0 && (
                  <div className="submenu absolute !top-[125%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                    <ul>
                      {cat?.children.map((subCat, index_) => (
                        <li className="list-none w-full relative" key={index_}>
                          <Link
                            to={`/product?subCatId=${subCat?._id}`}
                            className="w-full"
                          >
                            <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start rounded-none">
                              {subCat?.name}
                            </Button>
                          </Link>

                          {subCat?.children?.length !== 0 && (
                            <div className="submenu absolute !top-[0%] !left-[101%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                              <ul>
                                {subCat?.children.map((thirdLavelCat, index__) => (
                                  <li className="list-none w-full" key={index__}>
                                    <Link
                                      to={`/product?thirdLavelCatId=${thirdLavelCat?._id}`}
                                      className="w-full"
                                    >
                                      <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start rounded-none">
                                        {thirdLavelCat?.name}
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
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  </nav>
)}

        
        {/* category Panel Component */}
        
        {
          catData?.length!==0 &&
                <CategoryPanel 
                isOpenCatPanel={isOpenCatPanel} 
                setisOpenCatPanel={setisOpenCatPanel}
                propsSetisOpenCatPanel={props.setisOpenCatPanel}
                data={catData}
                />
        }


        {
          context?.windowWidth < 992 &&   <MobileNav/>
        }
  

        </>
    )
}
export default Navigation;
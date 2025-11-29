import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

const CategoryCollapse = () => {
  const [catData, setCatData] = useState([]);
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);
  const context = useContext(MyContext);

  // load category data from context
  useEffect(() => {
    setCatData(context?.catData || []);
  }, [context?.catData]);

  const toggleSubmenu = (index) => {
    setSubmenuIndex(submenuIndex === index ? null : index);
    setInnerSubmenuIndex(null); // close inner when switching parent
  };

  const toggleInnerSubmenu = (index) => {
    setInnerSubmenuIndex(innerSubmenuIndex === index ? null : index);
  };

  return (
    <div className="scroll">
      <ul className="w-full">
        {catData?.length > 0 &&
          catData.map((cat, index) => (
            <li
              className="list-none flex items-center relative flex-col"
              key={cat?._id || index}
            >
              {/* main category */}
              <Button
                component={Link}
                to={`/product?catId=${cat?._id}`}
                className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]"
              >
                {cat?.name}
              </Button>

              {/* expand/collapse icon */}
              {cat?.children?.length > 0 &&
                (submenuIndex === index ? (
                  <FiMinusSquare
                    className="absolute top-[10px] right-[15px] cursor-pointer"
                    onClick={() => toggleSubmenu(index)}
                  />
                ) : (
                  <FaRegSquarePlus
                    className="absolute top-[10px] right-[15px] cursor-pointer"
                    onClick={() => toggleSubmenu(index)}
                  />
                ))}

              {/* sub categories */}
              {submenuIndex === index && cat?.children?.length > 0 && (
                <ul className="Submenu w-full pl-3">
                  {cat.children.map((subCat, subIndex) => (
                    <li
                      className="list-none relative cursor-pointer"
                      key={subCat?._id || subIndex}
                    >
                      <Button
                        component={Link}
                        to={`/product?subCatId=${subCat?._id}`}
                        className="w-full !text-left !justify-start !px-3 cursor-pointer !text-[rgba(0,0,0,0.8)]"
                      >
                        {subCat?.name}
                      </Button>

                      {/* expand/collapse icon for inner submenu */}
                      {subCat?.children?.length > 0 &&
                        (innerSubmenuIndex === subIndex ? (
                          <FiMinusSquare
                            className="absolute top-[10px] right-[15px] cursor-pointer"
                            onClick={() => toggleInnerSubmenu(subIndex)}
                          />
                        ) : (
                          <FaRegSquarePlus
                            className="absolute top-[10px] right-[15px] cursor-pointer"
                            onClick={() => toggleInnerSubmenu(subIndex)}
                          />
                        ))}

                      {/* third level categories */}
                      {innerSubmenuIndex === subIndex &&
                        subCat?.children?.length > 0 && (
                          <ul className="inner_Submenu w-full pl-3">
                            {subCat.children.map((third, i) => (
                              <li
                                className="list-none relative !mb-1"
                                key={third?._id || i}
                              >
                                <Button
                                  component={Link}
                                  to={`/product?thirdLavelCatId=${third?._id}`}
                                  className="w-full !text-left !justify-start !px-3 cursor-pointer !text-[rgba(0,0,0,0.8)]"
                                >
                                  {third?.name}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryCollapse;

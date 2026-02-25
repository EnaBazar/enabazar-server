import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ProductItem from "../../Components/ProductItem";
import ProductItemListView from "../../Components/ProductItemListView";
import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import ProductLodingGrid from "../../Components/ProductLoding/ProductLoadingGrid";
import Sidebar from "../../Components/Sidebar";
import { useLocation, useParams, Link as RouterLink } from "react-router-dom";
import { postData } from "../../utils/api";

// ✅ Dynamic Breadcrumbs with API category name
const DynamicBreadcrumbs = ({ categoryName }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        color="inherit"
        component={RouterLink}
        to="/"
        className="link transition"
      >
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        // ✅ শেষ breadcrumb এ categoryName দেখাবে যদি পাওয়া যায়
        const label =
          isLast && categoryName
            ? categoryName
            : value.charAt(0).toUpperCase() + value.slice(1);

        return isLast ? (
          <Typography key={to} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={to}
            key={to}
            className="link transition"
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

const ProductListing = () => {
  const [itemView, setItemView] = useState("grid"); // ✅ default view
  const [anchorEl, setAnchorEl] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");
  const [categoryName, setCategoryName] = useState("");

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { id } = useParams();

  // ✅ Sorting Handler
  const handleSortBy = (name, order, products, value) => {
    setSelectedSortVal(value);
    postData(`/product/sortBy`, {
      products: products,
      sortBy: name,
      order: order,
    }).then((res) => {
      setProductsData(res);
      setAnchorEl(null);
    });
  };

  // ✅ Fetch Products & Category Name (API থেকে)
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    postData(`/product/list`, { categoryId: id, page })
      .then((res) => {
        setProductsData(res);
        setTotalPage(res?.totalPages || 1);
        setCategoryName(res?.categoryName || "Products");
      })
      .finally(() => setIsLoading(false));
  }, [id, page]);

  return (
    <section className="py-5 pb-0">
      <div className="container pb-3">
        {/* ✅ Dynamic Breadcrumbs (API name সহ) */}
        <DynamicBreadcrumbs categoryName={categoryName} />
      </div>

      <div className="bg-white p-2">
        <div className="container flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <div className="sidebarwrapper w-full lg:w-[25%] xl:w-[20%] shadow-md border border-[rgba(0,0,0,0.1)] mt-3 p-3 rounded-md bg-[#f5f5f5]">
            <Sidebar
              productsData={productsData}
              setProductsData={setProductsData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPage={setTotalPage}
            />
          </div>

          {/* Product Content */}
          <div className="rightContent w-full lg:w-[75%] xl:w-[80%] py-3">
            {/* Top Bar */}
            <div
              className="bg-[#f5f5f5] !p-3 w-full !mb-5 shadow-md border
             border-[rgba(0,0,0,0.1)] rounded-md flex flex-wrap items-center
              justify-between sticky top-[120px] lg:top-[190px] z-[90] gap-3"
            >
              {/* View Switch */}
              <div className="col1 flex items-center flex-wrap gap-2">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === "list" && "active"
                  }`}
                  onClick={() => setItemView("list")}
                >
                  <LuMenu className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === "grid" && "active"
                  }`}
                  onClick={() => setItemView("grid")}
                >
                  <IoGridSharp className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                </Button>
                <span className="text-sm md:text-[14px] font-[500] pl-2 text-[rgba(0,0,0,0.7)]">
                  {`There are ${productsData?.products?.length || 0} products.`}
                </span>
              </div>

              {/* Sorting */}
              <div className="col2 ml-auto flex items-center justify-end gap-2">
                <span className="text-sm font-[500] text-[rgba(0,0,0,0.7)]">
                  Sort-By
                </span>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!bg-white !text-xs !text-black shadow-sm"
                >
                  {selectedSortVal}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "asc", productsData, "Name, A to Z")
                    }
                    className="!text-sm !text-[#000] !capitalize"
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "desc", productsData, "Name, Z to A")
                    }
                    className="!text-sm !text-[#000] !capitalize"
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "desc",
                        productsData,
                        "Price, High to Low"
                      )
                    }
                    className="!text-sm !text-[#000] !capitalize"
                  >
                    Price, high to low
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "asc",
                        productsData,
                        "Price, Low to High"
                      )
                    }
                    className="!text-sm !text-[#000] !capitalize"
                  >
                    Price, low to high
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/* Products Grid / List */}
            <div
              className={`grid ${
                itemView === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  : "grid-cols-1 gap-4"
              } mt-5`}
            >
              {isLoading ? (
                <ProductLodingGrid view={itemView} />
              ) : productsData?.products?.length > 0 ? (
                productsData.products.map((item, index) =>
                  itemView === "grid" ? (
                    <ProductItem key={index} item={item} />
                  ) : (
                    <ProductItemListView key={index} item={item} />
                  )
                )
              ) : (
                <Typography
                  variant="body2"
                  className="text-center col-span-full text-gray-500"
                >
                  No products found.
                </Typography>
              )}
            </div>

            {/* Pagination */}
            {totalpage > 1 && (
              <div className="flex items-center justify-center mt-10">
                <Pagination
                  showFirstButton
                  showLastButton
                  count={totalpage}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;

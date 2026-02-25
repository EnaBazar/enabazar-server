import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../Components/ProductItem";
import ProductItemListView from "../../Components/ProductItemListView";
import Pagination from "@mui/material/Pagination";
import ProductLodingGrid from "../../Components/ProductLoding/ProductLoadingGrid";
import { fetchDataFromApi, postData } from "../../utils/api";
import { Button, Menu, MenuItem } from "@mui/material";
import { LuMenu } from "react-icons/lu";
import { IoGridSharp } from "react-icons/io5";

const SearchPage = () => {
  const { keyword } = useParams();
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");
  const [itemView, setItemView] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Fetch products from API
  const fetchProducts = async (kw, pg = 1) => {
    if (!kw) return;
    setIsLoading(true);
    try {
      const res = await fetchDataFromApi(
        `/product/search/get?q=${encodeURIComponent(kw)}&page=${pg}&limit=20`
      );
      setProductsData(res?.products || []);
      setTotalPage(res?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort products


  // Fetch products on keyword or page change
  useEffect(() => {
    fetchProducts(keyword, page);
  }, [keyword, page]);

  return (
    <section className="py-3 md:py-5 pb-0">
      {/* Breadcrumbs */}
      <div className="container pb-3">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/" className="link transition">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/" className="link transition">
            Search
          </Link>
        </Breadcrumbs>
      </div>

      {/* Top Controls: View Toggle + Sorting */}
      <div className="bg-[#dfd9d9] p-2 w-full mb-3 !mt-0 shadow-md border-[rgba(0,0,0,0.2)] rounded-md flex items-center justify-between sticky top-[90px] z-[90]">
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${
              itemView === "list" ? "bg-[#FC8934]/20" : "!text-[#000]"
            }`}
            onClick={() => setItemView("list")}
          >
            <LuMenu className="text-[rgba(0,0,0,0.7)] text-[20px]" />
          </Button>
          <Button
            className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full ${
              itemView === "grid" ? "bg-[#FC8934]/20" : "!text-[#000]"
            }`}
            onClick={() => setItemView("grid")}
          >
            <IoGridSharp className="text-[rgba(0,0,0,0.7)] text-[20px]" />
          </Button>
          <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
            There are {productsData.length} products.
          </span>
        </div>

        {/* Sorting */}
       
      </div>

      {/* Products */}
      <div
        className={`grid gap-4 !mt-8 px-3 !mb-12 ${
          itemView === "grid"
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {isLoading ? (
          <ProductLodingGrid view={itemView} />
        ) : (
          productsData.map((item, index) =>
            itemView === "grid" ? (
              <ProductItem key={index} item={item} />
            ) : (
              <ProductItemListView key={index} item={item} />
            )
          )
        )}
      </div>

      {/* Pagination */}
      {totalpage > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination
            showFirstButton
            showLastButton
            count={totalpage}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </div>
      )}
    </section>
  );
};

export default SearchPage;

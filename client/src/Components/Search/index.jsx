import React, { useState, useContext } from "react";
import "../Search/style.css";
import { Button, Backdrop, CircularProgress } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => setSearchQuery(e.target.value);

  const search = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetchDataFromApi(
        `/product/search/get?q=${searchQuery}&page=1&limit=10`
      );
      context?.setSearchData(res);
      context?.setIsOpenSearchPanel(false);

      setTimeout(() => {
        navigate("/search");
      }, 500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Search Box */}
      <div className="w-full max-w-xl mx-auto px-3 md:px-0">
        <div className="flex items-center h-[45px] rounded-full border border-gray-300 focus-within:border-[#FC8934] focus-within:shadow-sm transition overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 h-full bg-transparent px-4 text-sm outline-none placeholder:text-gray-400"
            value={searchQuery}
            onChange={onChangeInput}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <Button
            onClick={search}
            className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !text-black hover:!bg-[#FC8934]/20 transition"
          >
            <IoSearch className="text-[20px] text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Search;

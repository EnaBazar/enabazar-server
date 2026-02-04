import React, { useState, useContext, useRef, useEffect } from "react";
import "../Search/style.css";
import { Button, Backdrop, CircularProgress } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openList, setOpenList] = useState(false);

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Clear input when search panel closes
  useEffect(() => {
    if (!context.isOpenSearchPanel) {
      setSearchQuery("");
      setSuggestions([]);
      setOpenList(false);
    }
  }, [context.isOpenSearchPanel]);

  const onChangeInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setOpenList(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetchDataFromApi(
          `/product/search/get?q=${value}&page=1&limit=5`
        );
        const products = res?.products || [];
        setSuggestions(products);
        setOpenList(products.length > 0);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setOpenList(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelect = (item) => {
    setSearchQuery("");
    setOpenList(false);
    context.setIsOpenSearchPanel(false); // hide panel on mobile
    navigate(`/search/${encodeURIComponent(item.name)}`);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setOpenList(false);
    context.setIsOpenSearchPanel(false);
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 md:px-0 relative">
      {/* Search Box */}
      <div className="flex items-center h-[45px] rounded-full border border-gray-300 focus-within:border-[#FC8934] focus-within:shadow-sm transition overflow-hidden bg-white">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 h-full bg-transparent px-4 text-sm outline-none placeholder:text-gray-400"
          value={searchQuery}
          onChange={onChangeInput}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !text-black hover:!bg-[#FC8934]/20 transition"
        >
          <IoSearch className="text-[20px] text-gray-600" />
        </Button>
      </div>

      {/* Autocomplete List */}
      {openList && (
        <div className="absolute top-full left-0 w-full bg-white border shadow-lg z-[99999] rounded-md overflow-hidden mt-1">
          {suggestions.map((item) => (
            <div
              key={item._id}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3 text-sm"
            >
              <img
                src={
                  item.images
                    || "DEMO_IMAGE.png"
                }
                alt={item.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1">
                <span className="block">{item.name}</span>
                <span className="text-gray-500 text-xs">৳{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Search;

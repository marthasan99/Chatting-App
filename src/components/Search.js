import React from "react";
import { FiSearch } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Search = () => {
  return (
    <div className="relative">
      <input
        className="w-full  rounded-[20px] border bg-white px-[78px] py-5 shadow-search outline-none"
        type="text"
        placeholder="Search"
      />
      <FiSearch className="absolute top-6 left-7" />
      <BiDotsVerticalRounded className="absolute top-6 right-7 cursor-pointer text-button" />
    </div>
  );
};

export default Search;

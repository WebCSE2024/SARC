import React from "react";
import "./SearchBox.scss";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBox = ({ searchQuery, setSearchQuery, resultsCount }) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="search-container" role="search" aria-label="Search content">
      <div className="search-wrapper">
        <FaSearch className="search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search…"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
        {typeof resultsCount === "number" && (
          <div className="results-count sr-only" aria-live="polite">
            {resultsCount} results
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;

import React from 'react';
import './SearchBox.scss';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input 
          type="text"
          placeholder="What's new?"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FaSearch className="search-icon" />
        {searchQuery && (
          <FaTimes 
            className="clear-icon" 
            onClick={handleClearSearch}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBox;
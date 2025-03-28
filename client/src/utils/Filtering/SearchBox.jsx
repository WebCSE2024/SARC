import React from 'react';
import './SearchBox.scss';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBox = () => {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input 
          type="text"
          placeholder="What's new?"
          className="search-input"
        />
        <FaSearch className="search-icon" />
        {/* <FaTimes className="clear-icon" /> */}
      </div>
    </div>
  );
};

export default SearchBox;
import React from 'react';
import './SearchBar.scss';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-bar__wrapper">
      <div className="search-bar__group">
        <FaSearch className="search-bar__icon" />
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

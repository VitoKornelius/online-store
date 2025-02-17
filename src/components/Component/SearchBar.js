import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/SearchBar.css';
import PropTypes from 'prop-types';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
      onSearch(response.data);
    } catch (error) {
      console.error('Помилка пошуку:', error);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук товарів..."
      />
      <button type="submit">Пошук</button>
    </form>
  );
};

// Валідація пропсів для onSearch
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;

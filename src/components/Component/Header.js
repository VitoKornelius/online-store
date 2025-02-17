import React from "react";
import SearchBar from "./SearchBar";
import "../../styles/Header.css";
import PropTypes from 'prop-types';

const Header = ({ onSearch }) => {
  return (
    <header className="header">
      <div className="container">
        {/* Логотип */}
        <div className="logo-container">
          <img src="/logo.png" alt="Vintage Cars Club" className="logo" />
        </div>

        {/* Назва сайту */}
        <h1 className="site-title">VINTAGE CARS CLUB</h1>


        <div className="search-box">
          <SearchBar onSearch={onSearch} /> {/* Додаємо SearchBar */}
        </div>
      </div>

      {/* Меню навігації */}
      <nav className="nav">
        <ul className="nav-list">
          <li><a href="/" className="nav-item home">Головна</a></li>
          <li><a href="/scale-models" className="nav-item">Масштабні моделі</a></li>
          <li><a href="/collectibles" className="nav-item">Збірні моделі</a></li>
          <li><a href="/cart" className="nav-item">Кошик</a></li>
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired, // Додаємо валідацію пропсів
};

export default Header;

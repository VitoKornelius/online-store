import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/Header.css";
import LoginForm from "../LoginForm";
import SearchBar from "./SearchBar";
import RegistrationForm from "../RegistrationForm";

const Header = ({ onSearch }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };
  const handleOpenLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };
  const handleRegisterOpen = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };
  const handleLoginSuccess = (userName) => {
    setIsLoggedIn(true);
    setUsername(userName);
    setIsLoginOpen(false);
  };

  return (
    <header className="header">
      <div className="auth-buttons-container">
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="user-info">
              <span>{username}</span>
              <button className="auth-button" onClick={handleLogout}>Вийти</button>
            </div>
          ) : (
            <>
              <button className="auth-button" onClick={handleOpenLogin}>Увійти</button>
              <button className="auth-button" onClick={handleRegisterOpen}>Реєстрація</button>
            </>
          )}
        </div>
      </div>

      <div className="nav-container">
        <ul className="nav-list">
          <li><a href="/" className="nav-item home">Головна</a></li>
          <li><a href="/scale-models" className="nav-item">Масштабні моделі</a></li>
          <li><a href="/collectibles" className="nav-item">Збірні моделі</a></li>
          <li><a href="/cart" className="nav-item">Кошик</a></li>
        </ul>
      </div>

      <div className="search-container styled-search">
        <SearchBar onSearch={onSearch} />
      </div>

      {isRegisterOpen && <RegistrationForm onClose={() => setIsRegisterOpen(false)} onRegisterSuccess={handleLoginSuccess} />}
      {isLoginOpen && <LoginForm onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />}
    </header>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Header;
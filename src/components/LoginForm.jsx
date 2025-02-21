// /src/components/LoginForm.jsx
import React, { useState } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Імпортуємо AuthContext
import { useContext } from "react";
import PropTypes from "prop-types";
import "../styles/LoginForm.css";

const LoginForm = ({ onClose }) => {
  const { login } = useContext(AuthContext); // Отримуємо функцію login із контексту
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const userData = { email, password };

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Вхід успішний");
          login(data.user); // Викликаємо login із контексту
          onClose(); // Закриваємо форму після успішного входу
        } else {
          setErrorMessage(`Помилка входу: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Помилка:", error);
        setErrorMessage("Сталася помилка при вході");
      });
  };

  return (
    <div className="login-form-container">
      <button className="login-close-button" onClick={onClose}>X</button>
      <h2>Вхід</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="login-error-message">{errorMessage}</p>}
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;

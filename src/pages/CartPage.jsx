
/*передивитись стиль кошика*/

import React, { useEffect, useState } from "react";
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import "../styles/CartPage.css";

export default function CartPage() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!user) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        console.log(user.id);
        const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
        setCartItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleRemoveFromCart = async (userId, productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/${userId}/${productId}`);
  
      if (response.status === 200) {
        console.log("Product removed from cart");
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
      } else {
        console.error("Error removing item from cart:", response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message || "Unknown error");
    }
  };
  
  

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-page-main-content">
        <h2 className="cart-title">Ваш кошик</h2>
        <div className="cart-items-list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
            <div key={item.id} className="cart-item"> {/*зробити при натиснені перехід на товар*/}
              <img src={`data:image/jpeg;base64,${item.image_base64}`} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Ціна: {item.price} грн</p>
                <p>Кількість: {item.quantity}</p> {/*зробити кільість товара в замовленні Інтерактивним*/}
                <button onClick={() => handleRemoveFromCart(user.id, item.id)} className="remove-from-cart-button">Видалити</button>
              </div>
            </div>
          ))
        ) : (
          <p>Ваш кошик порожній</p>  /*оформити порожній кошик*/
        )}
        </div>
        <div className="cart-total">
          <p>Загальна сума: {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} грн</p>
        </div>
        <button className="checkout-button">Оформити замовлення</button> {/*обробити оформлення*/}
      </div>
      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import '../styles/ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  if (!product) {
    return <div>Товар не знайдено</div>;
  }

  // Формуємо URL для base64-зображення
  const base64ImageUrl = `data:image/jpeg;base64,${product.image_base64}`;

  return (
    <div className="product-page">
      <h2 className="product-name">{product.name}</h2>
      <div className="product-image-container">
        <img src={base64ImageUrl} alt={product.name} className="product-image" />
      </div>
      <p className="product-description">{product.description}</p>
      <p className="product-price">Ціна: <span className="price">{product.price} грн</span></p>
      {product.stock_quantity > 0 ? (
        <p className="product-stock">В наявності: {product.stock_quantity}</p>
      ) : (
        <p className="product-stock out-of-stock">Немає в наявності</p>
      )}
      <p className="product-scale">Масштаб: {product.scale}</p>
      <p className="product-material">Матеріал: {product.material}</p>
      <p className="product-release-year">Рік випуску: {product.release_year}</p>
      <button className="add-to-cart-btn">Додати у кошик</button>
    </div>
  );
};

export default ProductPage;

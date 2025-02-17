import React from "react";
import PropTypes from "prop-types";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    scale,
    material,
    release_year,
  } = product;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src="/path/to/product-image.jpg" alt={name} className="product-image" />
      </div>
      <h2 className="product-name">{name}</h2>
      <p className="product-description">{description}</p>
      <p className="product-price">
        Ціна: <span className="price">{price} грн</span>
      </p>
      {stock_quantity > 0 ? (
        <p className="product-stock">В наявності: {stock_quantity}</p>
      ) : (
        <p className="product-stock out-of-stock">Немає в наявності</p>
      )}
      <p className="product-scale">Масштаб: {scale}</p>
      <p className="product-material">Матеріал: {material}</p>
      <p className="product-release-year">Рік випуску: {release_year}</p>
      <button className="add-to-cart-btn">Додати у кошик</button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    stock_quantity: PropTypes.number.isRequired,
    scale: PropTypes.string,
    material: PropTypes.string,
    release_year: PropTypes.number,
  }).isRequired,
};

export default ProductCard;

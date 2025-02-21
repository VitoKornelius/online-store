import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
        if (response.data.image_base64?.length > 0) {
          setSelectedImage(response.data.image_base64[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;
  if (!product) return <div>Товар не знайдено</div>;

  const defaultPlaceholder = "https://via.placeholder.com/400";
  const mainImage = selectedImage ? `data:image/jpeg;base64,${selectedImage}` : defaultPlaceholder;

  const handleImageClick = (img) => {
    if (img !== selectedImage) setSelectedImage(img);
  };

  return (
    <div className="product-page">
      <div className="product-content-product-page">
        <div className="product-image-container-product-page">
          <img src={mainImage} alt={product.name} className="main-product-image-product-page" />
          {product.image_base64?.length > 1 && (
            <div className="thumbnail-wrapper-product-page">
              {product.image_base64.filter(img => img !== selectedImage).map((img, index) => (
                <img 
                  key={index} 
                  src={`data:image/jpeg;base64,${img}`} 
                  alt={`Thumbnail ${index}`} 
                  className="thumbnail-image-product-page" 
                  onClick={() => handleImageClick(img)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="info-section-product-page">
          <h2 className="title-product-page">{product.name}</h2>
          <p className="description-product-page">{product.description}</p>
          <p className="price-product-page">Ціна: <span className="price">{product.price} грн</span></p>
          {product.stock_quantity > 0 ? (
            <p className="stock-status-product-page">В наявності: {product.stock_quantity}</p>
          ) : (
            <p className="stock-status-product-page out-of-stock">Немає в наявності</p>
          )}
          <p className="product-scale">Масштаб: {product.scale}</p>
          <p className="product-material">Матеріал: {product.material}</p>
          <p className="product-release-year">Рік випуску: {product.release_year}</p>
          <button className="button-order-product-page">Додати у кошик</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

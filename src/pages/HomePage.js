import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import "../styles/ProductCard.css";

export default function HomePage() {
  const [banner, setBanner] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Отримання даних банера та продуктів з API
    axios.get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Помилка завантаження даних:", error);
        setLoading(false);
      });

    axios.get("http://localhost:5000/api/banner")
      .then((response) => {
        setBanner(response.data.imageUrl);
      })
      .catch((error) => {
        console.error("Помилка завантаження даних банера:", error);
      });
  }, []);

  const handleSearchResults = (searchResults) => {
    setProducts(searchResults);
  };

  return (
    <>
      <Header onSearch={handleSearchResults} /> {/* Передаємо onSearch */}
      <div className="container mx-auto p-4">
        <div className="mt-4 flex justify-center">
          {banner && <img src={banner} alt="Banner" className="rounded-lg shadow-lg" />}
        </div>
        {loading ? (
          <p className="text-center">Завантаження...</p>
        ) : (
          <div className="product-list">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

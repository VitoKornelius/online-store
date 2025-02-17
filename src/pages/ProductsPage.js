import React from 'react';
import { useParams } from 'react-router-dom';

const ProductsPage = () => {
  const { categoryId } = useParams();

  return (
    <div>
      <h1>Products in category: {categoryId}</h1>
    </div>
  );
};

export default ProductsPage;

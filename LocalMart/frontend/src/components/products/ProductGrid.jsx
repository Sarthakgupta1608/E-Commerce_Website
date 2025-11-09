// src/components/products/ProductGrid.jsx
import React from 'react';
import ProductCard from '../common/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products }) {
  return (
    <div className={styles.grid}>
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className={styles.noProducts}>No products found matching your filters.</p>
      )}
    </div>
  );
}
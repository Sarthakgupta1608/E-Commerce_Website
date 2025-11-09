// src/components/common/RelatedProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import styles from './RelatedProducts.module.css';

// 1. Update the API URL
const API_URL = 'http://localhost:8080/api/products';

export default function RelatedProducts({ currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!currentProductId) return; // Don't fetch if there's no ID

    const fetchRelated = async () => {
      try {
        // 2. Call the new '/related' endpoint
        const response = await axios.get(`${API_URL}/${currentProductId}/related`);
        setRelatedProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };

    fetchRelated();
  }, [currentProductId]); // Re-fetch if the main product changes

  if (relatedProducts.length === 0) {
    return null; // Don't show the section if no related products
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>You Might Also Like</h2>
      <div className={styles.grid}>
        {/* 3. Render the real related products */}
        {relatedProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
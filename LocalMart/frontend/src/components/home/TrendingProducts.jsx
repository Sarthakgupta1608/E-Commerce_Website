// src/components/home/TrendingProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import ProductCard from '../common/ProductCard';
import styles from './TrendingProducts.module.css';

const API_URL = 'http://localhost:8080/api/products';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Fetch all products
    const fetchTrending = async () => {
      try {
        const response = await axios.get(API_URL);
        // 3. Take the first 4 as "trending"
        setProducts(response.data.slice(0, 4)); 
      } catch (err) {
        console.error("Failed to fetch trending products:", err);
      }
      setLoading(false);
    };

    fetchTrending();
  }, []); // Runs once on mount

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Trending Products</h2>
        <div className={styles.grid}>
          {loading ? (
            <p className={styles.message}>Loading...</p>
          ) : (
            // 4. Map over real products
            products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
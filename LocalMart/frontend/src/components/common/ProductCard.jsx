// src/components/common/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Package } from 'lucide-react'; // 1. Import Package
import styles from './ProductCard.module.css';
// Note: We don't import mockData anymore

export default function ProductCard({ product }) {
  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.name);
    // TODO: Add cart logic here
  };

  // 2. Use the new 'productId' from the API
  return (
    <Link to={`/products/${product.productId}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          {/* 3. Show real image or placeholder */}
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <span className={styles.image}>
              <Package width={48} height={48} />
            </span>
          )}
        </div>
        <div className={styles.content}>
          {/* 4. Use storeName from API */}
          <div className={styles.seller}>{product.storeName}</div>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.rating}>
            {/* TODO: Add rating back when API supports it */}
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                width={16}
                height={16}
                className={i < 4 ? styles.starFilled : styles.starEmpty} // Hard-code 4 stars for now
              />
            ))}
            <span className={styles.ratingCount}>(4.0)</span>
          </div>
          <div className={styles.footer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <button 
              className={styles.cartButton} 
              onClick={handleCartClick}
              aria-label="Add to cart"
            >
              <ShoppingCart width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
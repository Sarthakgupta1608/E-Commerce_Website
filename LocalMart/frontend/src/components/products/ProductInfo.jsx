// src/components/products/ProductInfo.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Star, Minus, Plus, ShoppingCart, Store, CheckCircle } from 'lucide-react';
import styles from './ProductInfo.module.css';

const API_URL = 'http://localhost:8080/api/cart';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // 1. Get token, auth state, AND fetchCart
  const { token, isAuthenticated, role, fetchCart } = useAuth();

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || role !== 'ROLE_CUSTOMER') {
      setError("Please log in as a customer to add items.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const requestData = {
        productId: product.productId,
        quantity: quantity
      };
      const headers = { headers: { 'Authorization': `Bearer ${token}` } };
      
      await axios.post(`${API_URL}/add`, requestData, headers);
      
      // 2. Refresh the global cart state
      await fetchCart(); 

      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      setError("Failed to add to cart. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.info}>
      <span className={styles.seller}>
        <Store width={16} height={16} /> Sold by: {product.storeName}
      </span>
      <h1 className={styles.name}>{product.name}</h1>
      
      <div className={styles.rating}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} width={20} height={20} className={i < 4 ? styles.starFilled : styles.starEmpty} />
        ))}
        <span className={styles.ratingCount}>(4.0 rating)</span>
      </div>

      <p className={styles.description}>
        {product.description || "No description provided."}
      </p>

      <div className={styles.price}>${product.price.toFixed(2)}</div>

      <div className={styles.actions}>
        <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)} className={styles.quantityButton}>
            <Minus width={16} height={16} />
          </button>
          <span className={styles.quantityValue}>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)} className={styles.quantityButton}>
            <Plus width={16} height={16} />
          </button>
        </div>
        
        <button 
          className={`${styles.addToCartButton} ${success ? styles.success : ''}`} 
          onClick={handleAddToCart}
          disabled={loading || success}
        >
          {loading ? (
            'Adding...'
          ) : success ? (
            <>
              <CheckCircle width={20} height={20} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart width={20} height={20} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
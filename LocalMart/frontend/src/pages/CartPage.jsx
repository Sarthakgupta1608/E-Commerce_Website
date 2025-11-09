// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { ShoppingBag } from 'lucide-react';
import styles from './CartPage.module.css';

const API_URL = 'http://localhost:8080/api/cart';

export default function CartPage() {
  // 1. Get state and functions from the global context
  const { token, cartItems, fetchCart } = useAuth();
  const [loading, setLoading] = useState(false); // Local loading for remove
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 2. Calculate subtotal from global cartItems
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  const handleRemoveItem = async (cartItemId) => {
    setLoading(true);
    setError(null);
    try {
      const headers = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.delete(`${API_URL}/item/${cartItemId}`, headers);
      
      // 3. Refresh the global cart state
      await fetchCart(); 
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    }
    setLoading(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // 4. Update the cart count in the header when the page loads
  // (in case it's out of sync)
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.titleWrapper}>
            <ShoppingBag className={styles.titleIcon} />
            <h1 className={styles.title}>Your Cart ({cartItems.length} items)</h1>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {cartItems.length > 0 ? (
            <div className={styles.contentGrid}>
              <div className={styles.itemList}>
                {cartItems.map((item) => (
                  <CartItem 
                    key={item.cartItemId} 
                    item={item} 
                    onRemove={handleRemoveItem}
                    disabled={loading} // Disable remove button while loading
                  />
                ))}
              </div>
              <div className={styles.summaryWrapper}>
                <CartSummary 
                  subtotal={subtotal} 
                  onCheckout={handleCheckout} 
                />
              </div>
            </div>
          ) : (
            <div className={styles.emptyCart}>
              <h2>Your cart is empty.</h2>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <Link to="/products" className={styles.shopButton}>
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
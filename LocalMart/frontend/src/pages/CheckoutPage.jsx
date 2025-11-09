// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentMethod from '../components/checkout/PaymentMethod';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import { Lock } from 'lucide-react';
import styles from './CheckoutPage.module.css';

const API_URL = 'http://localhost:8080/api/cart';

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // 1. Fetch the cart to show in the summary
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL, getAuthHeaders());
        setCart(response.data);
      } catch (err) {
        setError('Failed to fetch your cart.');
      }
      setLoading(false);
    };

    if (token) {
      fetchCart();
      // Pre-fill address if we have it
      if (user?.address) {
        setShippingAddress(user.address);
      }
    }
  }, [token, user]);

  // 2. Handle placing the order
  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      setError("Please enter a shipping address.");
      return;
    }
    
    setIsPlacingOrder(true);
    setError(null);

    try {
      const requestData = { shippingAddress };
      await axios.post(`${API_URL}/checkout`, requestData, getAuthHeaders());
      
      // Success!
      setIsPlacingOrder(false);
      navigate('/profile'); // Redirect to profile to see order history

    } catch (err) {
      setIsPlacingOrder(false);
      setError(err.response?.data || "Checkout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.page}>
          <div className={styles.loadingMessage}>Loading checkout...</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          
          <div className={styles.titleWrapper}>
            <Lock className={styles.titleIcon} />
            <h1 className={styles.title}>Secure Checkout</h1>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.contentGrid}>
            <div className={styles.formColumn}>
              <ShippingForm 
                address={shippingAddress}
                onAddressChange={setShippingAddress}
              />
              <PaymentMethod />
            </div>
            <div className={styles.summaryColumn}>
              <CheckoutSummary 
                items={cart?.items || []}
                subtotal={cart?.subtotal || 0}
                onPlaceOrder={handlePlaceOrder} // Pass the handler
                isLoading={isPlacingOrder}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
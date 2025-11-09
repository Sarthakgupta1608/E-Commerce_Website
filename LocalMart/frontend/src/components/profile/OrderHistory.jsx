// src/components/profile/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Package, ChevronRight } from 'lucide-react';
import styles from './OrderHistory.module.css';

const API_URL = 'http://localhost:8080/api/orders/customer';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.get(API_URL, headers);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch order history.");
        console.error(err);
      }
      setLoading(false);
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Helper to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.orderHistory}>
      <h2 className={styles.title}>Order History</h2>
      
      {loading && <div className={styles.message}>Loading orders...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.orderList}>
        {!loading && orders.length === 0 && (
          <div className={styles.message}>You haven't placed any orders yet.</div>
        )}

        {orders.map((order) => (
          <div key={order.orderId} className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerInfo}>
                <span className={styles.infoLabel}>Order ID</span>
                <span className={styles.infoValue}>#{order.orderId}</span>
              </div>
              <div className={styles.headerInfo}>
                <span className={styles.infoLabel}>Date Placed</span>
                <span className={styles.infoValue}>{formatDate(order.orderDate)}</span>
              </div>
              <div className={styles.headerInfo}>
                <span className={styles.infoLabel}>Total Amount</span>
                <span className={styles.infoValue}>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                {order.status}
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.itemImages}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.itemImageWrapper} title={item.productName}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} />
                    ) : (
                      <Package width={20} height={20} />
                    )}
                  </div>
                ))}
              </div>
              <button className={styles.detailsButton}>
                <span>View Details</span>
                <ChevronRight width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
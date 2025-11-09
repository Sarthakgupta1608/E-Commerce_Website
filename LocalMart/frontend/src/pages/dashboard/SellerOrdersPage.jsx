// src/pages/dashboard/SellerOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Eye, Check, X } from 'lucide-react';
import styles from './SellerOrdersPage.module.css';

const API_URL = 'http://localhost:8080/api/orders/seller';

export default function SellerOrdersPage() {
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
        setError("Failed to fetch orders.");
        console.error(err);
      }
      setLoading(false);
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Manage Orders</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className={styles.tableMessage}>Loading orders...</td></tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td className={styles.orderId}>#{order.orderId}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === 'Pending' ? (
                      <div className={styles.actionButtons}>
                        <button className={`${styles.iconButton} ${styles.success}`} aria-label="Accept">
                          <Check width={16} height={16} />
                        </button>
                        <button className={`${styles.iconButton} ${styles.danger}`} aria-label="Reject">
                          <X width={16} height={16} />
                        </button>
                      </div>
                    ) : (
                      <button className={styles.iconButton} aria-label="View">
                        <Eye width={16} height={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className={styles.tableMessage}>You have not received any orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
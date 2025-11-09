// src/pages/dashboard/SellerDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, ShoppingCart, Package, Activity } from 'lucide-react';
import styles from './SellerDashboardPage.module.css';

const API_URL = 'http://localhost:8080/api/dashboard';

export default function SellerDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/stats`, headers);
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard stats.");
        console.error(err);
      }
      setLoading(false);
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  // Format stats for display
  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      color: 'green' 
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders.toString() || '0', 
      icon: ShoppingCart, 
      color: 'blue' 
    },
    { 
      title: 'Total Products', 
      value: stats?.totalProducts.toString() || '0', 
      icon: Package, 
      color: 'purple' 
    },
    { 
      title: 'Conversion Rate', // This one is still static
      value: '4.8%', 
      icon: Activity, 
      color: 'orange' 
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Welcome Back, {user?.storeName}!</h1>
      <p className={styles.subtitle}>Here's a snapshot of your store's performance.</p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{stat.title}</span>
              <div className={`${styles.statIcon} ${styles[stat.color]}`}>
                <stat.icon width={20} height={20} />
              </div>
            </div>
            <div className={styles.statValue}>
              {loading ? '...' : stat.value}
            </div>
            <div className={styles.statChange} data-positive={true}>
              {/* Static for now */}
              +0.0% vs. last month 
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        <p className={styles.emptyState}>
          {loading ? 'Loading...' : 'Your recent orders will appear here.'}
        </p>
        {/* We will connect this in the final phase */}
      </div>
    </div>
  );
}
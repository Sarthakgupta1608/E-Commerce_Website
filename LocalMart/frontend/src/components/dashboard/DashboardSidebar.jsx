// src/components/dashboard/DashboardSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardSidebar.module.css';

export default function DashboardSidebar() {
  const { user, logout } = useAuth(); // 1. GET USER AND LOGOUT

  return (
    <aside className={styles.sidebar}>
      <div className={styles.storeHeader}>
        <div className={styles.storeIcon}>
          <Store width={20} height={20} />
        </div>
        <div className={styles.storeInfo}>
          {/* 2. USE REAL STORE NAME */}
          <span className={styles.storeName}>{user?.storeName || 'My Store'}</span>
          <span className={styles.storePlan}>Pro Plan</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {/* ... (NavLink area is unchanged) ... */}
        <span className={styles.navTitle}>Menu</span>
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <LayoutDashboard width={20} height={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <Package width={20} height={20} />
          <span>My Products</span>
        </NavLink>
        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <ShoppingCart width={20} height={20} />
          <span>Orders</span>
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <button onClick={logout} className={styles.backLink}>
          <ArrowLeft width={16} height={16} />
          <span>Logout & Exit</span>
        </button>
      </div>
    </aside>
  );
}
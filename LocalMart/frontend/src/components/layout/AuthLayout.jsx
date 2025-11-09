// src/components/layout/AuthLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ title, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logoGroup}>
          <div className={styles.logoIcon}>
            <Store className={styles.logoSvg} />
          </div>
          <span className={styles.logoText}>LocalMart</span>
        </Link>
        
        <h2 className={styles.title}>{title}</h2>
        
        {children}
      </div>
    </div>
  );
}
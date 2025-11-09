// src/components/dashboard/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <DashboardSidebar />
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <Outlet /> {/* Child routes will render here */}
        </div>
      </main>
    </div>
  );
}
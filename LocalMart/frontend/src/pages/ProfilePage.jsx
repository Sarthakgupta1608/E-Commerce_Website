// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import OrderHistory from '../components/profile/OrderHistory';
import AccountDetails from '../components/profile/AccountDetails';
import { User } from 'lucide-react';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('orders'); // 'orders' or 'details' or 'settings'

  const renderSection = () => {
    switch (activeSection) {
      case 'orders':
        return <OrderHistory />;
      case 'details':
        return <AccountDetails />;
      case 'settings':
        return <h2 style={{color: 'var(--text-primary)'}}>Settings coming soon...</h2>;
      default:
        return <OrderHistory />;
    }
  };

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          
          <div className={styles.titleWrapper}>
            <User className={styles.titleIcon} />
            <h1 className={styles.title}>My Account</h1>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.sidebarWrapper}>
              <ProfileSidebar 
                activeSection={activeSection} 
                onSelectSection={setActiveSection} 
              />
            </div>
            <div className={styles.contentWrapper}>
              {renderSection()}
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
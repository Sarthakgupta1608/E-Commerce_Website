// src/components/profile/ProfileSidebar.jsx
import React from 'react';
import { User, List, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfileSidebar.module.css';

export default function ProfileSidebar({ activeSection, onSelectSection }) {
  const { user, logout } = useAuth(); // 1. GET USER AND LOGOUT

  const menuItems = [
    { id: 'details', name: 'Account Details', icon: User },
    { id: 'orders', name: 'Order History', icon: List },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileHeader}>
        {/* 2. UPDATE AVATAR, NAME, AND EMAIL */}
        <div className={styles.avatar}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.name}>{user?.name || 'User'}</span>
          <span className={styles.email}>{user?.email || '...'}</span>
        </div>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navButton} ${
              activeSection === item.id ? styles.active : ''
            }`}
            onClick={() => onSelectSection(item.id)}
          >
            <item.icon width={20} height={20} />
            <span>{item.name}</span>
          </button>
        ))}
        <button className={`${styles.navButton} ${styles.logout}`} onClick={logout}>
          <LogOut width={20} height={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
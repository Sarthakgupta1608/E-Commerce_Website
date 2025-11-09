// src/components/common/SearchModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import styles from './SearchModal.module.css';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Add/remove class to body to prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
    // Cleanup on unmount
    return () => document.body.classList.remove(styles.noScroll);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
      setQuery('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X width={28} height={28} />
        </button>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <Search width={24} height={24} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for products, sellers, and more..."
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </form>
        <p className={styles.tip}>Press Enter to search</p>
      </div>
    </div>
  );
}
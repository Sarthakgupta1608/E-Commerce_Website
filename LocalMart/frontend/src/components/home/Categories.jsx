// src/components/home/Categories.jsx
import React, { useState } from 'react';
import styles from './Categories.module.css';

const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Food & Beverages'];
const categoryEmojis = ['💻', '👗', '🏡', '🍕'];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Browse by Category</h2>
        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={`${styles.card} ${
                activeCategory === idx ? styles.active : ''
              }`}
            >
              <div className={styles.emoji}>{categoryEmojis[idx]}</div>
              <div className={styles.title}>{cat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
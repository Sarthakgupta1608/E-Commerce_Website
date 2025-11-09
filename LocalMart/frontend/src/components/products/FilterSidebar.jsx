// src/components/products/FilterSidebar.jsx
import React, { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import styles from './FilterSidebar.module.css';

const ratings = [4, 3, 2, 1];

export default function FilterSidebar({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
  price,
  onPriceChange,
  selectedRating,
  onRatingChange,
  onClearFilters
}) {
  
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        <button onClick={onClearFilters} className={styles.clearButton}>
          Clear All
        </button>
      </div>

      {/* Categories Filter */}
      <div className={styles.filterBlock}>
        <h4 className={styles.filterTitle}>Category</h4>
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <label key={category} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className={styles.filterBlock}>
        <h4 className={styles.filterTitle}>Price</h4>
        <div className={styles.priceContent}>
          <input 
            type="range" 
            min="0" 
            max="200"
            value={price}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className={styles.priceSlider}
          />
          <div className={styles.priceValue}>
            Up to: <span className={styles.priceAmount}>${price}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className={styles.filterBlock}>
        <h4 className={styles.filterTitle}>Rating</h4>
        <div className={styles.ratingList}>
          {ratings.map((r) => (
            <button
              key={r}
              className={`${styles.ratingButton} ${selectedRating === r ? styles.active : ''}`}
              onClick={() => onRatingChange(r)}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  width={16}
                  height={16}
                  className={i < r ? styles.starFilled : styles.starEmpty}
                />
              ))}
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
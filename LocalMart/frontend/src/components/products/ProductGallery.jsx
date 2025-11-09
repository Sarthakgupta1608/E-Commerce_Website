// src/components/products/ProductGallery.jsx
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ imageUrl, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // We only have one real image, so we'll use placeholders for thumbnails
  const thumbnails = [imageUrl, null, null, null];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        {/* Show real image or placeholder */}
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className={styles.mainImage} />
        ) : (
          <Package width={128} height={128} className={styles.mainImagePlaceholder} />
        )}
      </div>
      
      {/* Thumbnail section (mostly placeholders) */}
      <div className={styles.thumbnailList}>
        {thumbnails.map((img, index) => (
          <button
            key={index}
            className={`${styles.thumbnailButton} ${
              index === activeIndex ? styles.active : ''
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
          >
            {index === 0 && imageUrl ? (
              <img src={imageUrl} alt="thumbnail" className={styles.thumbnailImage} />
            ) : (
              <span className={styles.thumbnailPlaceholder}>?</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
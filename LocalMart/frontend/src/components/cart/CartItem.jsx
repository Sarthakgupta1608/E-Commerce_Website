// src/components/cart/CartItem.jsx
import React from 'react';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import styles from './CartItem.module.css';

export default function CartItem({ item, onRemove, disabled }) {
  return (
    <div className={styles.cartItem}>
      <div className={styles.productInfo}>
        <div className={styles.imageWrapper}>
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
          ) : (
            <Package width={24} height={24} />
          )}
        </div>
        <div className={styles.details}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.seller}>Sold by: {item.storeName}</span>
          <button 
            className={styles.removeButton} 
            onClick={() => onRemove(item.cartItemId)}
            disabled={disabled} // Disable button while an action is in progress
          >
            <Trash2 width={16} height={16} /> Remove
          </button>
        </div>
      </div>

      <div className={styles.quantitySelector}>
        <button className={styles.quantityButton} aria-label="Decrease quantity" disabled>
          <Minus width={16} height={16} />
        </button>
        <span className={styles.quantityValue}>{item.quantity}</span>
        <button className={styles.quantityButton} aria-label="Increase quantity" disabled>
          <Plus width={16} height={16} />
        </button>
      </div>

      <div className={styles.price}>
        ${(item.price * item.quantity).toFixed(2)}
        {item.quantity > 1 && (
          <span className={styles.unitPrice}>(${item.price.toFixed(2)} each)</span>
        )}
      </div>
    </div>
  );
}
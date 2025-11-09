// src/components/cart/CartSummary.jsx
import React from 'react';
import styles from './CartSummary.module.css';

export default function CartSummary({ subtotal, onCheckout }) {
  const shipping = subtotal > 50 ? 0.00 : 4.99;
  const total = subtotal + shipping;

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>
      <div className={styles.costList}>
        <div className={styles.costItem}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.costItem}>
          <span>Shipping (Est.)</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className={styles.costItem}>
          <span>Taxes</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className={styles.total}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button onClick={onCheckout} className={styles.checkoutButton}>
        Proceed to Checkout
      </button>
    </aside>
  );
}
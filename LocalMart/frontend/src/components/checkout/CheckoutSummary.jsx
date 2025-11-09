// src/components/checkout/CheckoutSummary.jsx
import React from 'react';
import { Package } from 'lucide-react';
import styles from './CheckoutSummary.module.css';

export default function CheckoutSummary({ items, subtotal, onPlaceOrder, isLoading }) {
  const shipping = subtotal > 50 ? 0.00 : 4.99;
  const total = subtotal + shipping;

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>
      
      <div className={styles.itemList}>
        {items.map(item => (
          <div key={item.cartItemId} className={styles.item}>
            <div className={styles.imageWrapper}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} />
              ) : (
                <Package width={20} height={20} />
              )}
              <span className={styles.itemQuantity}>{item.quantity}</span>
            </div>
            <div className={styles.itemDetails}>
              <span className={styles.itemName}>{item.name}</span>
            </div>
            <span className={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.costList}>
        <div className={styles.costItem}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.costItem}>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className={styles.costItem}>
          <span>Taxes</span>
          <span>$0.00</span>
        </div>
      </div>
      
      <div className={styles.total}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <button 
        className={styles.placeOrderButton} 
        onClick={onPlaceOrder}
        disabled={isLoading}
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </aside>
  );
}
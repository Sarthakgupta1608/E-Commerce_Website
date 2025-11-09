// src/components/checkout/ShippingForm.jsx
import React from 'react';
import formStyles from '../../styles/forms.module.css';
import styles from './ShippingForm.module.css';

export default function ShippingForm({ address, onAddressChange }) {
  return (
    <div className={styles.shippingForm}>
      <h2 className={styles.title}>Shipping Address</h2>
      {/* We use a simple form, but state is managed by the parent */}
      <div className={formStyles.form}>
        <div className={formStyles.formGroup}>
          <label htmlFor="address" className={formStyles.label}>Street Address</label>
          <input 
            type="text" 
            id="address" 
            className={formStyles.input} 
            placeholder="123 Main Street, Anytown, ST 12345" 
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            required
          />
        </div>
        {/* We can add more fields like city, state, zip later */}
      </div>
    </div>
  );
}
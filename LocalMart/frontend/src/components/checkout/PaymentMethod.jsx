// src/components/checkout/PaymentMethod.jsx
import React from 'react';
import { CreditCard, Landmark, ShieldCheck } from 'lucide-react';
import formStyles from '../../styles/forms.module.css';
import styles from './PaymentMethod.module.css';

export default function PaymentMethod() {
  return (
    <div className={styles.payment}>
      <h2 className={styles.title}>Payment Method</h2>
      <div className={styles.selection}>
        <div className={`${styles.option} ${styles.active}`}>
          <CreditCard width={20} height={20} />
          <span>Credit Card</span>
        </div>
        <div className={styles.option}>
          <Landmark width={20} height={20} />
          <span>Bank Transfer</span>
        </div>
        <div className={styles.option}>
          <img src="https://www.paypalobjects.com/images/shared/paypal-logo-129x32.svg" alt="PayPal" height={20} />
        </div>
      </div>

      <form className={formStyles.form}>
        <div className={formStyles.formGroup}>
          <label htmlFor="cardName" className={formStyles.label}>Name on Card</label>
          <input type="text" id="cardName" className={formStyles.input} placeholder="Jayesh Saini" />
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="cardNumber" className={formStyles.label}>Card Number</label>
          <input type="text" id="cardNumber" className={formStyles.input} placeholder="1234 5678 9012 3456" />
        </div>
        <div className={styles.grid}>
          <div className={formStyles.formGroup}>
            <label htmlFor="expiry" className={formStyles.label}>Expiry Date</label>
            <input type="text" id="expiry" className={formStyles.input} placeholder="MM / YY" />
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="cvc" className={formStyles.label}>CVC</label>
            <input type="text" id="cvc" className={formStyles.input} placeholder="123" />
          </div>
        </div>
        <p className={styles.secureNote}>
          <ShieldCheck width={16} height={16} /> All transactions are secure and encrypted.
        </p>
      </form>
    </div>
  );
}
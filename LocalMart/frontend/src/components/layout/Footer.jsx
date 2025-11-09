// src/components/layout/Footer.jsx
import React from 'react';
import { Store } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.aboutSection}>
            <div className={styles.logoGroup}>
              <div className={styles.logoIcon}>
                <Store width={24} height={24} />
              </div>
              <span className={styles.logoText}>LocalMart</span>
            </div>
            <p className={styles.description}>
              Empowering local businesses and connecting communities through seamless online shopping.
            </p>
          </div>

          <div>
            <h4 className={styles.heading}>Quick Links</h4>
            <div className={styles.linkList}>
              {['About Us', 'How It Works', 'Become a Seller', 'Contact'].map((link) => (
                <a key={link} href="#" className={styles.link}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={styles.heading}>Support</h4>
            <div className={styles.linkList}>
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'FAQs'].map((link) => (
                <a key={link} href="#" className={styles.link}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={styles.heading}>Newsletter</h4>
            <p className={styles.description}>Get the latest deals and updates</p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email"
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterButton}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; 2025 LocalMart. All rights reserved. Made with ❤️ for local communities.</p>
        </div>
      </div>
    </footer>
  );
}
// src/components/home/Features.jsx
import React from 'react';
import { Store, Package, TrendingUp, Users } from 'lucide-react';
import styles from './Features.module.css';

const features = [
  { icon: Store, title: 'Local Sellers', desc: 'Support your community businesses' },
  { icon: Package, title: 'Fast Delivery', desc: 'Quick shipping from nearby stores' },
  { icon: TrendingUp, title: 'Best Deals', desc: 'Competitive prices and offers' },
  { icon: Users, title: 'Trusted Platform', desc: 'Secure and reliable marketplace' }
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Why Choose Us</h2>
        <div className={styles.grid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconWrapper}>
                <feature.icon className={styles.icon} />
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
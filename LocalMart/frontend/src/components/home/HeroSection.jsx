// src/components/home/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Star, Package } from 'lucide-react';
import styles from './HeroSection.module.css';

const API_URL = 'http://localhost:8080/api/products';

export default function HeroSection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // 2. Fetch products
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(API_URL);
        // 3. Take the first 2 as "featured"
        setFeaturedProducts(response.data.slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      }
    };

    fetchFeatured();
  }, []); // Runs once on mount

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Content */}
          <div className={`${styles.leftContent} fadeIn`}>
            <span className={`${styles.badge} pulse`}>🎉 New Platform Launch</span>
            <h1 className={styles.heading}>
              Shop Local,
              <span className={styles.headingGradient}>Support Community</span>
            </h1>
            <p className={styles.subheading}>
              Discover amazing products from local sellers in your area. Fresh, authentic, and delivered with care.
            </p>
            <div className={styles.buttonGroup}>
              <Link to="/products" className={styles.primaryButton}>
                <span>Start Shopping</span>
                <ChevronRight width={20} height={20} />
              </Link>
              <Link to="/register" className={styles.secondaryButton}>Become a Seller</Link>
            </div>
            <div className={styles.statsGroup}>
              {/* Note: This is still static data, which is fine for now */}
              <div className={styles.statItem}>
                <div className={styles.statValue}>500+</div>
                <div className={styles.statLabel}>Local Sellers</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>10K+</div>
                <div className={styles.statLabel}>Products</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>25K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Animated Card */}
          <div className={styles.rightContent}>
            <div className={styles.cardBlur}></div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Featured Products</h3>
                <Heart className={styles.cardHeartIcon} />
              </div>
              
              {/* 4. Map over real featured products */}
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Link 
                    key={product.productId} 
                    to={`/products/${product.productId}`} 
                    className={styles.productItemLink}
                  >
                    <div className={styles.productItem}>
                      <div className={styles.productImage}>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <Package width={32} height={32} />
                        )}
                      </div>
                      <div className={styles.productDetails}>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productSeller}>{product.storeName}</div>
                        <div className={styles.productRating}>
                          {/* Rating is still mock data for now */}
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              width={12}
                              height={12}
                              className={i < 4 ? styles.starFilled : styles.starEmpty}
                            />
                          ))}
                        </div>
                      </div>
                      <div className={styles.productPrice}>${product.price.toFixed(2)}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className={styles.noProducts}>Loading featured products...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
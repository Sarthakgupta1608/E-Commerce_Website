// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductGallery from '../components/products/ProductGallery';
import ProductInfo from '../components/products/ProductInfo';
import RelatedProducts from '../components/common/RelatedProducts';
import styles from './ProductDetailPage.module.css';

const API_URL = 'http://localhost:8080/api/products';

export default function ProductDetailPage() {
  const { id } = useParams(); // Get the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the single product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]); // Re-run if the ID in the URL changes

  // 3. Handle loading and error states
  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.page}>
          <div className={styles.message}>Loading product...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className={styles.page}>
          <div className={styles.errorMessage}>{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  // This will catch if the API returns not found
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  // 4. Render the page with real data
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.galleryColumn}>
              <ProductGallery 
                imageUrl={product.imageUrl} 
                productName={product.name} 
              />
            </div>
            <div className={styles.infoColumn}>
              <ProductInfo product={product} />
            </div>
          </div>
          
          <RelatedProducts currentProductId={product.productId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
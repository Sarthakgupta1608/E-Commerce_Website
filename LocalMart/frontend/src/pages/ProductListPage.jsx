// src/pages/ProductListPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductGrid from '../components/products/ProductGrid';
import { SlidersHorizontal } from 'lucide-react';
import styles from './ProductListPage.module.css';

// 2. Define the API URL
const API_URL = 'http://localhost:8080/api/products';
// We'll hard-code categories for the filter for now
const allCategories = ['Electronics', 'Food', 'Homeware', 'Fashion'];
const MAX_PRICE = 200;

export default function ProductListPage() {
  const [allProducts, setAllProducts] = useState([]); // 3. State for real products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState(MAX_PRICE);
  const [selectedRating, setSelectedRating] = useState(null);

  // 4. Fetch data from the API when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        setAllProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []); // Empty array means this runs once on mount

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRating((prev) => (prev === rating ? null : rating));
  };
  
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPrice(MAX_PRICE);
    setSelectedRating(null);
  };

  // 5. This filter logic now runs on the real data
const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      // Price Filter
      if (product.price > price) {
        return false;
      }
      // Rating Filter (still mock, but logic is here)
      // if (selectedRating && product.rating < selectedRating) {
      //   return false;
      // }
      return true;
    });
  }, [allProducts, selectedCategories, price, selectedRating]);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.titleWrapper}>
            <SlidersHorizontal className={styles.titleIcon} />
            <h1 className={styles.title}>All Products</h1>
          </div>
          
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.contentWrapper}>
            <FilterSidebar 
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              price={price}
              onPriceChange={setPrice}
              selectedRating={selectedRating}
              onRatingChange={handleRatingChange}
              onClearFilters={handleClearFilters}
            />
            {loading ? (
              <div className={styles.loadingMessage}>Loading products...</div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
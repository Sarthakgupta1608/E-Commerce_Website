// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductGrid from '../components/products/ProductGrid';
import styles from './SearchPage.module.css';

const API_URL = 'http://localhost:8080/api/products/search';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get query from URL
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data when the query changes
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return; // Do nothing if query is empty
    }

    const fetchSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        // 3. Call the backend search API
        const response = await axios.get(`${API_URL}?q=${encodeURIComponent(query)}`);
        setSearchResults(response.data);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchSearch();
  }, [query]); // Re-run this effect every time the query changes

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Search results for: <span className={styles.query}>"{query}"</span>
          </h1>
          <p className={styles.count}>
            Found {searchResults.length} matching products.
          </p>

          {loading ? (
            <p className={styles.loading}>Loading results...</p>
          ) : error ? (
            <p className={styles.noResults}>{error}</p>
          ) : searchResults.length > 0 ? (
            <ProductGrid products={searchResults} />
          ) : (
            <p className={styles.noResults}>
              We couldn't find any products matching your search. Try a different term!
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
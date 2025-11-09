// src/pages/SellerListPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import hooks and axios
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
// 4. We will create this component next
// import SellerList from '../components/sellers/SellerList'; 

// 2. Define the API endpoint for your sellers
const API_URL = 'http://localhost:8080/api/sellers';

export default function SellerListPage() {
  // 3. Set up state for loading, data, and errors
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. Fetch data when the component mounts
  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        setSellers(response.data);
      } catch (err) {
        setError('Failed to fetch sellers. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchSellers();
  }, []); // Empty array means this runs once on mount

  // 5. Helper function to render the page content
  const renderContent = () => {
    if (loading) {
      return (
        <p style={{ color: 'var(--text-secondary)' }}>
          Loading sellers...
        </p>
      );
    }

    if (error) {
      return <p style={{ color: 'var(--text-danger)' }}>{error}</p>;
    }

    if (sellers.length > 0) {
      // **TEMPORARY TEST**: Display raw JSON to prove it works
      // We will replace this with the <SellerList /> component next
      return (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--text-primary)' }}>
            Data successfully fetched from H2:
          </h3>
          <pre style={{ 
            background: '#222', 
            color: '#afa', 
            padding: '1rem', 
            borderRadius: '8px' 
          }}>
            {JSON.stringify(sellers, null, 2)}
          </pre>
        </div>
      );
      
      // **FINAL VERSION** (Once we build SellerList):
      // return <SellerList sellers={sellers} />;
    }

    return (
      <p style={{ color: 'var(--text-secondary)' }}>
        No sellers have registered yet.
      </p>
    );
  };

  return (
    <>
      <Header />
      <main style={{ padding: '8rem 2rem 2rem', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Browse All Sellers</h1>
        {renderContent()} {/* 6. Render the content based on state */}
      </main>
      <Footer />
    </>
  );
}
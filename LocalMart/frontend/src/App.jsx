// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import SellerListPage from './pages/SellerListPage';
import SearchPage from './pages/SearchPage';

// Import our new route protectors
import CustomerRoute from './components/auth/CustomerRoute';
import SellerRoute from './components/auth/SellerRoute';

// Import Seller Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import SellerDashboardPage from './pages/dashboard/SellerDashboardPage';
import SellerProductsPage from './pages/dashboard/SellerProductsPage';
import SellerOrdersPage from './pages/dashboard/SellerOrdersPage';

function App() {
  return (
    <Routes>
      {/* --- Public Routes (Everyone can see) --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/sellers" element={<SellerListPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* --- Customer Protected Routes --- */}
      <Route element={<CustomerRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* We can add more customer-only routes here, like /my-orders */}
      </Route>

      {/* --- Seller Protected Routes --- */}
      <Route element={<SellerRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<SellerDashboardPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
        </Route>
      </Route>
      
    </Routes>
  );
}

export default App;
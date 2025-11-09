// src/components/auth/SellerRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function SellerRoute() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role !== 'ROLE_SELLER') {
    // If logged in but NOT a seller (e.g., a customer), redirect to profile
    return <Navigate to="/profile" replace />;
  }

  // If logged in AND a seller, show the page
  return <Outlet />;
}
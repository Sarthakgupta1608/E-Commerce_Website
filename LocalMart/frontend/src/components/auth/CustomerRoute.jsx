// src/components/auth/CustomerRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function CustomerRoute() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role !== 'ROLE_CUSTOMER') {
    // If logged in but NOT a customer (e.g., a seller), redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in AND a customer, show the page
  return <Outlet />;
}
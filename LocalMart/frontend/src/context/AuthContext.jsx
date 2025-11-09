// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:8080/api/cart';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // --- NEW CART STATE ---
  const [cartItems, setCartItems] = useState([]);
  // ----------------------

  const navigate = useNavigate();

  // --- NEW FUNCTION: FETCH CART ---
  const fetchCart = async () => {
    if (token && role === 'ROLE_CUSTOMER') {
      try {
        const headers = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.get(API_URL, headers);
        setCartItems(response.data.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };
  // ------------------------------

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedRole && storedUser) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      
      // --- FETCH CART ON INITIAL LOAD ---
      if (storedRole === 'ROLE_CUSTOMER') {
        fetchCart();
      }
      // ---------------------------------
    }
  }, []); // Note: We removed [token, role] to stop it from re-running unnecessarily

  const login = (newToken, newRole, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
    setIsAuthenticated(true);

    if (newRole === 'ROLE_SELLER') {
      navigate('/dashboard');
    } else {
      navigate('/profile');
      fetchCart(); // Fetch cart *after* logging in as a customer
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
    setCartItems([]); // <-- Clear cart on logout
    navigate('/');
  };

  const value = {
    token,
    role,
    user,
    isAuthenticated,
    cartItems,   // <-- Provide cart items
    fetchCart,   // <-- Provide the fetch function
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
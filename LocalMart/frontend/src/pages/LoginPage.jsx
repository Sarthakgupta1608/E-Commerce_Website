// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/layout/AuthLayout';
import formStyles from '../styles/forms.module.css';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080/api/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth(); // Get the login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = { email, password };
      const response = await axios.post(`${API_URL}/login`, requestData);
      
      // 1. GET ALL THREE PIECES OF DATA
      const { token, role, user } = response.data;
      
      // 2. PASS THEM TO OUR LOGIN FUNCTION
      login(token, role, user);

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  // ... (return JSX is unchanged) ...
  return (
    <AuthLayout title="Welcome Back">
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.formGroup}>
          <label htmlFor="email" className={formStyles.label}>Email</label>
          <input 
            type="email" 
            id="email" 
            className={formStyles.input} 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className={formStyles.formGroup}>
          <label htmlFor="password" className={formStyles.label}>Password</label>
          <input 
            type="password" 
            id="password" 
            className={formStyles.input} 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {error && <div style={{color: 'red', textAlign: 'center'}}>{error}</div>}
        
        <button type="submit" className={formStyles.button} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <p className={formStyles.altAction}>
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
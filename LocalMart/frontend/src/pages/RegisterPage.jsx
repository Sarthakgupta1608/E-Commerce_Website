// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import AuthLayout from '../components/layout/AuthLayout';
import formStyles from '../styles/forms.module.css';
import styles from './RegisterPage.module.css';

// Define our backend API URL
const API_URL = 'http://localhost:8080/api/auth';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('customer');
  const navigate = useNavigate(); // To redirect on success

  // State for all form fields
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: ''
  });

  // State for loading and messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // A single handler to update our form data state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the form from refreshing the page
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (accountType === 'customer') {
        // --- Register Customer ---
        const requestData = {
          name: formData.ownerName, // Form calls it 'ownerName', API needs 'name'
          email: formData.email,
          password: formData.password
        };
        response = await axios.post(`${API_URL}/register/customer`, requestData);
        
      } else {
        // --- Register Seller ---
        const requestData = {
          storeName: formData.storeName,
          ownerName: formData.ownerName,
          email: formData.email,
          password: formData.password
        };
        response = await axios.post(`${API_URL}/register/seller`, requestData);
      }

      // Handle Success
      setSuccess(response.data);
      setLoading(false);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Handle Error
      setLoading(false);
      // Get the error message from the backend's response
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <AuthLayout title="Create Your Account">
      {/* --- Updated form tag --- */}
      <form className={formStyles.form} onSubmit={handleSubmit}>
        
        <div className={styles.toggle}>
          <button 
            type="button"
            className={`${styles.toggleButton} ${accountType === 'customer' ? styles.active : ''}`}
            onClick={() => setAccountType('customer')}
          >
            I'm a Customer
          </button>
          <button 
            type="button"
            className={`${styles.toggleButton} ${accountType === 'seller' ? styles.active : ''}`}
            onClick={() => setAccountType('seller')}
          >
            I'm a Seller
          </button>
        </div>

        {accountType === 'seller' && (
          <div className={formStyles.formGroup}>
            <label htmlFor="storeName" className={formStyles.label}>Store Name</label>
            <input 
              type="text" 
              id="storeName" 
              className={formStyles.input} 
              placeholder="e.g. Artisan Corner" 
              value={formData.storeName}
              onChange={handleChange}
              required 
            />
          </div>
        )}

        <div className={formStyles.formGroup}>
          <label htmlFor="ownerName" className={formStyles.label}>
            {accountType === 'customer' ? 'Full Name' : 'Owner Name'}
          </label>
          <input 
            type="text" 
            id="ownerName" // Changed from 'name' to 'ownerName' to match state
            className={formStyles.input} 
            placeholder="e.g. Jayesh Saini"
            value={formData.ownerName}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className={formStyles.formGroup}>
          <label htmlFor="email" className={formStyles.label}>Email</label>
          <input 
            type="email" 
            id="email" 
            className={formStyles.input} 
            placeholder="you@example.com" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className={formStyles.formGroup}>
          <label htmlFor="password" className={formStyles.label}>Password</label>
          <input 
            type="password" 
            id="password" 
            className={formStyles.input} 
            placeholder="Minimum 8 characters" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        {/* --- Display Success or Error Messages --- */}
        {success && <div className={styles.messageSuccess}>{success}</div>}
        {error && <div className={styles.messageError}>{error}</div>}
        
        <button type="submit" className={formStyles.button} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className={formStyles.altAction}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
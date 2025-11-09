// src/components/profile/AccountDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import formStyles from '../../styles/forms.module.css';
import styles from './AccountDetails.module.css';

const API_URL = 'http://localhost:8080/api/customer/details';

export default function AccountDetails() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token, user, login } = useAuth(); // Get 'login' to update global user state

  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // 1. Fetch current user details on load
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL, getAuthHeaders());
        setFormData({
            name: response.data.name,
            email: response.data.email,
            shippingAddress: response.data.shippingAddress || '' // Handle null address
        });
      } catch (err) {
        setError("Failed to fetch your details.");
      }
      setLoading(false);
    };

    if (token) {
      fetchDetails();
    }
  }, [token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // 2. Handle the "Save Changes" button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const updateRequest = {
      name: formData.name,
      email: formData.email,
      shippingAddress: formData.shippingAddress
    };

    try {
      const response = await axios.put(API_URL, updateRequest, getAuthHeaders());
      
      // 3. Update the global AuthContext user object
      const updatedUser = {
        ...user,
        name: response.data.name,
        email: response.data.email
      };
      // Re-use the login function to update the global state and localStorage
      login(token, user.role, updatedUser); 
      
      setSuccess("Your details have been updated!");
      setFormData(response.data); // Re-sync form with saved data
      
    } catch (err) {
      setError(err.response?.data || "Failed to update details. Please try again.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.message}>Loading your details...</div>;
  }

  return (
    <div className={styles.details}>
      <h2 className={styles.title}>Account Details</h2>
      
      <form className={formStyles.form} onSubmit={handleSubmit}>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        
        <div className={styles.grid}>
          <div className={formStyles.formGroup}>
            <label htmlFor="name" className={formStyles.label}>Full Name</label>
            <input 
              type="text" 
              id="name" 
              className={formStyles.input} 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="email" className={formStyles.label}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              className={formStyles.input} 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className={formStyles.formGroup}>
          <label htmlFor="shippingAddress" className={formStyles.label}>Default Shipping Address</label>
          <input 
            type="text" 
            id="shippingAddress" 
            className={formStyles.input} 
            value={formData.shippingAddress || ''}
            placeholder="e.g. 123 Main Street"
            onChange={handleChange}
          />
        </div>
        
        <h3 className={styles.subTitle}>Change Password (Not Implemented)</h3>
        
        <div className={formStyles.formGroup}>
          <label htmlFor="oldPassword" className={formStyles.label}>Current Password</label>
          <input type="password" id="oldPassword" className={formStyles.input} placeholder="••••••••" disabled />
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="newPassword" className={formStyles.label}>New Password</label>
          <input type="password" id="newPassword" className={formStyles.input} placeholder="Minimum 8 characters" disabled />
        </div>

        <button type="submit" className={formStyles.button} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
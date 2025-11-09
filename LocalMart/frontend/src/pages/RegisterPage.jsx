// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import AuthLayout from '../components/layout/AuthLayout';

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
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        <div className="flex justify-center rounded-md shadow-sm">
          <button 
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-l-md ${accountType === 'customer' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setAccountType('customer')}
          >
            I'm a Customer
          </button>
          <button 
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-r-md ${accountType === 'seller' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setAccountType('seller')}
          >
            I'm a Seller
          </button>
        </div>

        {accountType === 'seller' && (
          <div className="space-y-2">
            <label htmlFor="storeName" className="text-sm font-medium text-gray-700">Store Name</label>
            <input 
              type="text" 
              id="storeName" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. Artisan Corner" 
              value={formData.storeName}
              onChange={handleChange}
              required 
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
            {accountType === 'customer' ? 'Full Name' : 'Owner Name'}
          </label>
          <input 
            type="text" 
            id="ownerName" // Changed from 'name' to 'ownerName' to match state
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. Jayesh Saini"
            value={formData.ownerName}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Minimum 8 characters" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        {/* --- Display Success or Error Messages --- */}
        {success && <div className="text-green-600 text-center text-sm">{success}</div>}
        {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
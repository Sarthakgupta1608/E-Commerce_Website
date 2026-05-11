// src/components/profile/AccountDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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
    return <div className="text-center p-8">Loading your details...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Account Details</h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {error && <div className="text-red-600 text-center text-sm mb-4">{error}</div>}
        {success && <div className="text-green-600 text-center text-sm mb-4">{success}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="shippingAddress" className="text-sm font-medium text-gray-700">Default Shipping Address</label>
          <input 
            type="text" 
            id="shippingAddress" 
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.shippingAddress || ''}
            placeholder="e.g. 123 Main Street"
            onChange={handleChange}
          />
        </div>
        
        <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-600">Change Password (Not Implemented)</h3>
            <div className="space-y-2 mt-4">
                <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" id="oldPassword" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" placeholder="••••••••" disabled />
            </div>
            <div className="space-y-2 mt-4">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</label>
                <input type="password" id="newPassword" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" placeholder="Minimum 8 characters" disabled />
            </div>
        </div>

        <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
}
// src/components/checkout/ShippingForm.jsx
import React from 'react';

export default function ShippingForm({ address, onAddressChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
      {/* We use a simple form, but state is managed by the parent */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address</label>
          <input 
            type="text" 
            id="address" 
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="123 Main Street, Anytown, ST 12345" 
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            required
          />
        </div>
        {/* We can add more fields like city, state, zip later */}
      </div>
    </div>
  );
}
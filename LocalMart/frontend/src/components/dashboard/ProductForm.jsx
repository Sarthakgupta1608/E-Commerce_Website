// src/components/dashboard/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:8080/api/products';
// We'll hard-code the categories for the seller to choose from
const categories = ['Electronics', 'Food', 'Homeware', 'Fashion'];

export default function ProductForm({ isOpen, onClose, productToEdit, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '' // <-- NEW FIELD
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const isEditMode = productToEdit != null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        stockQuantity: productToEdit.stockQuantity,
        category: productToEdit.category // <-- SET CATEGORY
      });
      setPreview(productToEdit.imageUrl);
    } else {
      // Reset form for "Add New"
      setFormData({ 
        name: '', 
        description: '', 
        price: '', 
        stockQuantity: '', 
        category: '' // <-- RESET CATEGORY
      });
      setPreview(null);
    }
    setSelectedFile(null);
    setError(null);
  }, [productToEdit, isOpen]);

  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity, 10)
    };
    
    // Check if category is selected
    if (!productData.category) {
        setError("Please select a category.");
        setLoading(false);
        return;
    }

    try {
      let savedProduct;
      
      if (isEditMode) {
        // --- UPDATE (PUT) ---
        const response = await axios.put(
          `${API_URL}/${productToEdit.productId}`,
          productData,
          getAuthHeaders()
        );
        savedProduct = response.data;
      } else {
        // --- CREATE (POST) ---
        const response = await axios.post(API_URL, productData, getAuthHeaders());
        savedProduct = response.data;
      }

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedFile);
        const imageResponse = await axios.post(
          `${API_URL}/${savedProduct.productId}/image`,
          imageFormData,
          getAuthHeaders()
        );
        savedProduct = imageResponse.data;
      }

      onSave(savedProduct, isEditMode);
      onClose();

    } catch (err) {
      console.error("Failed to save product:", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Image</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                {preview ? (
                  <img src={preview} alt="Product preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <UploadCloud className="w-12 h-12" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file" className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {selectedFile ? selectedFile.name : 'Click to upload image'}
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</label>
            <input 
              type="text" 
              id="name" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              id="description" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">Price ($)</label>
              <input 
                type="number" 
                id="price" 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                step="0.01"
                placeholder="e.g. 19.99"
                value={formData.price}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stockQuantity" className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <input 
                type="number" 
                id="stockQuantity" 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                step="1"
                placeholder="e.g. 100"
                value={formData.stockQuantity}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
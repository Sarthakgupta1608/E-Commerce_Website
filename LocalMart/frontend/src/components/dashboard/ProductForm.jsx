// src/components/dashboard/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './ProductForm.module.css';
import formStyles from '../../styles/forms.module.css';

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X width={24} height={24} />
          </button>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={formStyles.formGroup}>
            <label className={formStyles.label}>Product Image</label>
            <div className={styles.imageUploadWrapper}>
              <div className={styles.imagePreview}>
                {preview ? (
                  <img src={preview} alt="Product preview" />
                ) : (
                  <UploadCloud width={48} height={48} />
                )}
              </div>
              <input 
                type="file" 
                id="file" 
                accept="image/png, image/jpeg"
                className={styles.fileInput}
                onChange={handleFileChange} 
              />
              <label htmlFor="file" className={styles.fileInputLabel}>
                {selectedFile ? selectedFile.name : 'Click to upload image'}
              </label>
            </div>
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="name" className={formStyles.label}>Product Name</label>
            <input 
              type="text" 
              id="name" 
              className={formStyles.input} 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          
          {/* --- NEW CATEGORY SELECTOR --- */}
          <div className={formStyles.formGroup}>
            <label htmlFor="category" className={formStyles.label}>Category</label>
            <select
              id="category"
              className={formStyles.input}
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
          {/* --------------------------- */}
          
          <div className={formStyles.formGroup}>
            <label htmlFor="description" className={formStyles.label}>Description</label>
            <textarea 
              id="description" 
              className={formStyles.input}
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className={styles.grid}>
            <div className={formStyles.formGroup}>
              <label htmlFor="price" className={formStyles.label}>Price ($)</label>
              <input 
                type="number" 
                id="price" 
                className={formStyles.input} 
                step="0.01"
                placeholder="e.g. 19.99"
                value={formData.price}
                onChange={handleChange}
                required 
              />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="stockQuantity" className={formStyles.label}>Stock Quantity</label>
              <input 
                type="number" 
                id="stockQuantity" 
                className={formStyles.input} 
                step="1"
                placeholder="e.g. 100"
                value={formData.stockQuantity}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={formStyles.button} disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
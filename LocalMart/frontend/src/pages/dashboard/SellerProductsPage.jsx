// src/pages/dashboard/SellerProductsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProductForm from '../../components/dashboard/ProductForm';
import styles from './SellerProductsPage.module.css';

const API_URL = 'http://localhost:8080/api/products';

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null); // null = "Create" mode
  
  const { token } = useAuth();

  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // 1. Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/seller`, getAuthHeaders());
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // 2. Handle saving from the modal
  const handleSaveProduct = (savedProduct, isEdit) => {
    if (isEdit) {
      // Find the product in the list and update it
      setProducts(prev => 
        prev.map(p => (p.productId === savedProduct.productId ? savedProduct : p))
      );
    } else {
      // Add the new product to the list
      setProducts(prev => [...prev, savedProduct]);
    }
  };

  // 3. Handle opening the modal
  const openCreateModal = () => {
    setProductToEdit(null); // Clear any edit state
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product); // Set the product to edit
    setIsModalOpen(true);
  };

  // 4. Handle Delete
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/${productId}`, getAuthHeaders());
        // Remove the product from the state
        setProducts(prev => prev.filter(p => p.productId !== productId));
      } catch (err) {
        setError('Failed to delete product.');
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Products</h1>
          <button className={styles.primaryButton} onClick={openCreateModal}>
            <Plus width={16} height={16} />
            <span>Add New Product</span>
          </button>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search width={18} height={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search products..." />
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tableWrapper}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className={styles.tableMessage}>Loading...</td></tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.productId}>
                    <td>
                      <span className={`${styles.status} ${product.stockQuantity > 0 ? styles.active : styles.outofstock}`}>
                        {product.stockQuantity > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.productCell}>
                        {/* --- SHOW REAL IMAGE (or placeholder) --- */}
                        <div className={styles.productImage}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} />
                          ) : (
                            <Package width={20} height={20} />
                          )}
                        </div>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} units` : <span className={styles.outOfStock}>0 units</span>}
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        {/* --- ADD ONCLICK --- */}
                        <button 
                          className={styles.iconButton} 
                          aria-label="Edit"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit width={16} height={16} />
                        </button>
                        {/* --- ADD ONCLICK --- */}
                        <button 
                          className={`${styles.iconButton} ${styles.danger}`} 
                          aria-label="Delete"
                          onClick={() => handleDeleteProduct(product.productId)}
                        >
                          <Trash2 width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className={styles.tableMessage}>You haven't added any products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onSave={handleSaveProduct}
      />
    </>
  );
}
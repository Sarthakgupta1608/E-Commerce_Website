// src/components/layout/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Store, Search, User, Sun, Moon, LogOut } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext'; // 1. IMPORT USEAUTH
import SearchModal from '../common/SearchModal';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // 2. GET AUTH STATE + NEW CARTITEMS
  const { isAuthenticated, role, logout, cartItems } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const isCustomer = isAuthenticated && role === 'ROLE_CUSTOMER';
  const isSeller = isAuthenticated && role === 'ROLE_SELLER';

  // 3. CALCULATE CART COUNT
  const cartCount = cartItems.length;

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.content}>
            {/* Logo */}
            <Link to="/" className={styles.logoGroup} onClick={closeMobileMenu}>
              <div className={styles.logoIcon}>
                <Store className={styles.logoSvg} />
              </div>
              <span className={styles.logoText}>LocalMart</span>
            </Link>

            {/* Desktop Menu */}
            <div className={styles.desktopMenu}>
              <Link to="/" className={styles.menuLink}> Home </Link>
              <Link to="/products" className={styles.menuLink}> Products </Link>
              <Link to="/sellers" className={styles.menuLink}> Sellers </Link>
            </div>

            {/* Right Actions */}
            <div className={styles.desktopActions}>
              <button 
                className={styles.iconButton} 
                aria-label="Search" 
                onClick={() => setIsSearchOpen(true)}
              >
                <Search width={20} height={20} />
              </button>
              
              <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                {theme === 'light' ? <Moon width={20} height={20} /> : <Sun width={20} height={20} />}
              </button>

              {/* --- DYNAMIC AUTH BUTTONS --- */}
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className={styles.signInButton}> Sign In </Link>
                  <Link to="/register" className={styles.primaryButton}> Sign Up </Link>
                </>
              ) : (
                <>
                  {isCustomer && (
                    <>
                      <Link to="/profile" className={styles.iconButton} aria-label="View profile">
                        <User width={20} height={20} />
                      </Link>
                      {/* --- 4. UPDATE THE CART ICON --- */}
                      <Link to="/cart" className={`${styles.iconButton} ${styles.cartButton}`} aria-label="View cart">
                        <ShoppingCart width={20} height={20} />
                        {cartCount > 0 && (
                          <span className={styles.cartBadge}>{cartCount}</span>
                        )}
                      </Link>
                    </>
                  )}
                  {isSeller && (
                    <Link to="/dashboard" className={styles.iconButton} aria-label="View dashboard">
                      <User width={20} height={20} />
                    </Link>
                  )}
                  <button onClick={logout} className={`${styles.iconButton} ${styles.logoutButton}`} aria-label="Logout">
                    <LogOut width={20} height={20} />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuContent}>
            <button 
              className={styles.mobileLink} 
              style={{textAlign: 'left', fontWeight: '600'}}
              onClick={() => { setIsSearchOpen(true); closeMobileMenu(); }}
            >
              <Search width={18} height={18} style={{display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle'}} />
              Search
            </button>

            <Link to="/" className={styles.mobileLink} onClick={closeMobileMenu}>Home</Link>
            <Link to="/products" className={styles.mobileLink} onClick={closeMobileMenu}>Products</Link>
            <Link to="/sellers" className={styles.mobileLink} onClick={closeMobileMenu}>Sellers</Link>
            
            {/* --- DYNAMIC MOBILE AUTH LINKS --- */}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={styles.signInButtonFull} onClick={closeMobileMenu}> Sign In </Link>
                <Link to="/register" className={styles.primaryButtonFull} onClick={closeMobileMenu}> Sign Up </Link>
              </>
            ) : (
              <>
                {isCustomer && (
                  <>
                    <Link to="/profile" className={styles.mobileLink} onClick={closeMobileMenu}>My Profile</Link>
                    <Link to="/cart" className={styles.mobileLink} onClick={closeMobileMenu}>
                      My Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </>
                )}
                {isSeller && (
                  <Link to="/dashboard" className={styles.mobileLink} onClick={closeMobileMenu}>My Dashboard</Link>
                )}
                <button onClick={() => { logout(); closeMobileMenu(); }} className={styles.mobileLink} style={{textAlign: 'left', color: '#ef4444'}}>
                  <LogOut width={18} height={18} style={{display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle'}} />
                  Logout
                </button>
              </>
            )}
            
            <button onClick={toggleTheme} className={styles.mobileLink} style={{textAlign: 'left'}}>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
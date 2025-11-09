// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import Categories from '../components/home/Categories';
import Features from '../components/home/Features';
import TrendingProducts from '../components/home/TrendingProducts';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <Features />
        <TrendingProducts />
      </main>
      <Footer />
    </div>
  );
}
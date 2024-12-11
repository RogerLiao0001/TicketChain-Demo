// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import './App.css';
import AuthForm from './components/AuthForm';
import Events from './pages/Events';
import Market from './pages/Market';
import Dashboard from './components/Dashboard';

// 新增引入 AdminDashboard
import AdminDashboard from './AdminDashboard';
import CoinStake from './components/CoinStake';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/hw3/auth" />;
  };

  const PublicRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/hw3/dashboard" />;
  };

  const authProps = {
    isAuthenticated,
    setIsAuthenticated
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar {...authProps} />
        <Routes>
          {/* 主頁路由 */}
          <Route path="/hw3" element={
            <PublicRoute>
              <>
                <Hero {...authProps} />
                <Features {...authProps} />
              </>
            </PublicRoute>
          } />

          {/* 登入/註冊路由 */}
          <Route path="/hw3/auth" element={
            <PublicRoute>
              <AuthForm {...authProps} />
            </PublicRoute>
          } />

          {/* Dashboard 路由 */}
          <Route path="/hw3/dashboard" element={
            <ProtectedRoute>
              <Dashboard {...authProps} />
            </ProtectedRoute>
          } />

          {/* 活動頁面 */}
          <Route path="/hw3/events" element={
            <ProtectedRoute>
              <Events {...authProps} />
            </ProtectedRoute>
          } />

          {/* 市場頁面 */}
          <Route path="/hw3/market" element={
            <ProtectedRoute>
              <Market {...authProps} />
            </ProtectedRoute>
          } />

          {/* AdminDashboard 路由 (不顯示在Navbar) */}
          <Route path="/hw3/admin" element={
            <PublicRoute>
              <AdminDashboard {...authProps} />
            </PublicRoute>
          } />

          {/* CoinStake 路由 */}
          <Route path="/hw3/coinstake" element={
            <ProtectedRoute>
              <CoinStake {...authProps} />
            </ProtectedRoute>
          } />

        </Routes>
        <Footer {...authProps} />
      </div>
    </Router>
  );
}

export default App;

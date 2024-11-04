// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 引入 Routes 和 Route
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import './App.css';
import AuthForm from './components/AuthForm';
import Events from './pages/Events';
import Market from './pages/Market';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/hw3" element={
            <>
              <Hero />
              <Features />
            </>
          } />
          <Route path="/hw3/auth" element={<AuthForm />} />
          <Route path="/hw3/events" element={<Events />} />
          <Route path="/hw3/market" element={<Market />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
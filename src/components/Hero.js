// src/components/Hero.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/30 to-pink-600/30 mix-blend-multiply" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            重新定義票務體驗
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          運用區塊鏈技術，打造公平透明的票務生態系統。
          告別黃牛，實現真正的粉絲經濟。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/hw3/auth">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg"
          >
            立即註冊
          </motion.button>
        </Link>
          
          <a href="https://hackmd.io/T_M2_dVdQ8W8M6QOZgRALw?view" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold text-lg"
            >
              了解更多
            </motion.button>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
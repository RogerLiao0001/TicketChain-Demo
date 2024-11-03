// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">TicketChain 票鏈</h1>
      <div className="navbar-buttons">
        <Link to="/auth"><button>登入/註冊</button></Link>
        <Link to="/events"><button>活動列表</button></Link>
        <Link to="/market"><button>NFT市場</button></Link>
        <Link to="/dashboard"><button>用戶中心</button></Link>
        <Link to="/"><button>首頁</button></Link>
      </div>
    </nav>
  );
}

export default Navbar;
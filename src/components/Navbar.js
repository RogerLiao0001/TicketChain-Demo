// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/hw3');
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">TicketChain 票鏈</h1>
      <div className="navbar-buttons">
        {isAuthenticated ? (
          // 已登入狀態
          <>
            <Link to="/hw3/dashboard"><button>用戶中心</button></Link>
            <Link to="/hw3/events"><button>活動列表</button></Link>
            <Link to="/hw3/coinstake"><button>購票投注</button></Link>
            <Link to="/hw3/market"><button>NFT市場</button></Link>
            <Link to="/hw3"><button>首頁</button></Link>
            <button onClick={handleLogout}>登出</button>
          </>
        ) : (
          // 未登入狀態
          <>
            <Link to="/hw3/auth"><button>登入/註冊</button></Link>
            <Link to="/hw3/events"><button>活動列表</button></Link>
            <Link to="/hw3/coinstake"><button>購票投注</button></Link>
            <Link to="/hw3/market"><button>NFT市場</button></Link>
            <Link to="/hw3"><button>首頁</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
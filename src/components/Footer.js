// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer({ isAuthenticated }) {
  return (
    <footer className="footer">
      <div>
        <h4 className="text-lg font-semibold mb-4">平台功能</h4>
        <ul className="space-y-2">
          <li><Link to="/hw3/events"><button>活動列表</button></Link></li>
          <li><Link to="/hw3/market"><button>NFT市場</button></Link></li>
          <li><Link to="/hw3/ranking"><button>投注排名</button></Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-4">用戶中心</h4>
        <ul className="space-y-2">
          {isAuthenticated ? (
            // 已登入狀態
            <>
              <li><Link to="/hw3/dashboard"><button>用戶中心</button></Link></li>
              <li><Link to="/hw3/wallet"><button>我的錢包</button></Link></li>
            </>
          ) : (
            // 未登入狀態
            <li><Link to="/hw3/auth"><button>註冊/登入</button></Link></li>
          )}
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-4">聯絡我們</h4>
        <ul className="space-y-2">
          <li className="text-gray-400">r995022526651@gmail.com</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
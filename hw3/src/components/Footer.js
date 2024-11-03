// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import AuthForm from './AuthForm';

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h4 className="text-lg font-semibold mb-4">平台功能</h4>
        <ul className="space-y-2">
          <li><Link to="/events"><button>活動列表</button></Link></li>
          <li><Link to="/market"><button>NFT市場</button></Link></li>
          <li><Link to="/ranking"><button>投注排名</button></Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-4">用戶中心</h4>
        <ul className="space-y-2">
          <li><Link to="/auth"><button>註冊/登入</button></Link></li>
          <li><Link to="/dashboard"><button>儀表板</button></Link></li>
          <li><Link to="/wallet"><button>我的錢包</button></Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-4">聯絡我們</h4>
        <ul className="space-y-2">
          <li className="text-gray-400">support@ticketchain.com</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
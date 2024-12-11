// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [wonEvents, setWonEvents] = useState([]);
  const [walletAddr, setWalletAddr] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('未登入');
      }
  
      const responseUserData = await axios.get('/api/user-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (responseUserData.data.success) {
        setUserData(responseUserData.data.user);
        setWalletAddr(responseUserData.data.user.walletAddress || '');
      } else {
        throw new Error(responseUserData.data.message);
      }
    } catch (error) {
      console.error('獲取用戶數據錯誤:', error);
      setError(error.message || '無法獲取用戶數據');
      if (error.message === '未登入') {
        navigate('/hw3/auth');
      }
    }
  };

  const fetchWonEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/user-won-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setWonEvents(res.data.wonEvents);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error('取得用戶中選活動錯誤:', error);
      setError(error.message || '無法取得中選活動');
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
      await fetchWonEvents();
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/hw3/auth');
  };

  const handleSaveWalletAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!walletAddr) {
        alert('請輸入錢包地址');
        return;
      }
      const res = await axios.post('/api/save-wallet-address', { walletAddress: walletAddr }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert('錢包地址已儲存');
        await fetchUserData();
      } else {
        alert('儲存失敗:' + res.data.message);
      }
    } catch (error) {
      console.error('保存錢包地址錯誤:', error);
      alert('保存錢包地址失敗:' + (error.message || ''));
    }
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>歡迎回來，{userData?.username}！</h2>
        <div className="user-info">
          <p className="points">目前點數: {userData?.points}</p>
          <button className="refresh-btn" onClick={async () => {await fetchUserData(); await fetchWonEvents();}}>刷新</button>
          <button className="logout-btn" onClick={handleLogout}>登出</button>
        </div>
      </div>

      <div className="won-events">
        <h3>用戶已獲得票券</h3>
        {wonEvents.length > 0 ? (
          <ul>
            {wonEvents.map((ev, i) => (
              <li key={i}>{`活動編號: ${ev.eventId}, 活動名稱: ${ev.eventName}`}</li>
            ))}
          </ul>
        ) : (
          <p>無已獲得票券</p>
        )}
      </div>

      <div className="wallet-address">
        <h4>設定錢包地址</h4>
        <input 
          type="text" 
          placeholder="輸入錢包地址"
          value={walletAddr}
          onChange={(e) => setWalletAddr(e.target.value)}
        />
        <button onClick={handleSaveWalletAddress}>儲存錢包地址</button>
      </div>
    </div>
  );
}

export default Dashboard;

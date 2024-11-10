// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tickets'); // 新增：標籤頁狀態
  const [userTickets, setUserTickets] = useState([]); // 新增：用戶已購買的票券
  const [tickets, setTickets] = useState([
    { 
      id: 1, 
      name: '五月天演唱會門票', 
      price: 100,
      date: '2024-12-25',
      location: '台北小巨蛋',
      description: '五月天 NO FEAR 演唱會'
    },
    { 
      id: 2, 
      name: 'BLACKPINK演唱會門票', 
      price: 200,
      date: '2024-12-31',
      location: '高雄巨蛋',
      description: 'BLACKPINK WORLD TOUR'
    },
    { 
      id: 3, 
      name: '張惠妹演唱會門票', 
      price: 300,
      date: '2025-01-01',
      location: '台中圓滿戶外劇場',
      description: 'aMEI REMIX 演唱會'
    }
  ]);

  const navigate = useNavigate();

  // 獲取用戶數據
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('未登入');
      }

      const response = await axios.get('http://localhost:5000/api/user-data', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserData(response.data.user);
        setUserTickets(response.data.user.tickets || []); // 假設 API 返回用戶的票券
      } else {
        throw new Error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message || '無法獲取用戶數據');
      setLoading(false);
      if (error.message === '未登入') {
        navigate('/hw3/auth');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  // 購票功能
  const handlePurchase = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error('票券不存在');
      }

      if (userData.points < ticket.price) {
        throw new Error('點數不足');
      }

      const response = await axios.post('http://localhost:5000/api/purchase', {
        ticketId,
        price: ticket.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(`購買 ${ticket.name} 成功！`);
        fetchUserData(); // 刷新用戶數據
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      alert(error.message || '購買失敗');
    }
  };

  // 登出功能
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/hw3/auth');
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>歡迎回來，{userData?.username}！</h2>
        <div className="user-info">
          <p className="points">目前點數: {userData?.points}</p>
          <button className="refresh-btn" onClick={fetchUserData}>刷新</button>
          <button className="logout-btn" onClick={handleLogout}>登出</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          可購買票券
        </button>
        <button 
          className={`tab-btn ${activeTab === 'purchased' ? 'active' : ''}`}
          onClick={() => setActiveTab('purchased')}
        >
          已購買票券
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="tickets-container">
          <div className="tickets-grid">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-info">
                  <h4>{ticket.name}</h4>
                  <p className="ticket-date">日期: {ticket.date}</p>
                  <p className="ticket-location">地點: {ticket.location}</p>
                  <p className="ticket-description">{ticket.description}</p>
                  <p className="ticket-price">價格: {ticket.price} 點</p>
                </div>
                <button 
                  className={`purchase-btn ${userData?.points < ticket.price ? 'disabled' : ''}`}
                  onClick={() => handlePurchase(ticket.id)}
                  disabled={userData?.points < ticket.price}
                >
                  {userData?.points < ticket.price ? '點數不足' : '購買'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="purchased-tickets">
          {userTickets.length > 0 ? (
            <div className="tickets-grid">
              {userTickets.map(ticket => (
                <div key={ticket.id} className="ticket-card purchased">
                  <div className="ticket-info">
                    <h4>{ticket.name}</h4>
                    <p className="ticket-date">日期: {ticket.date}</p>
                    <p className="ticket-location">地點: {ticket.location}</p>
                    <p className="ticket-description">{ticket.description}</p>
                    <p className="purchase-date">購買日期: {ticket.purchaseDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tickets">
              <p>尚未購買任何票券</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
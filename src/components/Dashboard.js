import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tickets');
  const [userTickets, setUserTickets] = useState([]);
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

      const responseUserData = await axios.get('/api/user-data', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (responseUserData.data.success) {
        setUserData(responseUserData.data.user);
        // 确保tickets数组存在
        const userTicketsData = responseUserData.data.user.tickets || [];
        // 将购买的票券与票券详情合并
        const ticketsWithDetails = userTicketsData.map(userTicket => {
          const ticketDetails = tickets.find(t => t.id === userTicket.ticketId) || {};
          return {
            ...ticketDetails,
            ...userTicket,
            purchaseDate: new Date(userTicket.purchaseDate).toLocaleDateString()
          };
        });
        setUserTickets(ticketsWithDetails);
      } else {
        throw new Error(responseUserData.data.message);
      }
    } catch (error) {
      console.error('获取用户数据错误:', error);
      setError(error.message || '無法獲取用戶數據');
      if (error.message === '未登入') {
        navigate('/hw3/auth');
      }
    } finally {
      setLoading(false);
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

      const responsePurchase = await axios.post('/api/purchase', {
        ticketId,
        price: ticket.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (responsePurchase.data.success) {
        alert(`購買 ${ticket.name} 成功！`);
        await fetchUserData(); // 等待数据刷新完成
        setActiveTab('purchased'); // 自动切换到已购买票券页面
      } else {
        throw new Error(responsePurchase.data.message);
      }
    } catch (error) {
      console.error('购买错误:', error);
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
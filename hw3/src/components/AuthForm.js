// src/components/AuthForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthForm() {
  const [isRegister, setIsRegister] = useState(true); // 切換註冊和登入
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dbStatus, setDbStatus] = useState(''); // 資料庫連線狀態
  const navigate = useNavigate();

  // 切換註冊和登入模式
  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  // 測試資料庫連線的功能
  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        const response = await axios.get('/api/test-db');
        setDbStatus(response.data.message); // 顯示資料庫連線狀態
      } catch (error) {
        setDbStatus('資料庫連線失敗');
        console.error('資料庫連線測試失敗:', error);
      }
    };
    testDatabaseConnection();
  }, []);

  // 表單提交處理函數
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/register' : '/api/login';
    try {
      const response = await axios.post(endpoint, { username, password });
      if (response.data && response.data.success) {
        console.log('成功:', response.data);
        navigate('/hw3'); // 登入成功後導向
      } else {
        console.error('操作失敗:', response.data.message);
        alert(response.data.message || '操作失敗，請重試');
      }
    } catch (error) {
      console.error('伺服器錯誤:', error);
      alert(error.response?.data?.message || '無法連線至伺服器，請稍後再試');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? '註冊' : '登入'}</h2>
      <p>資料庫狀態: {dbStatus}</p> {/* 顯示資料庫狀態 */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>用戶名：</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密碼：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegister ? '註冊' : '登入'}</button>
      </form>
      <button onClick={toggleForm}>
        {isRegister ? '已有帳號？點擊登入' : '沒有帳號？點擊註冊'}
      </button>
    </div>
  );
}

export default AuthForm;

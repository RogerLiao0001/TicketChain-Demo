// src/components/AuthForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

function AuthForm({ setIsAuthenticated }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const response = await axios.post(`/api/${endpoint}`, {
        username,
        password
      });

      if (response.data.success) {
        if (!isRegister) {
          // 登入成功
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', username);
          setIsAuthenticated(true);
          navigate('/hw3/dashboard');
        } else {
          // 註冊成功
          setIsRegister(false);
          alert('註冊成功，請登入');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || '操作失敗，請重試');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isRegister ? '註冊' : '登入'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="用戶名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">
          {isRegister ? '註冊' : '登入'}
        </button>
        
        <p className="switch-mode" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '已有帳號？點此登入' : '沒有帳號？點此註冊'}
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
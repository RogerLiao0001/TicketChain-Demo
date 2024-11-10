// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // 需要先安裝：npm install cors

const app = express();
const port = process.env.PORT || 5000;

// 調試信息：檢查環境變量
console.log('MongoDB URI:', process.env.MONGODB_URI ? '已設置' : '未設置');

// 中間件
app.use(cors()); // 啟用 CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'hw3/build')));

// 連接 MongoDB
console.log('正在連接到 MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('成功連接到數據庫');
    console.log('數據庫名稱:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('數據庫連接錯誤：', err);
    process.exit(1); // 如果數據庫連接失敗，終止程序
  });

// 數據庫連接事件監聽
mongoose.connection.on('error', (err) => {
  console.error('MongoDB 連接錯誤：', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 連接已斷開');
});

// 用戶模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 測試資料庫連線
app.get('/api/test-db', async (req, res) => {
  try {
    // 先檢查數據庫連接狀態
    if (mongoose.connection.readyState !== 1) {
      throw new Error('數據庫未連接');
    }
    await mongoose.connection.db.admin().ping();
    res.json({ 
      success: true, 
      message: '資料庫連線成功',
      dbStatus: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('資料庫測試失敗:', error);
    res.status(500).json({ 
      success: false, 
      message: '資料庫連線失敗', 
      error: error.message 
    });
  }
});

// 註冊路由
app.post('/api/register', async (req, res) => {
  console.log('收到註冊請求：', req.body);
  const { username, password } = req.body;

  // 輸入驗證
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用戶名和密碼都是必需的'
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用戶已存在'
      });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({
      success: true,
      message: '註冊成功'
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({
      success: false,
      message: '註冊失敗',
      error: error.message
    });
  }
});

// 登入路由
app.post('/api/login', async (req, res) => {
  console.log('收到登入請求：', req.body);
  const { username, password } = req.body;

  // 輸入驗證
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用戶名和密碼都是必需的'
    });
  }

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({
        success: true,
        message: '登入成功'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '用戶名或密碼錯誤'
      });
    }
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({
      success: false,
      message: '登入失敗',
      error: error.message
    });
  }
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('服務器錯誤:', err);
  res.status(500).json({
    success: false,
    message: '服務器內部錯誤',
    error: err.message
  });
});

// 任何未匹配的請求都返回靜態 React 應用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'hw3/build', 'index.html'));
});

// 啟動服務器
app.listen(port, () => {
  console.log(`伺服器運行於端口 ${port}`);
  console.log(`API 測試地址: http://localhost:${port}/api/test-db`);
});
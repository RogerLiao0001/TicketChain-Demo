// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// 中間件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'hw3/build')));

// 連接 MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('成功连接到数据库'))
  .catch((err) => console.error('数据库连接错误：', err));

// 用戶模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 測試資料庫連線
app.get('/api/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ success: true, message: '資料庫連線成功' });
  } catch (error) {
    console.error('資料庫測試失敗:', error);
    res.status(500).json({ success: false, message: '資料庫連線失敗', error });
  }
});

// 註冊路由
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ success: false, message: '用戶已存在' });

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ success: true, message: '註冊成功' });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ success: false, message: '註冊失敗', error });
  }
});

// 登入路由
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, message: '登入成功' });
    } else {
      res.status(400).json({ success: false, message: '用戶名或密碼錯誤' });
    }
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ success: false, message: '登入失敗', error });
  }
});

// 任何未匹配的請求都返回靜態 React 應用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'hw3/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`伺服器運行於端口 ${port}`);
});

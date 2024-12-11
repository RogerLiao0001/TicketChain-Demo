// hw3/backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 登入
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用戶名和密碼都是必需的' });
    }
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, message: '登入成功', token: username, userData: { username: user.username, points: user.points } });
    } else {
      res.status(401).json({ success: false, message: '用戶名或密碼錯誤' });
    }
  } catch (error) {
    console.error('登入錯誤：', error);
    res.status(500).json({ success: false, message: '登入失敗' });
  }
});

// 註冊
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用戶名和密碼都是必需的' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '用戶已存在' });
    }
    const newUser = new User({ username, password, points: 1000 });
    await newUser.save();
    res.json({ success: true, message: '註冊成功' });
  } catch (error) {
    console.error('註冊錯誤：', error);
    res.status(500).json({ success: false, message: '註冊失敗' });
  }
});



module.exports = router;

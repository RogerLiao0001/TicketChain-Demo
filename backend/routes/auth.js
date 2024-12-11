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


// 儲存用戶的錢包地址
router.post('/save-wallet-address', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: '未提供認證token' });
      }
  
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ success: false, message: '錢包地址為必填項' });
      }
  
      const user = await User.findOneAndUpdate(
        { username: token },
        { walletAddress },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: '用戶不存在' });
      }
  
      res.json({ success: true, message: '錢包地址已儲存', walletAddress: user.walletAddress });
    } catch (error) {
      console.error('保存錢包地址錯誤:', error);
      res.status(500).json({ success: false, message: '伺服器錯誤' });
    }
  });
  

module.exports = router;

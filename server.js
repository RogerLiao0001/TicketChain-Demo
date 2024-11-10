// server.js

console.log('Current __dirname:', __dirname);
console.log('Current working directory:', process.cwd());
console.log('Current __dirname:', __dirname);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 添加這行

const app = express();

const PORT = process.env.PORT || 5000;


// 中間件設置
app.use(cors());
app.use(express.json());

// 設置靜態文件路徑 - 移到這裡，並修正路徑
//const buildPath = path.join(__dirname, '..', 'build'); // 修正路徑
const buildPath = path.join(__dirname, 'build');
console.log('Current directory:', __dirname);
console.log('Build path:', buildPath);
app.use(express.static(buildPath));



// 在 server.js 中，修改 userSchema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 1000 },
  purchasedTickets: [{
    ticketId: Number,
    name: String,
    date: String,
    location: String,
    description: String,
    purchaseDate: { type: Date, default: Date.now }
  }]
});

// 連接到 MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('成功連接到數據庫');
    console.log('數據庫名稱:', mongoose.connection.db.databaseName);
  })
  .catch((err) => console.error('數據庫連接錯誤：', err));

const User = mongoose.model('User', userSchema);

// 用戶認證中間件
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '未授權' });
  }
  try {
    const user = await User.findOne({ username: token });
    if (!user) {
      return res.status(401).json({ message: '用戶不存在' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '認證失敗' });
  }
};

// API 路由
app.get('/api/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ success: true, message: '資料庫連線成功' });
  } catch (error) {
    console.error('資料庫測試失敗:', error);
    res.status(500).json({ success: false, message: '資料庫連線失敗', error });
  }
});

// 登入路由
app.post('/api/login', async (req, res) => {
  console.log('收到登入請求：', req.body);
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用戶名和密碼都是必需的'
      });
    }

    const user = await User.findOne({ username, password });
    console.log('查找到的用戶：', user);

    if (user) {
      res.json({
        success: true,
        message: '登入成功',
        token: username,
        userData: {
          username: user.username,
          points: user.points
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: '用戶名或密碼錯誤'
      });
    }
  } catch (error) {
    console.error('登入錯誤：', error);
    res.status(500).json({
      success: false,
      message: '登入失敗',
      error: error.message
    });
  }
});

// 註冊路由
app.post('/api/register', async (req, res) => {
  console.log('收到註冊請求：', req.body);
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用戶名和密碼都是必需的'
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用戶已存在'
      });
    }

    const newUser = new User({ 
      username, 
      password,
      points: 1000
    });
    await newUser.save();
    
    console.log('新用戶創建成功：', newUser);
    
    res.json({
      success: true,
      message: '註冊成功'
    });
  } catch (error) {
    console.error('註冊錯誤：', error);
    res.status(500).json({
      success: false,
      message: '註冊失敗',
      error: error.message
    });
  }
});

// 在 server.js 中，修改购票路由
app.post('/api/purchase', authenticateUser, async (req, res) => {
  const { ticketId, price, ticketDetails } = req.body;
  
  try {
    if (req.user.points < price) {
      return res.status(400).json({ success: false, message: '點數不足' });
    }

    // 添加购票记录
    req.user.purchasedTickets.push({
      ticketId,
      name: ticketDetails.name,
      date: ticketDetails.date,
      location: ticketDetails.location,
      description: ticketDetails.description,
      purchaseDate: new Date()
    });

    // 扣除点数
    req.user.points -= price;
    await req.user.save();

    res.json({
      success: true,
      message: '購買成功',
      newPoints: req.user.points
    });
  } catch (error) {
    console.error('購票錯誤：', error);
    res.status(500).json({ success: false, message: '購買失敗' });
  }
});

// 修改获取用户数据路由
app.get('/api/user-data', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供認證token'
      });
    }

    const user = await User.findOne({ username: token });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在'
      });
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        points: user.points,
        purchasedTickets: user.purchasedTickets // 添加这行，返回购票记录
      }
    });
  } catch (error) {
    console.error('獲取用戶數據錯誤：', error);
    res.status(500).json({
      success: false,
      message: '獲取用戶數據失敗'
    });
  }
});

// 處理所有其他請求
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 全局錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('服務器錯誤：', err);
  res.status(500).json({
    success: false,
    message: '服務器內部錯誤',
    error: err.message
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`伺服器運行於端口 ${PORT}`);
});
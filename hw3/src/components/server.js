// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// 连接到MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('成功连接到数据库'))
  .catch((err) => console.error('数据库连接错误：', err));

// 用户模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 注册路由
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password }); // 这里建议对密码进行哈希处理
    await newUser.save();
    res.json({ message: '注册成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password }); // 这里也需要处理密码哈希的比较
    if (user) {
      res.json({ message: '登录成功' });
    } else {
      res.status(400).json({ error: '用户名或密码错误' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '登录失败' });
  }
});

app.listen(port, () => {
  console.log(`服务器正在端口 ${port} 运行`);
});
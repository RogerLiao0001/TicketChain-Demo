// server.js

console.log('Current __dirname:', __dirname);
console.log('Current working directory:', process.cwd());
console.log('Current __dirname:', __dirname);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();

const PORT = process.env.PORT || 5000;

// 中間件設置
app.use(cors());
app.use(express.json());

// 設置靜態文件路徑
const buildPath = path.join(__dirname, 'build');
console.log('Current directory:', __dirname);
console.log('Build path:', buildPath);
app.use(express.static(buildPath));

// 保留原本的 User schema 與購票記錄機制
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
  }],
  stakedEvents: [{
    eventId: Number,
    eventName: String,
    stakedPoints: Number,
    lastUpdate: { type: Date, default: Date.now }
  }]
});


// 連接到 MongoDB
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 50000,socketTimeoutMS: 45000,useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('成功連接到數據庫');
    console.log('數據庫名稱:', mongoose.connection.db.databaseName);
  })
  .catch((err) => console.error('數據庫連接錯誤：', err));

const User = mongoose.model('User', userSchema);

// 用戶認證中間件（原本的）
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

// 保留原本的路由
app.get('/api/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ success: true, message: '資料庫連線成功' });
  } catch (error) {
    console.error('資料庫測試失敗:', error);
    res.status(500).json({ success: false, message: '資料庫連線失敗', error });
  }
});

// 登入路由 (原本)
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

// 註冊路由 (原本)
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

// 購買票券路由 (原本)
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

// 查詢使用者資料路由 (原本)
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
        purchasedTickets: user.purchasedTickets 
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

// 原本其他功能... (請保留你的程式，不要刪除)
// ...假設此處可能有其他API或功能，請全部保留...

// 新增Event模型用於抽選 (新增部分)
const eventSchema = new mongoose.Schema({
  eventId: { type: Number, required: true, unique: true },
  eventName: { type: String, required: true },
  seatsCount: { type: Number, default: 20 },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    points: Number,
    status: { type: String, default: 'pending' }
  }],
  winners: [String] // 新增贏家列表欄位
});

const Event = mongoose.model('Event', eventSchema);


// 新增儲存抽選結果的API (前端抽完後呼叫) (新增部分)
// 範例：在 /api/saveDrawResult 時將 orderNumber 設定給 participant

app.post('/api/saveDrawResult', async (req, res) => {
  const { eventId, result } = req.body;
  try {
    const eid = Number(eventId);
    const eventDoc = await Event.findOne({ eventId: eid }).populate('participants.user');
    if (!eventDoc) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const { addresses, points, orders } = result;
    const seatsCount = eventDoc.seatsCount;

    const crypto = require('crypto');
    const winners = [];

    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i].toLowerCase();
      const order = orders[i]; // 抽選順序
      const participant = eventDoc.participants.find(p => {
        const hash = crypto.createHash('sha256').update(p.user.username).digest('hex');
        const fakeAddr = '0x' + hash.slice(0,40);
        return fakeAddr.toLowerCase() === addr;
      });

      if (participant) {
        participant.orderNumber = order; // 在此設定抽選順序給 participant
        if (order <= seatsCount) {
          participant.status = 'won';
          winners.push(participant.user.username);
        } else {
          participant.status = 'lost';
        }
      }
    }

    await eventDoc.save();
    res.json({ success: true, winners });
  } catch (error) {
    console.error('儲存抽選結果錯誤:', error);
    res.status(500).json({ success: false, message: '儲存失敗' });
  }
});


app.get('/api/getDrawWinners', async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ success: false, message: '缺少 eventId' });

  try {
    const eid = Number(eventId);
    const eventDoc = await Event.findOne({ eventId: eid });
    if (!eventDoc) return res.status(404).json({ success: false, message: 'Event not found' });

    res.json({ success: true, winners: eventDoc.winners || [] });
  } catch (error) {
    console.error('取得贏家列表錯誤:', error);
    res.status(500).json({ success: false, message: '取得贏家失敗' });
  }
});



// 查詢使用者在該場次的結果 (新增部分)
app.get('/api/userResult', async (req, res) => {
  const { eventId, username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: '用戶不存在' });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const participant = event.participants.find(p => p.user.toString() === user._id.toString());
    if (!participant) {
      return res.json({ success: true, result: 'not found' });
    }

    res.json({ success: true, result: participant.status });
  } catch (error) {
    console.error('查詢結果錯誤：', error);
    res.status(500).json({ success: false, message: '查詢失敗' });
  }
});


// 全局錯誤處理中間件 (原本保留)
app.use((err, req, res, next) => {
  console.error('服務器錯誤：', err);
  res.status(500).json({
    success: false,
    message: '服務器內部錯誤',
    error: err.message
  });
});

// 啟動服務器 (原本)
app.listen(PORT, () => {
  console.log(`伺服器運行於端口 ${PORT}`);
});




// 取得用戶投注記錄
app.get('/api/user-stakes', authenticateUser, async (req, res) => {
  try {
    const user = req.user; 
    res.json({ success: true, stakedEvents: user.stakedEvents || [] });
  } catch (error) {
    console.error('取得用戶投注記錄錯誤:', error);
    res.status(500).json({ success: false, message: '取得投注記錄失敗' });
  }
});

// 用戶投注/修改投注
app.post('/api/stake', authenticateUser, async (req, res) => {
  try {
    const { eventId, eventName, amount } = req.body;
    const user = req.user;

    if (!eventId || !eventName || amount == null) {
      return res.status(400).json({ success: false, message: '參數不完整' });
    }

    if (amount < 0) {
      return res.status(400).json({ success: false, message: '投注點數不可小於0' });
    }

    // 檢查用戶目前投注狀況
    const existingStake = user.stakedEvents.find(ev => ev.eventId === eventId);
    const currentStaked = existingStake ? existingStake.stakedPoints : 0;

    let pointsChange = amount - currentStaked; 
    // 如果amount > currentStaked，表示要增加投注，需要扣除pointsChange的點數
    // 如果amount < currentStaked，表示要減少投注，要退回 (currentStaked - amount) 點數給用戶
    // 如果amount = currentStaked，不需變動點數

    // 檢查用戶點數是否足夠(若要增加投注)
    if (pointsChange > 0 && user.points < pointsChange) {
      return res.status(400).json({ success: false, message: '點數不足，無法增加投注' });
    }

    // 更新用戶點數
    user.points = user.points - pointsChange; 

    // 更新或新增 stakedEvents
    if (existingStake) {
      existingStake.stakedPoints = amount;
      existingStake.lastUpdate = new Date();
    } else {
      user.stakedEvents.push({
        eventId,
        eventName,
        stakedPoints: amount
      });
    }

    await user.save();

    res.json({ success: true, message: '投注成功', userPoints: user.points });
  } catch (error) {
    console.error('投注錯誤:', error);
    res.status(500).json({ success: false, message: '投注失敗' });
  }
});

// 假設此為 /api/getParticipantsData 的實作
app.get('/api/getParticipantsData', async (req, res) => {
  console.log('/api/getParticipantsData 被呼叫！');
  
  const { eventId } = req.query;
  if (!eventId) {
    console.error('缺少 eventId 參數');
    return res.status(400).json({ success: false, message: '缺少 eventId' });
  }

  console.log('收到的 eventId:', eventId);

  let eid;
  try {
    eid = Number(eventId);
    if (isNaN(eid)) {
      console.error('eventId 不是一個有效數字:', eventId);
      return res.status(400).json({ success: false, message: 'eventId必須為數字' });
    }
  } catch (numErr) {
    console.error('轉換 eventId 發生錯誤:', numErr);
    return res.status(400).json({ success: false, message: 'eventId轉換失敗' });
  }

  try {
    console.log('開始查詢使用者資料庫...');
    const users = await User.find({ "stakedEvents.eventId": eid });
    console.log('查詢結果 users:', users);

    if (!users || users.length === 0) {
      console.log(`沒有任何使用者對 eventId=${eid} 投注`);
      return res.json({ success: true, addresses: [], points: [] });
    }

    const addresses = [];
    const points = [];
    const crypto = require('crypto');

    users.forEach(user => {
      console.log('處理 user:', user.username);
      const stake = user.stakedEvents.find(s => s.eventId === eid);
      if (stake && stake.stakedPoints > 0) {
        const hash = crypto.createHash('sha256').update(user.username).digest('hex');
        const fakeAddress = '0x' + hash.slice(0,40);
        console.log(`user: ${user.username}, stakePoints: ${stake.stakedPoints}, address: ${fakeAddress}`);
        addresses.push(fakeAddress);
        points.push(stake.stakedPoints);
      } else {
        console.log(`user: ${user.username} 沒有對該event投注或投注點數為0`);
      }
    });

    console.log('最終 addresses:', addresses);
    console.log('最終 points:', points);

    return res.json({ success: true, addresses, points });
  } catch (error) {
    console.error('取得參與者資料錯誤:', error);
    return res.status(500).json({ success: false, message: '取得資料失敗', error: error.message });
  }
});

// 在 server.js 中新增
// 在 server.js 中新增
// server.js中 createEventIfNotExists API修改
app.post('/api/createEventIfNotExists', async (req, res) => {
  const { eventId, eventName, seatsCount } = req.body;
  if (!eventId || !eventName) {
    return res.status(400).json({ success: false, message: '缺少 eventId 或 eventName' });
  }

  const eid = Number(eventId);
  try {
    let eventDoc = await Event.findOne({ eventId: eid });
    if (!eventDoc) {
      eventDoc = new Event({
        eventId: eid,
        eventName,
        seatsCount: seatsCount || 20, // 如果未傳入則用 20
        participants: [],
        winners: []
      });
      await eventDoc.save();
      return res.json({ success: true, message: 'Event 已建立', event: eventDoc });
    } else {
      // 如果已存在就不更新 seatsCount，除非你想同步更新可自行加入邏輯
      return res.json({ success: true, message: 'Event 已存在', event: eventDoc });
    }
  } catch (error) {
    console.error('建立或查詢Event錯誤:', error);
    res.status(500).json({ success: false, message: '建立或查詢Event失敗' });
  }
});


app.post('/api/syncParticipantsFromStakes', async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ success: false, message: '缺少 eventId' });

  const eid = Number(eventId);
  try {
    let eventDoc = await Event.findOne({ eventId: eid });
    if (!eventDoc) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // 找出有對 eventId 投注的用戶
    const users = await User.find({ "stakedEvents.eventId": eid });
    if (!users || users.length === 0) {
      return res.json({ success: true, message: '無用戶對此event投注', event: eventDoc });
    }

    // 將這些用戶以 participants 形式加入 eventDoc，如果尚未加入
    const existingUserIds = eventDoc.participants.map(p => p.user.toString());
    for (const user of users) {
      const stake = user.stakedEvents.find(s => s.eventId === eid && s.stakedPoints > 0);
      if (stake && !existingUserIds.includes(user._id.toString())) {
        eventDoc.participants.push({
          user: user._id,
          points: stake.stakedPoints,
          status: 'pending'
        });
      }
    }

    await eventDoc.save();
    res.json({ success: true, message: '同步參加者完成', event: eventDoc });
  } catch (error) {
    console.error('同步participants錯誤:', error);
    res.status(500).json({ success: false, message: '同步失敗' });
  }
});

// server.js 中
// server.js 中的 /api/getUserDrawResult
app.get('/api/getUserDrawResult', authenticateUser, async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ success: false, message: '缺少 eventId' });

  const eid = Number(eventId);
  try {
    const eventDoc = await Event.findOne({ eventId: eid }).populate('participants.user');
    if (!eventDoc) return res.status(404).json({ success: false, message: 'Event not found' });

    const userId = req.user._id.toString();
    const participant = eventDoc.participants.find(p => p.user._id.toString() === userId);
    if (!participant) {
      // 用戶未參加
      return res.json({ success: true, drawResult: null, message: '您未參加此場次' });
    }

    const seatsCount = eventDoc.seatsCount;
    const totalParticipants = eventDoc.participants.length;

    // 改用 winners 陣列來判斷結果
    const winners = eventDoc.winners || [];
    if (winners.length === 0) {
      // winners 還是空的，表示抽選結果尚未儲存
      return res.json({ success: true, drawResult: { seatsCount, totalParticipants, orderNumber: null, gotTicket: false }, message: '抽選尚未完成' });
    }

    const username = req.user.username;
    const winnerIndex = winners.indexOf(username);

    let gotTicket = false;
    let orderNumber = null;
    if (winnerIndex >= 0) {
      // 找到該用戶於 winners 中的順位
      orderNumber = winnerIndex + 1; // 陣列索引從0開始，順位從1開始
      gotTicket = true;
    } else {
      // 該用戶不在 winners 中，表示落選
      // 若要顯示落選的順位，可根據 points 判斷，但現在不需要
      gotTicket = false;
      // 若想給落選者的順序顯示，可以在 saveDrawResult 時對所有人分配順序，
      // 否則就顯示 gotTicket = false。
    }

    res.json({
      success: true,
      drawResult: {
        seatsCount,
        totalParticipants,
        orderNumber,
        gotTicket
      }
    });

  } catch (error) {
    console.error('取得使用者抽選結果錯誤:', error);
    res.status(500).json({ success: false, message: '取得使用者抽選結果失敗' });
  }
});


// server.js 新增 /api/getEventStakeInfo
app.get('/api/getEventStakeInfo', async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ success: false, message: '缺少 eventId' });

  const eid = Number(eventId);
  try {
    const eventDoc = await Event.findOne({ eventId: eid });
    if (!eventDoc) return res.status(404).json({ success: false, message: 'Event not found' });

    const seatsCount = eventDoc.seatsCount;
    const users = await User.find({ "stakedEvents.eventId": eid });

    // 從 users 中取得 stakedPoints
    let stakes = [];
    for (const user of users) {
      const stake = user.stakedEvents.find(s => s.eventId === eid && s.stakedPoints > 0);
      if (stake) {
        stakes.push({ username: user.username, points: stake.stakedPoints });
      }
    }

    stakes.sort((a,b) => b.points - a.points); // 降序排序
    const participantCount = stakes.length;
    let minimalWinPoints = 0;
    if (participantCount >= seatsCount && seatsCount > 0) {
      minimalWinPoints = stakes[seatsCount - 1].points; 
    } else {
      minimalWinPoints = 0;
    }

    res.json({
      success: true,
      participantCount,
      seatsCount,
      minimalWinPoints
    });
  } catch (error) {
    console.error('取得Event投注狀態錯誤:', error);
    res.status(500).json({ success: false, message: '取得投注狀態失敗' });
  }
});


// 處理所有其他請求 (原本代碼保留)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
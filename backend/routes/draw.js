// hw3/backend/routes/draw.js
const express = require('express');
const router = express.Router();
const { getDrawDataForEvent, saveDrawResult } = require('../services/dbService');
const Event = require('../models/Event');
const User = require('../models/User');

// 提供參加者資料給前端
router.get('/getParticipantsData', async (req, res) => {
  const { eventId } = req.query;
  try {
    const { addresses, points } = await getDrawDataForEvent(eventId);
    res.json({ success: true, addresses, points });
  } catch (error) {
    console.error('取得參與者資料錯誤:', error);
    res.status(500).json({ success: false, message: '取得資料失敗' });
  }
});

// 接收前端傳回的抽選結果
router.post('/saveDrawResult', async (req, res) => {
  const { eventId, result } = req.body;
  try {
    const winners = await saveDrawResult(eventId, result);
    res.json({ success: true, winners });
  } catch (error) {
    console.error('儲存抽選結果錯誤:', error);
    res.status(500).json({ success: false, message: '儲存失敗' });
  }
});

// 查詢使用者在該場次的結果
router.get('/userResult', async (req, res) => {
  const { eventId, username } = req.query;
  try {
    const user = await User.findOne({ username });
    const event = await Event.findById(eventId);
    const participant = event.participants.find(p => p.user.toString() === user._id.toString());
    res.json({ success: true, result: participant ? participant.status : 'not found' });
  } catch (error) {
    console.error('查詢結果錯誤：', error);
    res.status(500).json({ success: false, message: '查詢失敗' });
  }
});



// 獲取用戶中選的活動列表
router.get('/user-won-events', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: '未提供認證token' });
    }

    const user = await User.findOne({ username: token });
    if (!user) {
      return res.status(404).json({ success: false, message: '用戶不存在' });
    }

    const events = await Event.find({ winners: user.username });
    const wonEvents = events.map(event => ({
      eventId: event.eventId,
      eventName: event.eventName,
    }));

    res.json({ success: true, wonEvents });
  } catch (error) {
    console.error('取得用戶中選活動錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

module.exports = router;



module.exports = router;

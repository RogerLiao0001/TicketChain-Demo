// hw3/backend/services/dbService.js
const Event = require('../models/Event');
const User = require('../models/User');

// 從資料庫取得參加該event的 participants，回傳 addresses[] 與 points[]
// 因為現在不用真實地址，可以用 user的username hash成假的地址，或直接用 user.walletAddress 如果有值。
const crypto = require('crypto');

async function getDrawDataForEvent(eventId) {
  const eventDoc = await Event.findById(eventId).populate('participants.user');
  if (!eventDoc) throw new Error('Event not found');

  const addresses = [];
  const points = [];

  eventDoc.participants.forEach(p => {
    // 假設用 username 生成假地址 (20 bytes)
    const hash = crypto.createHash('sha256').update(p.user.username).digest('hex');
    const fakeAddress = '0x' + hash.slice(0,40); 
    addresses.push(fakeAddress);
    points.push(p.points);
  });

  return { addresses, points };
}

// 將抽選結果回寫到資料庫
async function saveDrawResult(eventId, result) {
  const eventDoc = await Event.findById(eventId).populate('participants.user');
  if (!eventDoc) throw new Error('Event not found');

  const { addresses, orders } = result; 
  // 根據 orders 排序判定前 seatsCount 名中選
  const seatsCount = eventDoc.seatsCount;

  // addresses 和 orders 對應相同index
  // 我們當初用 username 產生 fakeAddress，所以要對照回 username
  // 要對照方法：假設仍用相同的hash方法匹配回 user
  for (let i = 0; i < addresses.length; i++) {
    const addr = addresses[i].toLowerCase();
    const order = orders[i];
    // 將addr對應回user
    // 從participants找出對應的user
    // 重建hash對比:
    const participant = eventDoc.participants.find(p => {
      const hash = crypto.createHash('sha256').update(p.user.username).digest('hex');
      const fakeAddr = '0x' + hash.slice(0,40);
      return fakeAddr.toLowerCase() === addr;
    });
    if (participant) {
      participant.status = order <= seatsCount ? 'won' : 'lost';
    }
  }

  await eventDoc.save();
  const winners = eventDoc.participants.filter(p => p.status === 'won').map(p => p.user.username);
  return winners;
}

module.exports = {
  getDrawDataForEvent,
  saveDrawResult
};

// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 1000 },
  walletAddress: { type: String, default: '' }, // 新增欄位
  purchasedTickets: [{
    ticketId: Number,
    name: String,
    date: String,
    location: String,
    description: String,
    purchaseDate: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);

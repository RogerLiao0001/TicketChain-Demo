// hw3/backend/models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  // 僅記錄活動名稱，其他不需要
});

module.exports = mongoose.model('Ticket', ticketSchema);

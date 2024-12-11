// hw3/backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: { type: Number, required: true, unique: true },
    eventName: { type: String, required: true },
    seatsCount: { type: Number, default: 20 },
    participants: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      points: Number,
      status: { type: String, default: 'pending' }
    }],
    winners: [String]
  });
  
  const Event = mongoose.model('Event', eventSchema);
  
// models/Blacklist.js
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
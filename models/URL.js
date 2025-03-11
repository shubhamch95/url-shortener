//monolithic architecture
// models/URL.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { 
    type: String, 
    required: true 
  },
  shortUrl: { 
    type: String, 
    required: true, 
    unique: true 
  },
  visitCount: { 
    type: Number, 
    default: 0 
  },
  visitHistory: [{ 
    type: Date 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('URL', urlSchema);


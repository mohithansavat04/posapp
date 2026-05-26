const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  gstPercentage: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  storeAddress: {
    type: String,
    trim: true
  },
  storePhone: {
    type: String,
    trim: true
  },
  printerName: {
    type: String,
    trim: true
  },
  printerPaperSize: {
    type: String,
    default: '80mm',
    enum: ['58mm', '80mm']
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reference',
    required: true
  },
  type: {
    type: String,
    enum: ['IN', 'OUT', 'INIT'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);

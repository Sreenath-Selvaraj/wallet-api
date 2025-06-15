const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  walletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wallet', 
    required: true 
  },
  amount: { 
    type: mongoose.Types.Decimal128, 
    required: true 
  },
  balance: {
    type: mongoose.Types.Decimal128, 
    required: true 
  },
  description: { 
    type: String 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  type: { 
    type: String, 
    enum: ['CREDIT', 'DEBIT'], 
    required: true 
  },
  transactionId: {
    type: Number,
    unique: true,
    required: true,
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
   }
  });

module.exports = mongoose.model('Transaction', transactionSchema);

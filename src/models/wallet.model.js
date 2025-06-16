const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  balance: { 
    type: mongoose.Types.Decimal128, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  walletId: {
    type: Number, 
    unique: true, 
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);

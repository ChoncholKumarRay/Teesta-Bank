const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bank_account: { type: Number, required: true },
  pin: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  transactions: [String],
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bank_account: { type: String, required: true },
  pin: { type: String, required: true },
  balance: { type: Number, default: 0 },
  transactions: [String],
});

module.exports = mongoose.model('User', userSchema);

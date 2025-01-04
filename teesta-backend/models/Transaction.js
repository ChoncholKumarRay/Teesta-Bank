// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: { type: String, required: true, unique: true },
  sender_id: { type: Number, required: true },
  receiver_id: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  complete: { type: Boolean, default: false },
});

module.exports = mongoose.model('Transaction', transactionSchema);

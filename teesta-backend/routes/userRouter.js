// routes/userRouter.js
const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Endpoint: /api/user/pay-request
router.post('/pay-request', async (req, res) => {
  const { money_receiver, receiver_pin, money_sender, amount } = req.body;

  try {
    // Check if receiver exists and pin is correct
    const receiver = await User.findOne({ bank_account: money_receiver });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    if (receiver.pin !== receiver_pin) {
      return res.status(401).json({ message: 'Invalid pin for receiver' });
    }

    // Check if sender exists
    const sender = await User.findOne({ bank_account: money_sender });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Create a unique transaction ID
    const transactionId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // Create a new transaction
    const newTransaction = new Transaction({
      transaction_id: transactionId,
      sender_id: money_sender,
      receiver_id: money_receiver,
      amount: amount,
      complete: false,
    });

    await newTransaction.save();

    res.status(201).json({ 
      message: 'Transaction initiated successfully', 
      transaction_id: transactionId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error });
  }
});

module.exports = router;

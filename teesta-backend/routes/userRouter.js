// routes/userRouter.js
const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.post("/pay-request", async (req, res) => {
    const { money_receiver, receiver_pin, money_sender, amount } = req.body;
    console.log(req.body);
  
    try {
      const receiverAccount = parseInt(money_receiver, 10);
      const receiverPin = parseInt(receiver_pin, 10);
      const senderAccount = parseInt(money_sender, 10);

      console.log(receiverAccount, receiverPin, senderAccount);
  
      // Fetch receiver
      const receiver = await User.findOne({ bank_account: receiverAccount });
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
  
      // Validate receiver PIN
      if (receiver.pin !== receiverPin) {
        return res.status(401).json({ message: "Invalid receiver PIN" });
      }
  
      // Fetch sender
      const sender = await User.findOne({ bank_account: senderAccount });
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
  
      // Create transaction
    //   const transactionId = Date.now().toString().slice(-10); // Generate a unique transaction ID
    let transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Ensure the transaction ID is unique
    let existingTransaction = await Transaction.findOne({ transactionId });
    while (existingTransaction) {
      transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      existingTransaction = await Transaction.findOne({ transactionId });
    }
  
      const transaction = new Transaction({
        transaction_id: transactionId,
        sender_id: senderAccount,
        receiver_id: receiverAccount,
        amount: parseFloat(amount),
        complete: false,
      });
  
      await transaction.save();
  
      res.status(200).json({
        success: true,
        message: "Transaction created successfully",
        transaction_id: transactionId,
      });
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
    
module.exports = router;

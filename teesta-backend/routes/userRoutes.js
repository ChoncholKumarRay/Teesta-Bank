const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

// API endpoint to initiate  a transaction
router.post("/pay-request", async (req, res) => {
  const { money_receiver, receiver_pin, money_sender, amount } = req.body;
  // console.log(req.body);
  try {
    const receiverAccount = parseInt(money_receiver, 10);
    const receiverPin = parseInt(receiver_pin, 10);
    const senderAccount = parseInt(money_sender, 10);

    // Checking bank account info of the money receiver from database
    const receiver = await User.findOne({ bank_account: receiverAccount });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver.pin !== receiverPin) {
      return res.status(401).json({ message: "Invalid receiver PIN" });
    }

    const sender = await User.findOne({ bank_account: senderAccount });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Creating unique transaction id
    let transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    let existingTransaction = await Transaction.findOne({ transactionId });
    while (existingTransaction) {
      transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      existingTransaction = await Transaction.findOne({ transactionId });
    }

    // New document for Transaction collection
    const transaction = new Transaction({
      transaction_id: transactionId,
      sender_account: senderAccount,
      receiver_account: receiverAccount,
      amount: parseFloat(amount),
      complete: false,
    });

    await transaction.save();

    res.status(200).json({
      success: true,
      message: `You are making payment of ৳${amount} with Teesta bank. Provide your pin to confirm.`,
      transaction_id: transactionId,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({
      message:
        "Server error for creating new transaction for the payment requst",
    });
  }
});

// API endpoint to make payment for a pay-request
router.post("/response-pay-request", async (req, res) => {
  const { transaction_id, sender_account, sender_pin } = req.body;

  const senderAccount = parseInt(sender_account, 10);
  const senderPin = parseInt(sender_pin, 10);
  // console.log(req.body);

  try {
    if (!transaction_id || !sender_account || !sender_pin) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sender = await User.findOne({ bank_account: senderAccount });
    if (!sender) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (sender.pin !== senderPin) {
      return res.status(401).json({ message: "Invalid Bank Account Pin" });
    }

    const transaction = await Transaction.findOne({ transaction_id });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction is invalid" });
    }

    if (transaction.sender_account !== senderAccount) {
      return res.status(401).json({ message: "Invalid User in Pay response" });
    }

    const receiver = await User.findOne({
      bank_account: transaction.receiver_account,
    });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    if (sender.balance < transaction.amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Balance transfer
    sender.balance -= transaction.amount;
    receiver.balance += transaction.amount;
    transaction.complete = true;

    // Ensuring balance change for both account
    await Promise.all([sender.save(), receiver.save(), transaction.save()]);

    res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction_id: transaction_id,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res
      .status(500)
      .json({ message: "Server error for completing the transaction" });
  }
});

// API endpoint for sending money from one account to another
router.post("/send-money", async (req, res) => {
  const { money_sender, sender_pin, money_receiver, amount } = req.body;

  const senderAccount = parseInt(money_sender, 10);
  const receiverAccount = parseInt(money_receiver, 10);
  const senderPin = parseInt(sender_pin, 10);
  const transfer_amount = parseInt(amount, 10);

  try {
    const sender = await User.findOne({ bank_account: senderAccount });
    if (!sender) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (sender.pin !== senderPin) {
      return res.status(401).json({ message: "Invalid Sender PIN" });
    }

    const receiver = await User.findOne({ bank_account: receiverAccount });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    if (sender.balance < transfer_amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Unique Transaction ID
    let transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    let existingTransaction = await Transaction.findOne({ transactionId });
    while (existingTransaction) {
      transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      existingTransaction = await Transaction.findOne({ transactionId });
    }

    // Creating new document for Transaction collection
    const transaction = new Transaction({
      transaction_id: transactionId,
      sender_account: senderAccount,
      receiver_account: receiverAccount,
      amount: transfer_amount,
      complete: false,
    });

    // Balance transfer
    sender.balance -= transfer_amount;
    receiver.balance += transfer_amount;
    transaction.complete = true;

    sender.transactions.push(transactionId);
    receiver.transactions.push(transactionId);

    // Ensuring balance transfer happen for all
    await Promise.all([sender.save(), receiver.save(), transaction.save()]);

    res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction_id: transactionId,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error for sending money" });
  }
});

// API endpoint to check the validity of a transaction id
router.post("/transaction-check", async (req, res) => {
  const { transaction_id } = req.body;

  if (!transaction_id) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    const transaction = await Transaction.findOne({ transaction_id });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.complete) {
      return res.status(200).json({
        success: true,
        message: "Transaction completed successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Transaction isn't completed",
      });
    }
  } catch (error) {
    console.error("Error while checking transaction", error);
    return res
      .status(500)
      .json({ message: "Server error for checking the transaction status" });
  }
});

module.exports = router;

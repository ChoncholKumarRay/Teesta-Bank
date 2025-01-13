# Teesta Bank Service

## Overview

This is an example bank service with minimal front-end for an E-Commerce eco-system, a project of my university web technoloy course. Front-end have dashboard that is only accessed by admin to see overall User collection of the database. Here we implement some api in the backend for seemless payment system of the E-Commerce eco-system.

## Endpoints and Base URLs

### Base URL

- **Local URL**: `http://localhost:5001`
- **Online URL**: `https://teesta-bank.onrender.com`

### Endpoint Overview

The APIs are accessed using the base URL followed by specific routes. For example:

- **Local API**: `http://localhost:5001/api/user/pay-request`
- **Online API**: `https://teesta-bank.onrender.com/api/user/pay-request`

---

# API Documentation: User Routes

## 1. **POST /api/user/pay-request**

### **Description**:

This API endpoint allows a user to initiate a payment request. The request is sent to a receiver’s account, and the user is prompted to enter their PIN for confirmation.

### **Request Body**:

```json
{
  "money_receiver": "123456789",
  "receiver_pin": "1234",
  "money_sender": "987654321",
  "amount": "500"
}
```

- `money_receiver`: The bank account number of the receiver.
- `receiver_pin`: The PIN of the receiver.
- `money_sender`: The bank account number of the sender.
- `amount`: The amount to be sent.

### **Response**:

- **200 OK**:

  ```json
  {
    "success": true,
    "message": "You are making payment of ৳500 with Teesta bank. Provide your pin to confirm.",
    "transaction_id": "TXN167772191234-7324"
  }
  ```

- **400 Bad Request**:

  ```json
  {
    "message": "Invalid request format"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "message": "Receiver not found"
  }
  ```

- **401 Unauthorized**:

  ```json
  {
    "message": "Invalid receiver PIN"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "message": "Sender not found"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "message": "Server error for creating new transaction for the payment requst"
  }
  ```

---

## 2. **POST /api/user/response-pay-request**

### **Description**:

This API endpoint allows the sender to respond to the payment request, confirming the transaction by providing their PIN. Upon successful verification, the transaction will be completed.

### **Request Body**:

```json
{
  "transaction_id": "TXN167772191234-7324",
  "sender_account": "987654321",
  "sender_pin": "1234"
}
```

- `transaction_id`: The unique ID of the transaction to respond to.
- `sender_account`: The bank account number of the sender.
- `sender_pin`: The PIN of the sender to confirm the transaction.

### **Response**:

- **200 OK**:

  ```json
  {
    "success": true,
    "message": "Transaction completed successfully",
    "transaction_id": "TXN167772191234-7324"
  }
  ```

- **400 Bad Request**:

  ```json
  {
    "message": "Missing required fields"
  }
  ```

- **400 Bad Request**:

  ```json
  {
    "message": "Insufficient balance"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "message": "Sender account not found"
  }
  ```

- **401 Unauthorized**:

  ```json
  {
    "message": "Invalid Bank Account Pin"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "message": "Server error for completing the transaction"
  }
  ```

---

## 3. **POST /api/user/send-money**

### **Description**:

This API endpoint allows a user to send money to another user. The sender must confirm the transaction using their PIN, and the transaction is completed once confirmed.

### **Request Body**:

```json
{
  "money_sender": "987654321",
  "sender_pin": "1234",
  "money_receiver": "123456789",
  "amount": "500"
}
```

- `money_sender`: The bank account number of the sender.
- `sender_pin`: The PIN of the sender.
- `money_receiver`: The bank account number of the receiver.
- `amount`: The amount to be transferred.

### **Response**:

- **200 OK**:

  ```json
  {
    "success": true,
    "message": "Transaction completed successfully",
    "transaction_id": "TXN167772191234-7324"
  }
  ```

- **400 Bad Request**:

  ```json
  {
    "message": "Invalid request format or insufficient funds"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "message": "Sender or Receiver account not found"
  }
  ```

- **401 Unauthorized**:

  ```json
  {
    "message": "Invalid Sender PIN"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "message": "Server error for sending money"
  }
  ```

---

## 4. **POST /api/user/transaction-check**

### **Description**:

This API endpoint allows a user to check the status of a transaction using the `transaction_id`. It returns whether the transaction was completed successfully or not.

### **Request Body**:

```json
{
  "transaction_id": "TXN167772191234-7324"
}
```

- `transaction_id`: The unique ID of the transaction to check.

### **Response**:

- **200 OK** (Transaction Completed):

  ```json
  {
    "success": true,
    "message": "Transaction completed successfully"
  }
  ```

- **400 Bad Request** (Transaction Not Completed):

  ```json
  {
    "success": false,
    "message": "Transaction isn't completed"
  }
  ```

- **404 Not Found**:

  ```json
  {
    "message": "Transaction not found"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "message": "Server error for checking the transaction status"
  }
  ```

---

### **Error Codes**:

- **400**: Invalid request or missing required fields.
- **401**: Unauthorized access, typically incorrect PIN or invalid user.
- **404**: The specified resource (user or transaction) was not found.
- **500**: Internal server error, typically caused by issues with the backend database or server.

---

---
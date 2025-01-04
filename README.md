# Teesta Bank Service API Documentation

## Overview
This API provides an interface for managing bank user accounts. Admins can log in using credentials stored in a `.env` file and view bank user details. The data is stored in a MongoDB database.

---

## Base URL
**Local Development**: `http://localhost:5000/api`

---

## Authentication
All protected routes require an admin to log in. Upon successful login, a JSON Web Token (JWT) is issued, which must be included in the `Authorization` header for subsequent requests.

### Authentication Header
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. **Admin Login**
Authenticate the admin using the credentials stored in the backend `.env` file.

- **URL**: `/admin/login`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
	"username": "adminUsername",
	"password": "adminPassword"
  }
  ```
- **Responses**:
  - **200 OK**:
	```json
	{
  	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	}
	```
  - **401 Unauthorized**:
	```json
	{
  	"message": "Invalid username or password"
	}
	```

---

### 2. **Get All Bank Users**
Retrieve all user details (excluding sensitive fields like `pin` and `transactions`).

- **URL**: `/admin/users`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Parameters**: None
- **Responses**:
  - **200 OK**:
	```json
	[
  	{
    	"_id": "63f2b5a45e4f0a7c3a123456",
    	"username": "JohnDoe",
    	"bank_account": "123456789",
    	"balance": 1000.50
  	},
  	{
    	"_id": "63f2b5a45e4f0a7c3a123457",
    	"username": "JaneSmith",
    	"bank_account": "987654321",
    	"balance": 250.00
  	}
	]
	```
  - **401 Unauthorized**:
	```json
	{
  	"message": "Unauthorized: Invalid token or not provided"
	}
	```

---

## Environment Variables
The following environment variables must be configured in a `.env` file for the backend:
- **`ADMIN_USERNAME`**: Admin username.
- **`ADMIN_PASSWORD`**: Admin password.
- **`MONGO_URI`**: MongoDB connection string.
- **`JWT_SECRET`**: Secret key for JWT signing.

---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

console.log("MongoDB URL: ", process.env.MONGO_URL);
console.log("Server Port: ", process.env.PORT);

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

  
const PORT = process.env.PORT || 5001
app.listen(PORT, ()=>console.log(`server is running on port ${PORT}`));
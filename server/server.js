const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Smart Expense Manager Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
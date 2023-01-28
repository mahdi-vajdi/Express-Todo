require("dotenv").config();
const { urlencoded } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDb = require("./config/dbConn");
const { logger } = require("./middleware/logEvents");
const PORT = process.env.PORT;

// Connect to the database
mongoose.set("strictQuery", false);
connectDb();

// Custom logger middleware
app.use(logger);

// Parse urlencoded data
app.use(express.urlencoded({ extended: false }));

// Parse json files in requests
app.use(express.json());

// Handle category related requests
app.use("/api/categories", require("./routes/category"));

// Handle 404 messages
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use((err, req, res) => {
  res.status(422).json({ error: err.message });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

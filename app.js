require("dotenv").config();
const { urlencoded } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDb = require("./config/dbConn");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT;

// Connect to the database
mongoose.set("strictQuery", false);
connectDb();

// Custom logger middleware
app.use(logger);

// cors policy
const whiteList = ["http://localhost:3000", "https://www.google.com"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

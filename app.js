require("dotenv").config();
const express = require("express");
const app = express();
const { urlencoded } = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/dbConn");
const credentials = require("./middleware/credentials");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;

// Connect to the database
mongoose.set("strictQuery", false);
connectDb();

// Custom logger middleware
app.use(logger);

app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Parse urlencoded data
app.use(urlencoded({ extended: false }));

// Parse json files in requests
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
// routes under this middleware will be atuhorized
app.use(verifyJWT);
app.use("/api/categories", require("./routes/category"));
app.use("/api/tasks", require("./routes/task"));

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

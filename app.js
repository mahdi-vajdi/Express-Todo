const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Setup database
mongoose.set("strictQuery", false);
const mongodbUri = "mongodb://127.0.0.1:27017/SimpleTodo";

mongoose
  .connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.use("/api/categories", require("./routes/category"));

app.use((err, req, res) => {
  res.status(422).json({ error: err.message });
});

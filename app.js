const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();

app.use(express.json());

// Setup database
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.use("/api/categories", require("./routes/category"));

app.use((err, req, res) => {
  res.status(422).json({ error: err.message });
});

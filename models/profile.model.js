const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    max: 100,
  },
  lastName: {
    type: String,
    max: 100,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  profileImage: String,
});

module.exports = mongoose.model("Profile", profileSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  detail: String,
  state: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Number,
    default: 0,
  },
  reminderStatus: {
    type: Boolean,
    default: false,
  },
  reminder: {
    type: Number,
    default: 0,
  },
  priority: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);

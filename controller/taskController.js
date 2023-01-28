const Task = require("../model/Task");

const createTask = (req, res) => {
  Task.create(req.body, (err, doc) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(doc);
    }
  });
};

const getAllTasks = (req, res) => {
  Task.find((err, docs) => {
    if (err) {
      res.status(500).json({ error: "Could not fetch the tasks" });
    } else {
      res.status(200).json(docs);
    }
  });
};

const getTask = (req, res) => {
  Task.findById({ _id: req.params.id }, req.body, (err, doc) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(doc);
    }
  });
};

const updateTask = (req, res) => {
  Task.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { returnDocument: "after" },
    (err, doc) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(doc);
      }
    }
  );
};

const deleteTask = (req, res) => {
  Task.findByIdAndDelete({ _id: req.params.id }, (err, doc) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(doc);
    }
  });
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

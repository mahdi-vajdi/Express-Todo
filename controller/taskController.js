const { default: mongoose } = require("mongoose");
const Task = require("../model/Task");

const createTask = async (req, res) => {
  if (!req?.body?.category || !req?.body?.title)
    return res
      .status(400)
      .json({ message: "category id and task title are required." });

  try {
    const result = await Task.create(req.body);
    res
      .status(201)
      .json({ message: "Successfully created the task", task: result });
  } catch (err) {
    res.status(500).json({ message: "Could not create the task", error: err });
  }
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  if (!tasks || tasks.length === 0)
    return res.status(404).json({ message: "There is no tasks" });
  res.status(200).json(tasks);
};

const getTask = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const task = await Task.findById({ _id: req.params.id }, req.body);
  if (!task)
    return res.status(404).json({ message: "No task matches the provided ID" });
  res.status(200).json(task);
};

const updateTask = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const task = await Task.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!task)
    return res.status(404).json({ message: "No task matches the provided ID" });
  res.status(200).json({
    message: "Successfully updated the task",
    task,
  });
};

const deleteTask = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const task = await Task.findByIdAndDelete({ _id: req.params.id });
  if (!task)
    return res.status(404).json({ message: "No task matches the provided ID" });
  res.status(200).json({
    message: "Successfully deleted the task",
    task,
  });
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

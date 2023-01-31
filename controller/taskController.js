const { default: mongoose } = require("mongoose");
const Task = require("../model/Task");

const createTask = async (req, res) => {
  if (!req?.body?.category || !req?.body?.title)
    return res
      .status(400)
      .json({ message: "category id and task title are required." });

  try {
    req.body.username = req.user; // add username property to the object
    const result = await Task.create(req.body);
    res
      .status(201)
      .json({ message: "Successfully created the task", task: result });
  } catch (err) {
    res.status(500).json({ message: "Could not create the task", error: err });
  }
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ username: req.user });
  if (!tasks || tasks.length === 0)
    return res.status(404).json({ message: "There is no tasks" });
  res.status(200).json(tasks);
};

const getTask = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const task = await Task.findOne(
    { _id: req.params.id, username: req.user },
    req.body
  );
  if (!task)
    return res.status(404).json({ message: "No task matches the provided ID" });
  res.status(200).json(task);
};

const getTaskByCategory = async (req, res) => {
  const tasks = await Task.find({ category: req.params.categoryId });
  if (!tasks || tasks.length === 0)
    return res
      .status(404)
      .json({ message: "There is no tasks in this category" });
  return res.status(200).json(tasks);
};

const updateTask = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .json({ message: "The requested ID does not have a correct form" });

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, username: req.user },
    req.body,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
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

  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    username: req.user,
  });
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
  getTaskByCategory,
  createTask,
  updateTask,
  deleteTask,
};

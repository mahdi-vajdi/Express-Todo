const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");

router.get("/", taskController.getAllTasks);

router.get("/:id", taskController.getTask);

router.get("/byCategory/:categoryId", taskController.getTaskByCategory);

router.post("/", taskController.createTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

module.exports = router;

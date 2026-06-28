
const express = require("express");
const { addTask, getTasks, updateTime, updateTask, deleteTask } = require("../Controllers/TaskController");
const { userVerification } = require("../middleware");

const router = express.Router();

router.post('/tasks', userVerification, addTask);
router.get('/tasks', userVerification, getTasks);
router.put('/tasks/:id/time', userVerification, updateTime);
router.put('/tasks/:id', userVerification, updateTask);
router.delete('/tasks/:id', userVerification, deleteTask);

module.exports = router;

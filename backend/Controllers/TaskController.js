
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const getUserId = (req) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        return decoded.id;
    } catch {
        return null;
    }
};

module.exports.addTask = async (req, res, next) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
        const newTask = new Task({ ...req.body, userId });
        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
        next();
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ status: false, message: "Failed to create task" });
    }
};

exports.getTasks = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ status: false, message: "Failed to fetch tasks" });
    }
};

module.exports.updateTime = async (req, res) => {
    const { taskDuration = 0, breakTime = 0 } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found." });
        task.taskDuration = (task.taskDuration || 0) + taskDuration;
        task.breakTime = (task.breakTime || 0) + breakTime;
        await task.save();
        res.status(200).json({ message: "Time updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task." });
    }
};

module.exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: "Task not found." });
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task." });
    }
};

module.exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
};

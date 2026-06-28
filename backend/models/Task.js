
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, "Task name is required"],
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["To Do", "Doing", "Review", "Done", "Pending"],
        default: "To Do",
    },
    kanbanStatus: {
        type: String,
        enum: ["todo", "inprogress", "review", "completed"],
        default: "todo",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium",
    },
    category: {
        type: String,
        enum: ["Work", "Personal", "Study", "Health", "Shopping", "Other"],
        default: "Work",
    },
    dueDate: {
        type: Date,
        default: null,
    },
    tags: {
        type: [String],
        default: [],
    },
    taskDuration: {
        type: Number,
        default: 0,
    },
    breakTime: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    timestamp: { type: String, default: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) }
});

module.exports = mongoose.model("Task", taskSchema);

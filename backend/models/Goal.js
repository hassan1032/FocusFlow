
const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Goal title is required"],
    },
    description: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        enum: ["short-term", "long-term"],
        default: "short-term",
    },
    category: {
        type: String,
        enum: ["Work", "Personal", "Study", "Health", "Finance", "Other"],
        default: "Personal",
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    targetDate: {
        type: Date,
        default: null,
    },
    milestones: [milestoneSchema],
    completed: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model("Goal", goalSchema);


const Goal = require("../models/Goal");
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

exports.createGoal = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
        const goal = new Goal({ ...req.body, userId });
        await goal.save();
        res.status(201).json({ message: "Goal created successfully", goal });
    } catch (error) {
        console.error("Error creating goal:", error);
        res.status(500).json({ message: "Failed to create goal" });
    }
};

exports.getGoals = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
        const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch goals" });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!goal) return res.status(404).json({ message: "Goal not found" });
        res.status(200).json({ message: "Goal updated successfully", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to update goal" });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete goal" });
    }
};

exports.toggleMilestone = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        const milestone = goal.milestones.id(req.params.milestoneId);
        if (!milestone) return res.status(404).json({ message: "Milestone not found" });

        milestone.completed = !milestone.completed;

        const completed = goal.milestones.filter(m => m.completed).length;
        goal.progress = goal.milestones.length > 0
            ? Math.round((completed / goal.milestones.length) * 100)
            : 0;

        await goal.save();
        res.status(200).json({ message: "Milestone updated", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to update milestone" });
    }
};

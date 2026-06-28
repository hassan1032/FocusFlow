
const express = require("express");
const { createGoal, getGoals, updateGoal, deleteGoal, toggleMilestone } = require("../Controllers/GoalController");
const { userVerification } = require("../middleware");

const router = express.Router();

router.post("/", userVerification, createGoal);
router.get("/", userVerification, getGoals);
router.put("/:id", userVerification, updateGoal);
router.delete("/:id", userVerification, deleteGoal);
router.patch("/:id/milestone/:milestoneId", userVerification, toggleMilestone);

module.exports = router;

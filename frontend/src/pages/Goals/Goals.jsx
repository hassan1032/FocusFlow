import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import baseURL from "../../environment";

const CATEGORY_COLORS = {
  Work: "#4F46E5", Personal: "#22C55E", Study: "#F59E0B",
  Health: "#EF4444", Finance: "#0EA5E9", Other: "#7C3AED",
};

const CATEGORY_ICONS = {
  Work: "fa-solid fa-briefcase", Personal: "fa-solid fa-user",
  Study: "fa-solid fa-graduation-cap", Health: "fa-solid fa-heart",
  Finance: "fa-solid fa-chart-line", Other: "fa-solid fa-tag",
};

function GoalModal({ goal, onClose, onSave }) {
  const [form, setForm] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    type: goal?.type || "short-term",
    category: goal?.category || "Personal",
    progress: goal?.progress || 0,
    targetDate: goal?.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : "",
    milestones: goal?.milestones?.map(m => m.title) || [""],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addMilestone = () => set("milestones", [...form.milestones, ""]);
  const removeMilestone = (i) => set("milestones", form.milestones.filter((_, idx) => idx !== i));
  const updateMilestone = (i, v) => {
    const updated = [...form.milestones];
    updated[i] = v;
    set("milestones", updated);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Goal title is required"); return; }
    onSave({
      ...form,
      milestones: form.milestones.filter(Boolean).map(t => ({ title: t })),
      targetDate: form.targetDate || null,
    });
  };

  return (
    <div className="ff-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ff-modal p-6" style={{ maxWidth: 560 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-600 text-gray-800" style={{ fontWeight: 600 }}>
            {goal?._id ? "Edit Goal" : "New Goal"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-times text-gray-500"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Goal Title *</label>
            <input className="ff-input" placeholder="What do you want to achieve?"
              value={form.title} onChange={e => set("title", e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Description</label>
            <textarea className="ff-input resize-none" rows={2} placeholder="Describe your goal..."
              value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Type</label>
              <select className="ff-input" value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="short-term">Short-term</option>
                <option value="long-term">Long-term</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Category</label>
              <select className="ff-input" value={form.category} onChange={e => set("category", e.target.value)}>
                {Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Target Date</label>
              <input type="date" className="ff-input" value={form.targetDate} onChange={e => set("targetDate", e.target.value)} />
            </div>
          </div>

          {/* Progress (for edit only) */}
          {goal?._id && (
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                Progress: {form.progress}%
              </label>
              <input type="range" min={0} max={100} value={form.progress}
                onChange={e => set("progress", Number(e.target.value))}
                className="w-full" style={{ accentColor: "#4F46E5" }} />
            </div>
          )}

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-500 text-gray-700" style={{ fontWeight: 500 }}>Milestones</label>
              <button onClick={addMilestone} className="text-xs text-indigo-600 hover:text-indigo-700 font-500"
                style={{ fontWeight: 500 }}>
                + Add milestone
              </button>
            </div>
            <div className="space-y-2">
              {form.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input className="ff-input flex-1 text-sm py-2"
                    placeholder={`Milestone ${i + 1}`}
                    value={m} onChange={e => updateMilestone(i, e.target.value)} />
                  {form.milestones.length > 1 && (
                    <button onClick={() => removeMilestone(i)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                      <i className="fa-solid fa-times text-gray-400 text-xs"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} className="ff-btn ff-btn-primary flex-1">
            {goal?._id ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete, onToggleMilestone }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[goal.category] || "#4F46E5";
  const daysLeft = goal.targetDate
    ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div layout className="ff-card p-5 animate-slide-up">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + "15" }}>
          <i className={`${CATEGORY_ICONS[goal.category] || "fa-solid fa-bullseye"} text-lg`} style={{ color }}></i>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-600 text-gray-800 text-sm" style={{ fontWeight: 600 }}>{goal.title}</h3>
              {goal.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{goal.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => onEdit(goal)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-pen text-gray-400 text-xs"></i>
              </button>
              <button onClick={() => onDelete(goal._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <i className="fa-solid fa-trash text-gray-400 text-xs hover:text-red-500"></i>
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="ff-badge text-xs" style={{ background: color + "15", color }}>{goal.category}</span>
            <span className="ff-badge ff-badge-gray text-xs">{goal.type === "short-term" ? "Short-term" : "Long-term"}</span>
            {goal.completed && <span className="ff-badge ff-badge-success text-xs">Completed</span>}
            {daysLeft !== null && !goal.completed && (
              <span className={`ff-badge text-xs ${daysLeft <= 0 ? "ff-badge-danger" : daysLeft <= 7 ? "ff-badge-warning" : "ff-badge-gray"}`}>
                {daysLeft <= 0 ? "Overdue" : daysLeft === 1 ? "1 day left" : `${daysLeft} days left`}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs font-600" style={{ color, fontWeight: 600 }}>{goal.progress}%</span>
            </div>
            <div className="ff-progress-bar">
              <div className="ff-progress-fill" style={{ width: `${goal.progress}%`, background: color }}></div>
            </div>
          </div>

          {/* Milestones */}
          {goal.milestones?.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <i className={`fa-solid fa-chevron-${expanded ? "up" : "down"} text-xs`}></i>
                {goal.milestones.length} milestone{goal.milestones.length !== 1 ? "s" : ""}
                ({goal.milestones.filter(m => m.completed).length} done)
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="mt-2 space-y-1.5">
                      {goal.milestones.map(m => (
                        <div key={m._id} className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleMilestone(goal._id, m._id)}
                            className="flex-shrink-0">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${m.completed ? "border-transparent" : "border-gray-300"}`}
                              style={{ background: m.completed ? color : "transparent" }}>
                              {m.completed && <i className="fa-solid fa-check text-white text-xs"></i>}
                            </div>
                          </button>
                          <span className={`text-xs ${m.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                            {m.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/goals`, { withCredentials: true });
      setGoals(res.data || []);
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editGoal?._id) {
        await axios.put(`${baseURL}/api/goals/${editGoal._id}`, formData, { withCredentials: true });
        toast.success("Goal updated!");
      } else {
        await axios.post(`${baseURL}/api/goals`, formData, { withCredentials: true });
        toast.success("Goal created!");
      }
      setModalOpen(false);
      setEditGoal(null);
      fetchGoals();
    } catch {
      toast.error("Failed to save goal");
    }
  };

  const handleDelete = (id) => setDeleteConfirm(id);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/goals/${deleteConfirm}`, { withCredentials: true });
      setGoals(prev => prev.filter(g => g._id !== deleteConfirm));
      toast.success("Goal deleted");
    } catch {
      toast.error("Failed to delete goal");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleToggleMilestone = async (goalId, milestoneId) => {
    try {
      const res = await axios.patch(`${baseURL}/api/goals/${goalId}/milestone/${milestoneId}`,
        {}, { withCredentials: true });
      setGoals(prev => prev.map(g => g._id === goalId ? res.data.goal : g));
    } catch {
      toast.error("Failed to update milestone");
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filter === "short-term") return g.type === "short-term";
    if (filter === "long-term") return g.type === "long-term";
    if (filter === "completed") return g.completed;
    if (filter === "active") return !g.completed;
    return true;
  });

  // Stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed || g.progress === 100).length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Goals", value: totalGoals, icon: "fa-solid fa-bullseye", color: "#4F46E5" },
          { label: "Completed", value: completedGoals, icon: "fa-solid fa-trophy", color: "#22C55E" },
          { label: "In Progress", value: totalGoals - completedGoals, icon: "fa-solid fa-spinner", color: "#F59E0B" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: "fa-solid fa-chart-line", color: "#7C3AED" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-2xl font-700 mt-1" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.color + "15" }}>
                <i className={`${s.icon}`} style={{ color: s.color }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="ff-tabs">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "short-term", label: "Short-term" },
            { key: "long-term", label: "Long-term" },
            { key: "completed", label: "Completed" },
          ].map(t => (
            <button key={t.key} className={`ff-tab ${filter === t.key ? "active" : ""}`}
              onClick={() => setFilter(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setEditGoal({}); setModalOpen(true); }}
          className="ff-btn ff-btn-primary">
          <i className="fa-solid fa-plus text-sm"></i> New Goal
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ff-card p-5">
              <div className="skeleton h-4 w-48 mb-3 rounded"></div>
              <div className="skeleton h-3 w-full mb-2 rounded"></div>
              <div className="skeleton h-3 w-3/4 mb-4 rounded"></div>
              <div className="skeleton h-2 w-full rounded-full"></div>
            </div>
          ))}
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="ff-card p-12 text-center">
          <i className="fa-solid fa-bullseye text-5xl text-gray-200 mb-4"></i>
          <h3 className="text-lg font-600 text-gray-500 mb-2" style={{ fontWeight: 600 }}>
            {filter === "all" ? "No goals yet" : `No ${filter} goals`}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Set your first goal and start tracking your progress!
          </p>
          <button onClick={() => { setEditGoal({}); setModalOpen(true); }} className="ff-btn ff-btn-primary">
            <i className="fa-solid fa-plus"></i> Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={(g) => { setEditGoal(g); setModalOpen(true); }}
                onDelete={handleDelete}
                onToggleMilestone={handleToggleMilestone}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Goal Modal */}
      <AnimatePresence>
        {modalOpen && (
          <GoalModal
            goal={editGoal}
            onClose={() => { setModalOpen(false); setEditGoal(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="ff-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ff-modal p-6 max-w-sm text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-bullseye text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>Delete Goal?</h3>
              <p className="text-sm text-gray-500 mb-6">This goal and all its milestones will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
                <button onClick={confirmDelete} className="ff-btn ff-btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

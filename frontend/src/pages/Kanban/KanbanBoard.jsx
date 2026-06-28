import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import baseURL from "../../environment";

const COLUMNS = [
  { id: "todo",        label: "To Do",       icon: "fa-solid fa-circle-dot",    color: "#6366F1", bg: "#EEF2FF" },
  { id: "inprogress",  label: "In Progress", icon: "fa-solid fa-spinner",        color: "#F59E0B", bg: "#FFFBEB" },
  { id: "review",      label: "Review",      icon: "fa-solid fa-magnifying-glass",color: "#3B82F6", bg: "#EFF6FF" },
  { id: "completed",   label: "Completed",   icon: "fa-solid fa-circle-check",   color: "#22C55E", bg: "#F0FDF4" },
];

const PRIORITY_COLORS = {
  Low: { bg: "#F0FDF4", text: "#16A34A" },
  Medium: { bg: "#FFFBEB", text: "#D97706" },
  High: { bg: "#FEF2F2", text: "#DC2626" },
  Urgent: { bg: "#FAF5FF", text: "#7C3AED" },
};

const CATEGORY_ICONS = {
  Work: "fa-solid fa-briefcase",
  Personal: "fa-solid fa-user",
  Study: "fa-solid fa-graduation-cap",
  Health: "fa-solid fa-heart",
  Shopping: "fa-solid fa-cart-shopping",
  Other: "fa-solid fa-tag",
};

function TaskCard({ task, onEdit, onDelete, dragHandlers }) {
  const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.kanbanStatus !== "completed";

  return (
    <div
      className="kanban-card animate-scale-in"
      draggable
      {...dragHandlers}
      data-id={task._id}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-500 text-gray-800 leading-snug flex-1" style={{ fontWeight: 500 }}>{task.taskName}</p>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(task)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-pen text-gray-400 text-xs"></i>
          </button>
          <button onClick={() => onDelete(task._id)}
            className="p-1 rounded-lg hover:bg-red-50 transition-colors">
            <i className="fa-solid fa-trash text-gray-400 text-xs hover:text-red-500"></i>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="ff-badge text-xs" style={{ background: pc.bg, color: pc.text, padding: "2px 8px" }}>
          {task.priority}
        </span>
        {task.category && (
          <span className="ff-badge ff-badge-gray text-xs" style={{ padding: "2px 8px" }}>
            <i className={`${CATEGORY_ICONS[task.category] || "fa-solid fa-tag"} mr-1 text-xs`}></i>
            {task.category}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        {task.dueDate ? (
          <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
            <i className={`fa-solid fa-calendar-day text-xs ${isOverdue ? "text-red-500" : ""}`}></i>
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {isOverdue && <span className="text-red-500 font-500" style={{ fontWeight: 500 }}> • Overdue</span>}
          </span>
        ) : (
          <span></span>
        )}
        {task.tags?.length > 0 && (
          <span className="text-xs text-indigo-400"># {task.tags[0]}</span>
        )}
      </div>
    </div>
  );
}

function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    taskName: task?.taskName || "",
    description: task?.description || "",
    priority: task?.priority || "Medium",
    category: task?.category || "Work",
    kanbanStatus: task?.kanbanStatus || "todo",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    tags: task?.tags?.join(", ") || "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.taskName.trim()) { toast.error("Task name is required"); return; }
    onSave({
      ...form,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      dueDate: form.dueDate || null,
    });
  };

  return (
    <div className="ff-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ff-modal p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-600 text-gray-800" style={{ fontWeight: 600 }}>
            {task ? "Edit Task" : "New Task"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-times text-gray-500"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Task Name *</label>
            <input className="ff-input" placeholder="What needs to be done?"
              value={form.taskName} onChange={e => set("taskName", e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Description</label>
            <textarea className="ff-input resize-none" rows={3} placeholder="Add details..."
              value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Priority</label>
              <select className="ff-input" value={form.priority} onChange={e => set("priority", e.target.value)}>
                {["Low", "Medium", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Category</label>
              <select className="ff-input" value={form.category} onChange={e => set("category", e.target.value)}>
                {["Work", "Personal", "Study", "Health", "Shopping", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Status</label>
              <select className="ff-input" value={form.kanbanStatus} onChange={e => set("kanbanStatus", e.target.value)}>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Due Date</label>
              <input type="date" className="ff-input" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Tags (comma separated)</label>
            <input className="ff-input" placeholder="design, frontend, urgent"
              value={form.tags} onChange={e => set("tags", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} className="ff-btn ff-btn-primary flex-1">
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/tasks`, { withCredentials: true });
      setTasks(res.data || []);
    } catch (e) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editTask) {
        await axios.put(`${baseURL}/api/tasks/${editTask._id}`, formData, { withCredentials: true });
        toast.success("Task updated!");
      } else {
        await axios.post(`${baseURL}/api/tasks`, formData, { withCredentials: true });
        toast.success("Task created!");
      }
      setModalOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to save task");
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/tasks/${deleteConfirm}`, { withCredentials: true });
      setTasks(prev => prev.filter(t => t._id !== deleteConfirm));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  // Drag & Drop
  const handleDragStart = (e, taskId) => {
    setDragId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(colId);
  };

  const handleDrop = async (e, colId) => {
    e.preventDefault();
    setDragOver(null);
    if (!dragId) return;

    const task = tasks.find(t => t._id === dragId);
    if (!task || task.kanbanStatus === colId) return;

    setTasks(prev => prev.map(t => t._id === dragId ? { ...t, kanbanStatus: colId } : t));

    try {
      await axios.put(`${baseURL}/api/tasks/${dragId}`, { kanbanStatus: colId }, { withCredentials: true });
    } catch {
      toast.error("Failed to move task");
      fetchTasks();
    }
    setDragId(null);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOver(null);
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    if (filterCategory !== "All" && (t.category || "Work") !== filterCategory) return false;
    if (searchQuery && !t.taskName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tasksByColumn = (colId) => filteredTasks.filter(t => (t.kanbanStatus || "todo") === colId);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-sm text-gray-500">{tasks.length} total tasks</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            className="ff-input h-9 text-sm w-48"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select className="ff-input h-9 text-sm w-32"
            value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="All">All Priority</option>
            {["Low", "Medium", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="ff-input h-9 text-sm w-32"
            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {["Work", "Personal", "Study", "Health", "Shopping", "Other"].map(c => <option key={c}>{c}</option>)}
          </select>
          <button
            onClick={() => { setEditTask(null); setModalOpen(true); }}
            className="ff-btn ff-btn-primary">
            <i className="fa-solid fa-plus text-sm"></i> New Task
          </button>
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="rounded-2xl p-3" style={{ background: "#F8FAFC", border: "1.5px solid #E5E7EB" }}>
              <div className="skeleton h-6 w-24 mb-4 rounded"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-xl mb-3"></div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colTasks = tasksByColumn(col.id);
            return (
              <div
                key={col.id}
                className={`kanban-col ${dragOver === col.id ? "drag-over" : ""}`}
                onDragOver={e => handleDragOver(e, col.id)}
                onDrop={e => handleDrop(e, col.id)}
                onDragLeave={() => setDragOver(null)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: col.bg }}>
                      <i className={`${col.icon} text-xs`} style={{ color: col.color }}></i>
                    </div>
                    <span className="text-sm font-600 text-gray-700" style={{ fontWeight: 600 }}>{col.label}</span>
                    <span className="ff-badge" style={{ background: col.bg, color: col.color, padding: "1px 7px" }}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => { setEditTask({ kanbanStatus: col.id }); setModalOpen(true); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Add task">
                    <i className="fa-solid fa-plus text-gray-400 text-xs"></i>
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto py-3 no-scrollbar"
                  style={{ minHeight: 400, maxHeight: "calc(100vh - 280px)" }}>
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskCard
                          task={task}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          dragHandlers={{
                            onDragStart: (e) => handleDragStart(e, task._id),
                            onDragEnd: handleDragEnd,
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {colTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center opacity-50">
                      <i className="fa-solid fa-inbox text-2xl text-gray-300 mb-2"></i>
                      <p className="text-xs text-gray-400">Drop tasks here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {modalOpen && (
          <TaskModal
            task={editTask?._id ? editTask : (editTask?.kanbanStatus ? { kanbanStatus: editTask.kanbanStatus } : null)}
            onClose={() => { setModalOpen(false); setEditTask(null); }}
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
                <i className="fa-solid fa-trash text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>Delete Task?</h3>
              <p className="text-sm text-gray-500 mb-6">This task will be permanently removed.</p>
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

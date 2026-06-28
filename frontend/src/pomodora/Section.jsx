import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import baseURL from "../environment";

const MODES = [
  { key: "focus",  label: "Focus",       minutes: 25, color: "#4F46E5", bg: "#EEF2FF" },
  { key: "short",  label: "Short Break", minutes: 5,  color: "#22C55E", bg: "#F0FDF4" },
  { key: "long",   label: "Long Break",  minutes: 15, color: "#F59E0B", bg: "#FFFBEB" },
  { key: "custom", label: "Custom",      minutes: 0,  color: "#7C3AED", bg: "#FAF5FF" },
];

const PRIORITY_COLORS = {
  Low: { bg: "#F0FDF4", text: "#16A34A" },
  Medium: { bg: "#FFFBEB", text: "#D97706" },
  High: { bg: "#FEF2F2", text: "#DC2626" },
  Urgent: { bg: "#FAF5FF", text: "#7C3AED" },
};

function formatTime(seconds) {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Section() {
  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState("focus");
  const [customMin, setCustomMin] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [sessions, setSessions] = useState(0);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // New task form
  const [newTaskName, setNewTaskName] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("Work");

  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);

  const currentMode = MODES.find(m => m.key === mode);
  const totalSeconds = mode === "custom" ? customMin * 60 : currentMode.minutes * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 54;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/tasks`, { withCredentials: true });
      setTasks(res.data || []);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Reset timer when mode changes
  useEffect(() => {
    if (!isRunning) {
      const mins = mode === "custom" ? customMin : currentMode.minutes;
      setTimeLeft(mins * 60);
    }
  }, [mode, customMin]);

  const startStop = () => {
    if (mode === "focus" && !activeTask) {
      toast.warning("Select a task to focus on first!");
      return;
    }

    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      // Save session time if we were focusing
      if (mode === "focus" && activeTask && sessionStartRef.current) {
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        axios.put(`${baseURL}/api/tasks/${activeTask._id}/time`,
          { taskDuration: elapsed }, { withCredentials: true }).catch(console.error);
      }
    } else {
      setIsRunning(true);
      sessionStartRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleTimerComplete = () => {
    // Play notification sound
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    } catch {}

    if (mode === "focus") {
      setSessions(s => s + 1);
      toast.success("🎉 Focus session complete! Take a break.");
      // Save full session duration
      if (activeTask && sessionStartRef.current) {
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        axios.put(`${baseURL}/api/tasks/${activeTask._id}/time`,
          { taskDuration: elapsed }, { withCredentials: true }).catch(console.error);
      }
    } else {
      toast.success("Break over! Ready to focus again?");
    }
    sessionStartRef.current = null;

    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("FocusFlow", {
        body: mode === "focus" ? "Focus session complete! Take a break." : "Break over! Time to focus.",
      });
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    const mins = mode === "custom" ? customMin : currentMode.minutes;
    setTimeLeft(mins * 60);
    sessionStartRef.current = null;
  };

  const switchMode = (m) => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setMode(m);
    sessionStartRef.current = null;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      await axios.post(`${baseURL}/api/tasks`,
        { taskName: newTaskName, priority: newPriority, category: newCategory, description: "" },
        { withCredentials: true });
      setNewTaskName(""); setShowAddTask(false);
      toast.success("Task added!");
      fetchTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/tasks/${id}`, { withCredentials: true });
      setTasks(prev => prev.filter(t => t._id !== id));
      if (activeTask?._id === id) setActiveTask(null);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const markDone = async (task) => {
    try {
      await axios.put(`${baseURL}/api/tasks/${task._id}`, { kanbanStatus: "completed" }, { withCredentials: true });
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, kanbanStatus: "completed" } : t));
      if (activeTask?._id === task._id) { setActiveTask(null); reset(); }
      toast.success("Task marked as done!");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "active") return t.kanbanStatus !== "completed";
    if (taskFilter === "done") return t.kanbanStatus === "completed";
    return true;
  });

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timer Panel */}
        <div className="lg:col-span-2">
          {/* Mode Tabs */}
          <div className="ff-card p-5 mb-4">
            <div className="ff-tabs mb-5">
              {MODES.map(m => (
                <button key={m.key} className={`ff-tab ${mode === m.key ? "active" : ""}`}
                  onClick={() => switchMode(m.key)}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Custom time input */}
            {mode === "custom" && (
              <div className="mb-4 flex items-center gap-3">
                <label className="text-sm text-gray-500 flex-shrink-0">Minutes:</label>
                <input
                  type="number" min={1} max={120}
                  value={customMin}
                  onChange={e => { setCustomMin(Number(e.target.value)); if (!isRunning) setTimeLeft(Number(e.target.value) * 60); }}
                  className="ff-input w-24 text-center text-sm"
                />
              </div>
            )}

            {/* Circular Timer */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 my-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none"
                    stroke="#E5E7EB" strokeWidth="8" />
                  <motion.circle cx="60" cy="60" r="54" fill="none"
                    stroke={currentMode.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * progress) / 100}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-700 tabular-nums"
                    style={{ color: currentMode.color, fontWeight: 700 }}>
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{currentMode.label}</span>
                  {activeTask && mode === "focus" && (
                    <span className="text-xs text-indigo-400 mt-1 max-w-28 text-center truncate">
                      {activeTask.taskName}
                    </span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-2">
                <button onClick={reset}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <i className="fa-solid fa-rotate-right text-gray-500"></i>
                </button>
                <button onClick={startStop}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-105"
                  style={{ background: currentMode.color, boxShadow: `0 6px 20px ${currentMode.color}40` }}>
                  <i className={`fa-solid ${isRunning ? "fa-pause" : "fa-play"} ml-${isRunning ? 0 : 0.5}`}></i>
                </button>
                <button onClick={() => {
                  if (Notification.permission === "default") Notification.requestPermission();
                }}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Enable notifications">
                  <i className="fa-solid fa-bell text-gray-500"></i>
                </button>
              </div>
            </div>

            {/* Session count */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <div className="flex justify-center gap-2 mb-1">
                {Array.from({ length: Math.max(4, sessions + 1) }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ background: i < sessions ? "#4F46E5" : "#E5E7EB" }}></div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                {sessions} session{sessions !== 1 ? "s" : ""} completed today
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="ff-card p-4">
            <h3 className="text-sm font-600 text-gray-700 mb-3" style={{ fontWeight: 600 }}>
              <i className="fa-solid fa-chart-simple text-indigo-400 mr-2"></i>Today's Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Sessions", value: sessions, color: "#4F46E5" },
                { label: "Focus Time", value: `${sessions * (currentMode.minutes || 25)}m`, color: "#22C55E" },
                { label: "Tasks", value: tasks.filter(t => t.kanbanStatus !== "completed").length, color: "#F59E0B" },
                { label: "Done", value: tasks.filter(t => t.kanbanStatus === "completed").length, color: "#7C3AED" },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: s.color + "10" }}>
                  <p className="text-xl font-700" style={{ color: s.color, fontWeight: 700 }}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Panel */}
        <div className="lg:col-span-3 ff-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-gray-800" style={{ fontWeight: 600 }}>Tasks</h3>
            <div className="flex items-center gap-2">
              <div className="ff-tabs" style={{ padding: "2px" }}>
                {[["all", "All"], ["active", "Active"], ["done", "Done"]].map(([k, l]) => (
                  <button key={k} className={`ff-tab text-xs ${taskFilter === k ? "active" : ""}`}
                    onClick={() => setTaskFilter(k)}>{l}</button>
                ))}
              </div>
              <button onClick={() => setShowAddTask(!showAddTask)}
                className="ff-btn ff-btn-primary py-1.5 px-3 text-sm">
                <i className="fa-solid fa-plus text-xs"></i> Add
              </button>
            </div>
          </div>

          {/* Add task form */}
          <AnimatePresence>
            {showAddTask && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleAddTask}
                className="overflow-hidden mb-4"
              >
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50 space-y-3">
                  <input className="ff-input text-sm" placeholder="Task name..."
                    value={newTaskName} onChange={e => setNewTaskName(e.target.value)} required />
                  <div className="flex gap-2">
                    <select className="ff-input text-sm flex-1" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                      {["Low", "Medium", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
                    </select>
                    <select className="ff-input text-sm flex-1" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                      {["Work", "Personal", "Study", "Health", "Shopping", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowAddTask(false)}
                      className="ff-btn ff-btn-ghost text-sm flex-1 py-2">Cancel</button>
                    <button type="submit" className="ff-btn ff-btn-primary text-sm flex-1 py-2">Add Task</button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Task list */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl"></div>)}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <i className="fa-solid fa-clipboard text-4xl text-gray-200 mb-3"></i>
              <p className="text-sm text-gray-400">No tasks. Add one to start focusing!</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
              {filteredTasks.map(task => {
                const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
                const isDone = task.kanbanStatus === "completed";
                const isActive = activeTask?._id === task._id;

                return (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "border-indigo-300 bg-indigo-50"
                        : isDone
                        ? "border-gray-100 bg-gray-50 opacity-60"
                        : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                    }`}
                    onClick={() => !isDone && setActiveTask(isActive ? null : task)}
                  >
                    {/* Select indicator */}
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      isActive ? "border-indigo-500 bg-indigo-500" : isDone ? "border-green-400 bg-green-400" : "border-gray-300"
                    }`}>
                      {(isActive || isDone) && (
                        <i className="fa-solid fa-check text-white text-xs flex items-center justify-center w-full h-full leading-none" style={{ fontSize: "8px" }}></i>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-500 truncate ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}
                        style={{ fontWeight: 500 }}>
                        {task.taskName}
                      </p>
                      <div className="flex gap-1.5 mt-0.5">
                        <span className="ff-badge text-xs" style={{ background: pc.bg, color: pc.text, padding: "1px 7px" }}>
                          {task.priority}
                        </span>
                        <span className="ff-badge ff-badge-gray text-xs" style={{ padding: "1px 7px" }}>
                          {task.category || "Work"}
                        </span>
                        {task.taskDuration > 0 && (
                          <span className="text-xs text-gray-400">
                            {Math.round(task.taskDuration / 60)}m focused
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!isDone && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markDone(task); }}
                          className="p-1.5 rounded-lg hover:bg-green-100 transition-colors"
                          title="Mark as done">
                          <i className="fa-solid fa-check text-gray-300 hover:text-green-500 text-xs"></i>
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete">
                        <i className="fa-solid fa-trash text-gray-300 hover:text-red-500 text-xs"></i>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Active task banner */}
          <AnimatePresence>
            {activeTask && mode === "focus" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 rounded-xl flex items-center gap-3"
                style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                <div className="w-2 h-2 rounded-full bg-indigo-500" style={{ animation: isRunning ? "pulseSoft 2s infinite" : "none" }}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-indigo-400">Currently focusing on</p>
                  <p className="text-sm font-500 text-indigo-800 truncate" style={{ fontWeight: 500 }}>
                    {activeTask.taskName}
                  </p>
                </div>
                <button onClick={() => setActiveTask(null)}
                  className="text-indigo-400 hover:text-indigo-600 text-xs">
                  <i className="fa-solid fa-times"></i>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

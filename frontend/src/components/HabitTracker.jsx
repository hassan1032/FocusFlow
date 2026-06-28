import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import baseURL from "../environment";
import { toast } from "react-toastify";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const HabitTracker = ({ user, habits, weeklyDate, onRefresh }) => {
  const [today, setToday] = useState("");
  const [newHabit, setNewHabit] = useState("");
  const [adding, setAdding] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    setToday(`${dd}/${mm}/${yyyy}`);
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setAdding(true);
    try {
      await axios.post(`${baseURL}/api/habits/create`, { content: newHabit.trim() }, { withCredentials: true });
      setNewHabit("");
      toast.success("Habit added!");
      onRefresh();
    } catch {
      toast.error("Failed to add habit");
    } finally {
      setAdding(false);
    }
  };

  const handleStatusUpdate = async (habitId, date) => {
    setLoadingId(habitId + date);
    try {
      await axios.get(`${baseURL}/api/habits/status-update?id=${habitId}&date=${date}`, { withCredentials: true });
      onRefresh();
    } catch {
      toast.error("Failed to update habit");
    } finally {
      setLoadingId(null);
    }
  };

  const handleFavoriteToggle = async (habitId) => {
    try {
      await axios.get(`${baseURL}/api/habits/favorite-habit?id=${habitId}`, { withCredentials: true });
      onRefresh();
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const handleDeleteHabit = (habitId) => setDeleteConfirm(habitId);

  const confirmDeleteHabit = async () => {
    try {
      await axios.get(`${baseURL}/api/habits/remove?id=${deleteConfirm}`, { withCredentials: true });
      toast.success("Habit deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete habit");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Stats
  const completedToday = habits.filter(h => h.dates?.find(d => d.date === today)?.complete === "yes").length;
  const totalStreaks = habits.filter(h => {
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const ydStr = `${String(yesterdayDate.getDate()).padStart(2, "0")}/${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}/${yesterdayDate.getFullYear()}`;
    return h.dates?.find(d => d.date === ydStr)?.complete === "yes";
  }).length;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Habits", value: habits.length, icon: "fa-solid fa-fire", color: "#F59E0B" },
          { label: "Done Today", value: `${completedToday}/${habits.length}`, icon: "fa-solid fa-circle-check", color: "#22C55E" },
          { label: "Streak Yesterday", value: totalStreaks, icon: "fa-solid fa-bolt", color: "#4F46E5" },
          { label: "Completion", value: habits.length > 0 ? `${Math.round((completedToday / habits.length) * 100)}%` : "0%", icon: "fa-solid fa-chart-simple", color: "#7C3AED" },
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

      {/* Today's progress */}
      <div className="ff-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-600 text-gray-800 text-sm" style={{ fontWeight: 600 }}>Today's Progress</h3>
          <span className="text-sm font-600" style={{ color: "#22C55E", fontWeight: 600 }}>
            {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
          </span>
        </div>
        <div className="ff-progress-bar h-3">
          <div className="ff-progress-fill h-3"
            style={{
              width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%`,
              background: "#22C55E"
            }}></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {completedToday} of {habits.length} habits completed today
        </p>
      </div>

      {/* Add habit form */}
      <div className="ff-card p-5 mb-6">
        <form onSubmit={handleAddHabit} className="flex gap-3">
          <input
            className="ff-input flex-1"
            placeholder="Add a new habit to track..."
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            required
          />
          <button type="submit" disabled={adding}
            className="ff-btn ff-btn-primary flex-shrink-0">
            {adding ? (
              <i className="fa-solid fa-spinner animate-spin text-sm"></i>
            ) : (
              <><i className="fa-solid fa-plus text-sm"></i> Add Habit</>
            )}
          </button>
        </form>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="ff-card p-12 text-center">
          <i className="fa-solid fa-fire text-5xl text-gray-200 mb-4"></i>
          <h3 className="text-lg font-600 text-gray-500 mb-2" style={{ fontWeight: 600 }}>No habits yet</h3>
          <p className="text-gray-400 text-sm">Start tracking your daily habits to build consistency.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {[...habits]
              .sort((a, b) => {
                const aFav = a.favorite ? 1 : 0;
                const bFav = b.favorite ? 1 : 0;
                return bFav - aFav;
              })
              .map(habit => {
                const todayStatus = habit.dates?.find(d => d.date === today)?.complete;
                const weeklyDone = weeklyDate.filter(d => habit.dates?.find(x => x.date === d)?.complete === "yes").length;
                const weeklyPct = Math.round((weeklyDone / 7) * 100);

                return (
                  <motion.div
                    key={habit._id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="ff-card p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Today toggle */}
                        <button
                          onClick={() => handleStatusUpdate(habit._id, today)}
                          disabled={loadingId === habit._id + today}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                            todayStatus === "yes"
                              ? "bg-green-100 hover:bg-green-200"
                              : todayStatus === "no"
                              ? "bg-red-100 hover:bg-red-200"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}>
                          {loadingId === habit._id + today ? (
                            <i className="fa-solid fa-spinner animate-spin text-gray-400 text-sm"></i>
                          ) : todayStatus === "yes" ? (
                            <i className="fa-solid fa-check text-green-500"></i>
                          ) : todayStatus === "no" ? (
                            <i className="fa-solid fa-times text-red-500"></i>
                          ) : (
                            <i className="fa-solid fa-minus text-gray-300"></i>
                          )}
                        </button>

                        <div>
                          <h4 className="font-500 text-gray-800 text-sm" style={{ fontWeight: 500 }}>
                            {habit.content}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {weeklyDone}/7 days this week
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleFavoriteToggle(habit._id)}
                          className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                          <i className={`${habit.favorite ? "fa-solid fa-star text-yellow-400" : "fa-regular fa-star text-gray-300"} text-sm`}></i>
                        </button>
                        <button onClick={() => handleDeleteHabit(habit._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <i className="fa-solid fa-trash text-gray-300 text-sm hover:text-red-500"></i>
                        </button>
                      </div>
                    </div>

                    {/* Weekly view */}
                    <div className="grid grid-cols-7 gap-1">
                      {weeklyDate.map((dateStr, idx) => {
                        const status = habit.dates?.find(d => d.date === dateStr)?.complete;
                        const dayLabel = WEEKDAY_LABELS[new Date(dateStr.split("/").reverse().join("-")).getDay()];
                        const isToday = dateStr === today;
                        return (
                          <button
                            key={dateStr}
                            onClick={() => handleStatusUpdate(habit._id, dateStr)}
                            className="flex flex-col items-center gap-1"
                          >
                            <span className={`text-xs ${isToday ? "text-indigo-500 font-600" : "text-gray-400"}`}
                              style={{ fontWeight: isToday ? 600 : 400 }}>
                              {dayLabel}
                            </span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all hover:scale-110 ${
                              status === "yes" ? "bg-green-100" : status === "no" ? "bg-red-100" : "bg-gray-100"
                            } ${isToday ? "ring-2 ring-indigo-300" : ""}`}>
                              {status === "yes" ? (
                                <i className="fa-solid fa-check text-green-500 text-xs"></i>
                              ) : status === "no" ? (
                                <i className="fa-solid fa-times text-red-400 text-xs"></i>
                              ) : (
                                <i className="fa-solid fa-minus text-gray-300 text-xs"></i>
                              )}
                            </div>
                            <span className="text-xs text-gray-300">{dateStr.slice(0, 2)}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Week progress bar */}
                    <div className="mt-3">
                      <div className="ff-progress-bar h-1.5">
                        <div className="ff-progress-fill h-1.5"
                          style={{ width: `${weeklyPct}%`, background: "#4F46E5" }}></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      )}
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
                <i className="fa-solid fa-fire text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>Delete Habit?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This habit and all its tracking history will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
                <button onClick={confirmDeleteHabit} className="ff-btn ff-btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitTracker;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import baseURL from "../../environment";

const ACHIEVEMENTS = [
  { id: "first_task",    icon: "fa-solid fa-star",        label: "First Task",       desc: "Created your first task",          color: "#F59E0B" },
  { id: "streak_7",      icon: "fa-solid fa-fire",        label: "7-Day Streak",     desc: "7 habits completed in a row",      color: "#EF4444" },
  { id: "notes_10",      icon: "fa-solid fa-sticky-note", label: "Note Taker",       desc: "Created 10+ notes",                color: "#4F46E5" },
  { id: "focus_5",       icon: "fa-solid fa-brain",       label: "Deep Focus",       desc: "Completed 5 Pomodoro sessions",    color: "#7C3AED" },
  { id: "goal_complete", icon: "fa-solid fa-trophy",      label: "Goal Setter",      desc: "Created your first goal",          color: "#22C55E" },
  { id: "flashcard_10",  icon: "fa-solid fa-cards-blank", label: "Flashcard Champ",  desc: "Created 10+ flashcards",           color: "#0EA5E9" },
];

const TABS = ["Overview", "Activity", "Achievements"];

export default function Profile() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [tasks, habits, notes, goals] = await Promise.all([
        axios.get(`${baseURL}/api/tasks`, { withCredentials: true }),
        axios.get(`${baseURL}/api/habits`, { withCredentials: true }),
        axios.get(`${baseURL}/api/note/all`, { withCredentials: true }),
        axios.get(`${baseURL}/api/goals`, { withCredentials: true }).catch(() => ({ data: [] })),
      ]);

      const taskData = tasks.data || [];
      const habitData = habits.data?.habits || [];
      const noteData = notes.data?.notes || [];
      const goalData = goals.data || [];

      const completedTasks = taskData.filter(t => t.kanbanStatus === "completed").length;
      const totalFocusMin = taskData.reduce((sum, t) => sum + Math.round((t.taskDuration || 0) / 60), 0);

      setStats({
        totalTasks: taskData.length,
        completedTasks,
        totalHabits: habitData.length,
        totalNotes: noteData.length,
        totalGoals: goalData.length,
        completedGoals: goalData.filter(g => g.completed || g.progress === 100).length,
        focusMinutes: totalFocusMin,
        productivity: taskData.length > 0 ? Math.round((completedTasks / taskData.length) * 100) : 0,
      });

      // Recent activity from tasks + notes
      const activity = [
        ...taskData.slice(0, 5).map(t => ({
          type: "task", icon: "fa-solid fa-check-square", label: t.taskName,
          sub: `Task • ${t.kanbanStatus || "todo"}`, date: t.createdAt, color: "#4F46E5"
        })),
        ...noteData.slice(0, 3).map(n => ({
          type: "note", icon: "fa-solid fa-sticky-note", label: n.title,
          sub: "Note created", date: n.createdAt, color: "#7C3AED"
        })),
        ...habitData.slice(0, 3).map(h => ({
          type: "habit", icon: "fa-solid fa-fire", label: h.content,
          sub: "Habit tracked", date: h.timestamp || new Date().toISOString(), color: "#F59E0B"
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

      setRecentActivity(activity);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "U";
  const memberSince = user.timestamp
    ? new Date(user.timestamp).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently joined";

  // Unlocked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter(a => {
    if (!stats) return false;
    if (a.id === "first_task") return stats.totalTasks >= 1;
    if (a.id === "notes_10") return stats.totalNotes >= 10;
    if (a.id === "goal_complete") return stats.totalGoals >= 1;
    return false;
  });

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Profile Header */}
      <div className="ff-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-700"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", fontWeight: 700 }}>
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-white"></div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-700 text-gray-900" style={{ fontWeight: 700 }}>
              {user.username || "User"}
            </h2>
            <p className="text-gray-500 mt-0.5">{user.email || ""}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="ff-badge ff-badge-primary">
                <i className="fa-solid fa-calendar-check mr-1 text-xs"></i>
                Member since {memberSince}
              </span>
              {stats && (
                <span className="ff-badge ff-badge-success">
                  <i className="fa-solid fa-trophy mr-1 text-xs"></i>
                  {stats.productivity}% productivity
                </span>
              )}
              <span className="ff-badge ff-badge-purple">
                <i className="fa-solid fa-shield mr-1 text-xs"></i>
                Active user
              </span>
            </div>
          </div>

          <div className="text-center hidden sm:block">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                <circle cx="40" cy="40" r="32" fill="none"
                  stroke="#4F46E5" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - (stats?.productivity || 0) / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-700" style={{ color: "#4F46E5", fontWeight: 700 }}>
                  {stats?.productivity || 0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Productivity</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ff-tabs mb-6 max-w-sm">
        {TABS.map(tab => (
          <button key={tab} className={`ff-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl"></div>)
            ) : [
              { label: "Total Tasks", value: stats?.totalTasks, icon: "fa-solid fa-list-check", color: "#4F46E5" },
              { label: "Completed", value: stats?.completedTasks, icon: "fa-solid fa-check-circle", color: "#22C55E" },
              { label: "Habits", value: stats?.totalHabits, icon: "fa-solid fa-fire", color: "#F59E0B" },
              { label: "Notes", value: stats?.totalNotes, icon: "fa-solid fa-sticky-note", color: "#7C3AED" },
              { label: "Goals", value: stats?.totalGoals, icon: "fa-solid fa-bullseye", color: "#EF4444" },
              { label: "Goals Done", value: stats?.completedGoals, icon: "fa-solid fa-trophy", color: "#0EA5E9" },
              { label: "Focus Time", value: `${stats?.focusMinutes || 0}m`, icon: "fa-solid fa-clock", color: "#4F46E5" },
              { label: "Productivity", value: `${stats?.productivity || 0}%`, icon: "fa-solid fa-chart-line", color: "#22C55E" },
            ].map(s => (
              <motion.div key={s.label} layout className="stat-card"
                whileHover={{ y: -2 }}>
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
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "Activity" && (
        <div className="ff-card p-5">
          <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Recent Activity</h3>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="skeleton h-3 w-48 mb-2 rounded"></div>
                    <div className="skeleton h-3 w-24 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-clock-rotate-left text-4xl text-gray-200 mb-3"></i>
              <p className="text-gray-400 text-sm">No activity yet. Start using FocusFlow!</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100"></div>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 relative pl-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                      style={{ background: item.color + "15" }}>
                      <i className={`${item.icon} text-sm`} style={{ color: item.color }}></i>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-500 text-gray-800 truncate" style={{ fontWeight: 500 }}>{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                    <p className="text-xs text-gray-300 flex-shrink-0 pt-1">
                      {item.date ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "Achievements" && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            {unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements unlocked
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((a, i) => {
              const unlocked = unlockedAchievements.some(u => u.id === a.id);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`ff-card p-4 flex items-center gap-4 transition-all ${unlocked ? "" : "opacity-40"}`}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: unlocked ? a.color + "15" : "#F3F4F6" }}>
                    <i className={`${a.icon} text-2xl`} style={{ color: unlocked ? a.color : "#D1D5DB" }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-600 text-sm text-gray-800" style={{ fontWeight: 600 }}>{a.label}</p>
                      {unlocked && <i className="fa-solid fa-circle-check text-green-400 text-xs"></i>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

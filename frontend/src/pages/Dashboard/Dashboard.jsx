import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import baseURL from "../../environment";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PRIORITY_COLORS = { Low: "#22C55E", Medium: "#F59E0B", High: "#EF4444", Urgent: "#7C3AED" };
const CATEGORY_COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#7C3AED", "#0EA5E9"];

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-700 text-gray-900" style={{ fontWeight: 700 }}>{value}</p>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <i className={`${icon} text-xl`} style={{ color }}></i>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="stat-card">
      <div className="skeleton h-4 w-24 mb-3 rounded"></div>
      <div className="skeleton h-8 w-16 mb-2 rounded"></div>
      <div className="skeleton h-3 w-20 rounded"></div>
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, h, n] = await Promise.all([
          axios.get(`${baseURL}/api/tasks`, { withCredentials: true }),
          axios.get(`${baseURL}/api/habits`, { withCredentials: true }),
          axios.get(`${baseURL}/api/note/all`, { withCredentials: true }),
        ]);
        setTasks(t.data || []);
        setHabits(h.data?.habits || []);
        setNotes(n.data?.notes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Stats
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.kanbanStatus === "completed").length;
  const pendingTasks = tasks.filter(t => t.kanbanStatus !== "completed").length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < now && t.kanbanStatus !== "completed";
  }).length;
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;

  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Weekly progress (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const day = WEEKDAYS[d.getDay()];
    const dd = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const completedOnDay = tasks.filter(t => {
      if (!t.updatedAt && !t.createdAt) return false;
      const td = new Date(t.updatedAt || t.createdAt);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth() && td.getDate() === d.getDate()
        && t.kanbanStatus === "completed";
    }).length;
    const habitsDone = habits.filter(h => {
      const hd = h.dates?.find(x => x.date === dd);
      return hd?.complete === "yes";
    }).length;
    return { day, tasks: completedOnDay, habits: habitsDone };
  });

  // Priority distribution
  const priorityData = ["Low", "Medium", "High", "Urgent"].map(p => ({
    name: p,
    value: tasks.filter(t => t.priority === p).length,
    color: PRIORITY_COLORS[p],
  })).filter(p => p.value > 0);

  // Category distribution
  const categories = [...new Set(tasks.map(t => t.category || "Work"))];
  const categoryData = categories.map((c, i) => ({
    name: c,
    value: tasks.filter(t => (t.category || "Work") === c).length,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  // Recent activity (last 5 tasks)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Habit completion today
  const habitsToday = habits.filter(h => h.dates?.find(d => d.date === todayStr)?.complete === "yes").length;

  const quickActions = [
    { to: "/tasks", icon: "fa-solid fa-plus", label: "New Task", color: "#4F46E5" },
    { to: "/notes", icon: "fa-solid fa-sticky-note", label: "New Note", color: "#22C55E" },
    { to: "/habits", icon: "fa-solid fa-fire", label: "Track Habit", color: "#F59E0B" },
    { to: "/goals", icon: "fa-solid fa-bullseye", label: "Set Goal", color: "#EF4444" },
    { to: "/pomodora", icon: "fa-solid fa-clock", label: "Start Focus", color: "#7C3AED" },
    { to: "/calendar", icon: "fa-solid fa-calendar", label: "View Calendar", color: "#0EA5E9" },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-700 text-gray-900" style={{ fontWeight: 700 }}>
          Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"},
          {" "}<span style={{ color: "#4F46E5" }}>{user.username || "there"}</span> 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon="fa-solid fa-list-check" label="Total Tasks" value={totalTasks} color="#4F46E5" sub="All time" />
            <StatCard icon="fa-solid fa-circle-check" label="Completed" value={completedTasks} color="#22C55E" sub={`${productivityScore}% rate`} />
            <StatCard icon="fa-solid fa-spinner" label="In Progress" value={pendingTasks} color="#F59E0B" sub="Active tasks" />
            <StatCard icon="fa-solid fa-triangle-exclamation" label="Overdue" value={overdueTasks} color="#EF4444" sub="Need attention" />
            <StatCard icon="fa-solid fa-calendar-day" label="Due Today" value={todayTasks} color="#0EA5E9" sub="Today's tasks" />
            <StatCard icon="fa-solid fa-fire" label="Habits Today" value={`${habitsToday}/${habits.length}`} color="#F59E0B" sub="Completed" />
            <StatCard icon="fa-solid fa-sticky-note" label="Total Notes" value={notes.length} color="#7C3AED" sub="All notes" />
            <StatCard icon="fa-solid fa-trophy" label="Productivity" value={`${productivityScore}%`} color="#22C55E" sub="Score" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Progress Chart */}
        <div className="ff-card p-5 lg:col-span-2">
          <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Weekly Progress</h3>
          {loading ? (
            <div className="skeleton h-48 w-full rounded-xl"></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#4F46E5" strokeWidth={2} fill="url(#taskGrad)" name="Tasks" />
                <Area type="monotone" dataKey="habits" stroke="#22C55E" strokeWidth={2} fill="url(#habitGrad)" name="Habits" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: "#4F46E5" }}></div>
              <span className="text-xs text-gray-500">Tasks completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E" }}></div>
              <span className="text-xs text-gray-500">Habits completed</span>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="ff-card p-5">
          <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Productivity Score</h3>
          {loading ? (
            <div className="skeleton h-48 w-full rounded-xl"></div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke="#4F46E5" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - productivityScore / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-700" style={{ color: "#4F46E5", fontWeight: 700 }}>{productivityScore}%</span>
                  <span className="text-xs text-gray-400">Score</span>
                </div>
              </div>
              <div className="w-full mt-4 space-y-2">
                {["Low", "Medium", "High", "Urgent"].map(p => {
                  const cnt = tasks.filter(t => t.priority === p).length;
                  const pct = totalTasks > 0 ? Math.round((cnt / totalTasks) * 100) : 0;
                  return (
                    <div key={p} className="flex items-center gap-2">
                      <span className="text-xs w-14 text-gray-500">{p}</span>
                      <div className="flex-1 ff-progress-bar">
                        <div className="ff-progress-fill" style={{ width: `${pct}%`, background: PRIORITY_COLORS[p] }}></div>
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="ff-card p-5">
          <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.to} to={a.to}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${a.color}15` }}>
                  <i className={`${a.icon}`} style={{ color: a.color }}></i>
                </div>
                <span className="text-xs font-500 text-gray-600 text-center" style={{ fontWeight: 500 }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="ff-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-gray-800" style={{ fontWeight: 600 }}>Recent Tasks</h3>
            <Link to="/tasks" className="text-xs text-indigo-600 hover:text-indigo-700 font-500" style={{ fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-8 h-8 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="skeleton h-3 w-48 mb-2 rounded"></div>
                    <div className="skeleton h-3 w-24 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <i className="fa-solid fa-clipboard text-3xl text-gray-200 mb-3"></i>
              <p className="text-gray-400 text-sm">No tasks yet. Create your first task!</p>
              <Link to="/tasks" className="ff-btn ff-btn-primary mt-3 text-sm py-2 px-4">
                + Add Task
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map(task => {
                const statusColors = {
                  todo: { bg: "#EEF2FF", text: "#4F46E5", label: "To Do" },
                  inprogress: { bg: "#FFFBEB", text: "#D97706", label: "In Progress" },
                  review: { bg: "#EFF6FF", text: "#2563EB", label: "Review" },
                  completed: { bg: "#F0FDF4", text: "#16A34A", label: "Done" },
                };
                const sc = statusColors[task.kanbanStatus] || statusColors.todo;
                return (
                  <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: sc.bg }}>
                      <i className={`fa-solid ${task.kanbanStatus === "completed" ? "fa-check" : "fa-circle-dot"} text-sm`}
                        style={{ color: sc.text }}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-500 truncate ${task.kanbanStatus === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}
                        style={{ fontWeight: 500 }}>
                        {task.taskName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="ff-badge" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                        <span className="ff-badge"
                          style={{ background: PRIORITY_COLORS[task.priority] + "18", color: PRIORITY_COLORS[task.priority] }}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-400">
                            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category chart + Habit summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="ff-card p-5">
          <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Tasks by Category</h3>
          {loading ? (
            <div className="skeleton h-40 w-full rounded-xl"></div>
          ) : categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No task data yet</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={4} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }}></div>
                    <span className="text-xs text-gray-600 flex-1">{c.name}</span>
                    <span className="text-xs font-500 text-gray-800" style={{ fontWeight: 500 }}>{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Habit summary */}
        <div className="ff-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-gray-800" style={{ fontWeight: 600 }}>Today's Habits</h3>
            <Link to="/habits" className="text-xs text-indigo-600 hover:text-indigo-700 font-500" style={{ fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-xl"></div>)}
            </div>
          ) : habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <i className="fa-solid fa-fire text-3xl text-gray-200 mb-3"></i>
              <p className="text-gray-400 text-sm">No habits yet. Start tracking!</p>
              <Link to="/habits" className="ff-btn ff-btn-primary mt-3 text-sm py-2 px-4">
                + Add Habit
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 5).map(h => {
                const todayStatus = h.dates?.find(d => d.date === todayStr)?.complete;
                return (
                  <div key={h._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                      style={{
                        background: todayStatus === "yes" ? "#F0FDF4" : todayStatus === "no" ? "#FEF2F2" : "#F3F4F6"
                      }}>
                      <i className={`fa-solid ${todayStatus === "yes" ? "fa-check text-green-500" : todayStatus === "no" ? "fa-times text-red-400" : "fa-minus text-gray-300"} text-sm`}></i>
                    </div>
                    <span className="text-sm text-gray-700 flex-1 truncate">{h.content}</span>
                    {h.favorite && <i className="fa-solid fa-star text-yellow-400 text-xs"></i>}
                  </div>
                );
              })}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Completed today</span>
                  <span className="font-600 text-green-600" style={{ fontWeight: 600 }}>{habitsToday} / {habits.length}</span>
                </div>
                <div className="ff-progress-bar mt-2">
                  <div className="ff-progress-fill" style={{ width: `${habits.length > 0 ? (habitsToday / habits.length) * 100 : 0}%`, background: "#22C55E" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

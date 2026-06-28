import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import baseURL from "../../environment";

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const PRIORITY_DOT = { Low: "#22C55E", Medium: "#F59E0B", High: "#EF4444", Urgent: "#7C3AED" };

function getTasksForDate(tasks, date) {
  return tasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d.getFullYear() === date.getFullYear()
      && d.getMonth() === date.getMonth()
      && d.getDate() === date.getDate();
  });
}

function MonthView({ year, month, tasks, onDayClick, selectedDay }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS_SHORT.map(d => (
          <div key={d} className="text-center text-xs font-600 text-gray-400 py-2" style={{ fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const date = new Date(year, month, day);
          const dayTasks = getTasksForDate(tasks, date);
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isSelected = selectedDay?.getDate() === day && selectedDay?.getMonth() === month && selectedDay?.getFullYear() === year;
          const isPast = date < today && !isToday;

          return (
            <button
              key={day}
              onClick={() => onDayClick(date)}
              className={`calendar-day relative flex flex-col items-center py-2 px-1 ${isToday ? "today" : ""} ${isSelected && !isToday ? "border-indigo-300 bg-indigo-50" : ""}`}
            >
              <span className={`text-sm leading-none mb-1 ${isPast && !isToday ? "text-gray-400" : ""}`}
                style={{ fontWeight: isToday ? 700 : 400 }}>
                {day}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center max-w-full">
                  {dayTasks.slice(0, 3).map((t, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: isToday ? "white" : PRIORITY_DOT[t.priority] || "#4F46E5" }}></div>
                  ))}
                  {dayTasks.length > 3 && (
                    <span className={`text-xs leading-none ${isToday ? "text-white" : "text-indigo-400"}`}>+{dayTasks.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ baseDate, tasks, onDayClick, selectedDay }) {
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  const today = new Date();

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, i) => {
          const dayTasks = getTasksForDate(tasks, date);
          const isToday = today.toDateString() === date.toDateString();
          const isSelected = selectedDay?.toDateString() === date.toDateString();
          return (
            <button key={i} onClick={() => onDayClick(date)}
              className={`flex flex-col items-center rounded-2xl p-3 border transition-all ${isToday ? "border-indigo-400 bg-indigo-50" : isSelected ? "border-indigo-200 bg-indigo-50/50" : "border-gray-100 hover:bg-gray-50"}`}>
              <span className="text-xs text-gray-400 mb-1">{WEEKDAYS_SHORT[date.getDay()]}</span>
              <span className={`text-lg font-600 leading-none mb-2 ${isToday ? "text-indigo-600" : "text-gray-800"}`}
                style={{ fontWeight: 600 }}>
                {date.getDate()}
              </span>
              <div className="space-y-1 w-full">
                {dayTasks.slice(0, 2).map((t, ti) => (
                  <div key={ti} className="text-xs truncate px-1.5 py-0.5 rounded-md"
                    style={{ background: PRIORITY_DOT[t.priority] + "20", color: PRIORITY_DOT[t.priority] }}>
                    {t.taskName}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-indigo-400 text-center">+{dayTasks.length - 2} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayView({ date, tasks }) {
  const dayTasks = getTasksForDate(tasks, date);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div>
      <h3 className="text-base font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>
        {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </h3>
      {dayTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <i className="fa-solid fa-calendar-xmark text-4xl text-gray-200 mb-3"></i>
          <p className="text-gray-400 text-sm">No tasks due on this day</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayTasks.map(t => (
            <div key={t._id} className="ff-card p-4 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ background: PRIORITY_DOT[t.priority] || "#4F46E5" }}></div>
              <div className="flex-1">
                <p className="font-500 text-gray-800 text-sm" style={{ fontWeight: 500 }}>{t.taskName}</p>
                {t.description && <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>}
                <div className="flex gap-2 mt-2">
                  <span className="ff-badge ff-badge-gray text-xs">{t.category || "Work"}</span>
                  <span className="ff-badge text-xs"
                    style={{ background: PRIORITY_DOT[t.priority] + "18", color: PRIORITY_DOT[t.priority] }}>
                    {t.priority}
                  </span>
                  <span className={`ff-badge text-xs ${t.kanbanStatus === "completed" ? "ff-badge-success" : "ff-badge-primary"}`}>
                    {t.kanbanStatus === "completed" ? "Done" : t.kanbanStatus === "inprogress" ? "In Progress" : t.kanbanStatus === "review" ? "Review" : "To Do"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    axios.get(`${baseURL}/api/tasks`, { withCredentials: true })
      .then(r => setTasks(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    else if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  const getTitle = () => {
    if (view === "month") return `${MONTHS[month]} ${year}`;
    if (view === "week") {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  // Upcoming tasks
  const upcomingTasks = [...tasks]
    .filter(t => t.dueDate && new Date(t.dueDate) >= new Date() && t.kanbanStatus !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Panel */}
        <div className="lg:col-span-3 ff-card p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-chevron-left text-gray-500 text-sm"></i>
              </button>
              <h2 className="text-lg font-600 text-gray-800 min-w-48 text-center" style={{ fontWeight: 600 }}>
                {getTitle()}
              </h2>
              <button onClick={() => navigate(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-chevron-right text-gray-500 text-sm"></i>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={goToday}
                className="ff-btn ff-btn-secondary text-sm py-1.5 px-3">
                Today
              </button>
              <div className="ff-tabs" style={{ padding: "3px" }}>
                {["month", "week", "day"].map(v => (
                  <button key={v} className={`ff-tab ${view === v ? "active" : ""}`}
                    onClick={() => setView(v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Body */}
          {loading ? (
            <div className="skeleton h-96 w-full rounded-2xl"></div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={`${view}-${currentDate.toISOString()}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                {view === "month" && (
                  <MonthView year={year} month={month} tasks={tasks}
                    onDayClick={setSelectedDay} selectedDay={selectedDay} />
                )}
                {view === "week" && (
                  <WeekView baseDate={currentDate} tasks={tasks}
                    onDayClick={setSelectedDay} selectedDay={selectedDay} />
                )}
                {view === "day" && (
                  <DayView date={currentDate} tasks={tasks} />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Selected day tasks (month/week views) */}
          {view !== "day" && selectedDay && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="text-sm font-600 text-gray-700 mb-3" style={{ fontWeight: 600 }}>
                {selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <DayView date={selectedDay} tasks={tasks} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Mini upcoming */}
          <div className="ff-card p-4">
            <h3 className="text-sm font-600 text-gray-800 mb-3" style={{ fontWeight: 600 }}>
              <i className="fa-solid fa-clock-rotate-left text-indigo-400 mr-2"></i>
              Upcoming Deadlines
            </h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-lg"></div>)}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No upcoming deadlines</p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map(t => {
                  const due = new Date(t.dueDate);
                  const daysLeft = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={t._id} className="flex items-start gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-1.5 h-full min-h-4 rounded-full mt-1 flex-shrink-0"
                        style={{ background: PRIORITY_DOT[t.priority] || "#4F46E5" }}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-500 text-gray-700 truncate" style={{ fontWeight: 500 }}>{t.taskName}</p>
                        <p className={`text-xs mt-0.5 ${daysLeft <= 1 ? "text-red-500" : daysLeft <= 3 ? "text-orange-500" : "text-gray-400"}`}>
                          {daysLeft === 0 ? "Due today" : daysLeft === 1 ? "Due tomorrow" : `${daysLeft} days left`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Month summary */}
          <div className="ff-card p-4">
            <h3 className="text-sm font-600 text-gray-800 mb-3" style={{ fontWeight: 600 }}>
              <i className="fa-solid fa-chart-bar text-indigo-400 mr-2"></i>
              {MONTHS[month]} Summary
            </h3>
            {(() => {
              const monthTasks = tasks.filter(t => {
                if (!t.dueDate) return false;
                const d = new Date(t.dueDate);
                return d.getFullYear() === year && d.getMonth() === month;
              });
              const done = monthTasks.filter(t => t.kanbanStatus === "completed").length;
              const pct = monthTasks.length > 0 ? Math.round((done / monthTasks.length) * 100) : 0;
              return (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total tasks</span>
                    <span className="font-500 text-gray-800" style={{ fontWeight: 500 }}>{monthTasks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Completed</span>
                    <span className="font-500 text-green-600" style={{ fontWeight: 500 }}>{done}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="ff-progress-bar">
                      <div className="ff-progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

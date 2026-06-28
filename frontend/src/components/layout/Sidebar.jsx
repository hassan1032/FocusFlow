import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import baseURL from "../../environment";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", icon: "fa-solid fa-chart-line", label: "Dashboard" },
      { to: "/tasks", icon: "fa-solid fa-kanban", label: "Kanban Board" },
      { to: "/calendar", icon: "fa-solid fa-calendar-days", label: "Calendar" },
    ],
  },
  {
    label: "Productivity",
    items: [
      { to: "/pomodora", icon: "fa-solid fa-clock", label: "Pomodoro" },
      { to: "/habits", icon: "fa-solid fa-fire", label: "Habits" },
      { to: "/goals", icon: "fa-solid fa-bullseye", label: "Goals" },
      { to: "/notes", icon: "fa-solid fa-sticky-note", label: "Notes" },
    ],
  },
  {
    label: "Learning",
    items: [
      { to: "/flashcard", icon: "fa-solid fa-cards-blank", label: "Flashcards" },
      { to: "/text", icon: "fa-solid fa-wand-magic-sparkles", label: "AI Summary" },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${baseURL}/logout`, { method: "POST", credentials: "include" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? "mobile-open" : ""}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
            <i className="fa-solid fa-bolt text-white text-base"></i>
          </div>
          <span className="text-lg font-700 text-gray-900" style={{ fontWeight: 700 }}>
            Focus<span style={{ color: "#4F46E5" }}>Flow</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="text-xs font-600 uppercase tracking-wider px-3 mb-1"
                style={{ color: "#9CA3AF", fontWeight: 600 }}>
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = location.pathname === item.to ||
                  (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`nav-item ${active ? "active" : ""}`}
                  >
                    <i className={`${item.icon} text-base w-5 text-center`}
                      style={{ color: active ? "#4F46E5" : "#9CA3AF" }}></i>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "#4F46E5" }}></span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 p-3">
          <Link to="/profile" onClick={onClose}
            className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-600"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", fontWeight: 600 }}>
              {storedUser.username ? storedUser.username[0].toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-500 text-gray-800 truncate" style={{ fontWeight: 500 }}>
                {storedUser.username || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">{storedUser.email || ""}</p>
            </div>
          </Link>
          <Link to="/settings" onClick={onClose}
            className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`}>
            <i className="fa-solid fa-gear text-base w-5 text-center" style={{ color: "#9CA3AF" }}></i>
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="nav-item w-full text-left">
            <i className="fa-solid fa-right-from-bracket text-base w-5 text-center"
              style={{ color: "#EF4444" }}></i>
            <span style={{ color: "#EF4444" }}>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

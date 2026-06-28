import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../environment";

export default function TopBar({ onToggleSidebar, pageTitle }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length < 2) { setResults([]); setShowResults(false); return; }
    try {
      const [notesRes, tasksRes] = await Promise.all([
        axios.get(`${baseURL}/api/note/search?query=${encodeURIComponent(val)}`, { withCredentials: true }),
        axios.get(`${baseURL}/api/tasks`, { withCredentials: true }),
      ]);
      const notes = (notesRes.data.notes || [])
        .slice(0, 3)
        .map(n => ({ type: "note", id: n._id, title: n.title, path: "/notes" }));
      const tasks = (tasksRes.data || [])
        .filter(t => t.taskName?.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 3)
        .map(t => ({ type: "task", id: t._id, title: t.taskName, path: "/tasks" }));
      setResults([...notes, ...tasks]);
      setShowResults(true);
    } catch {
      setResults([]);
    }
  };

  return (
    <header className="app-topbar">
      {/* Menu toggle */}
      <button
        onClick={onToggleSidebar}
        className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <i className="fa-solid fa-bars text-gray-500"></i>
      </button>

      {/* Page title — desktop */}
      {pageTitle && (
        <h1 className="hidden md:block text-base font-600 text-gray-800 mr-6"
          style={{ fontWeight: 600 }}>
          {pageTitle}
        </h1>
      )}

      {/* Search */}
      <div className="flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search tasks, notes..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => search.length >= 2 && setShowResults(true)}
            className="ff-input pl-9 pr-4 h-9 text-sm"
          />
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slide-down">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => { navigate(r.path); setShowResults(false); setSearch(""); }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className={`ff-badge ${r.type === "note" ? "ff-badge-info" : "ff-badge-primary"}`}>
                  {r.type === "note" ? "Note" : "Task"}
                </span>
                <span className="text-sm text-gray-700 truncate">{r.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => navigate("/settings")}>
          <i className="fa-solid fa-bell text-gray-500"></i>
        </button>

        {/* Avatar */}
        <Link to="/profile">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-600 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", fontWeight: 600 }}>
            {storedUser.username ? storedUser.username[0].toUpperCase() : "U"}
          </div>
        </Link>
      </div>
    </header>
  );
}

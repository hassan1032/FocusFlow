import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import baseURL from "../../environment";

const TABS = ["Account", "Notifications", "Security", "About"];

const NOTIFICATION_OPTIONS = [
  { key: "taskReminders",  label: "Task reminders",   desc: "Get notified when tasks are due" },
  { key: "habitReminders", label: "Habit reminders",  desc: "Daily reminders to track habits" },
  { key: "pomodoroAlerts", label: "Pomodoro alerts",  desc: "Sound alerts when sessions end" },
  { key: "goalUpdates",    label: "Goal updates",     desc: "Weekly progress reports" },
  { key: "weeklyDigest",   label: "Weekly digest",    desc: "Summary of your weekly performance" },
];

function ConfirmModal({ title, message, confirmLabel = "Confirm", danger = false, onConfirm, onCancel, children }) {
  return (
    <div className="ff-modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="ff-modal p-6 max-w-sm w-full text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-100" : "bg-indigo-100"}`}>
          <i className={`fa-solid ${danger ? "fa-triangle-exclamation text-red-500" : "fa-question text-indigo-500"} text-xl`}></i>
        </div>
        <h3 className="text-lg font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        {children}
        <div className="flex gap-3 mt-2">
          <button onClick={onCancel} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
          <button onClick={onConfirm} className={`ff-btn flex-1 ${danger ? "ff-btn-danger" : "ff-btn-primary"}`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  // Account form
  const [username, setUsername] = useState(user.username || "");
  const [accountLoading, setAccountLoading] = useState(false);

  // Password form
  const [newPsw, setNewPsw] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const [pswLoading, setPswLoading] = useState(false);
  const [showNewPsw, setShowNewPsw] = useState(false);
  const [showConfirmPsw, setShowConfirmPsw] = useState(false);

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications (persisted in localStorage)
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ff_notifications") || "{}");
    } catch { return {}; }
  });
  const getNotif = (key) => notifications[key] !== false; // default true

  const handleSaveAccount = async () => {
    if (!username.trim()) { toast.error("Username is required"); return; }
    if (username.trim() === user.username) { toast.info("No changes to save"); return; }
    setAccountLoading(true);
    try {
      const { data } = await axios.patch(`${baseURL}/api/user/profile`,
        { username: username.trim() },
        { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (data.success) {
        const updatedUser = { ...user, username: data.user.username };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setAccountLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPsw || !confirmPsw) { toast.error("All fields are required"); return; }
    if (newPsw !== confirmPsw) { toast.error("Passwords don't match"); return; }
    if (newPsw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setPswLoading(true);
    try {
      const { data } = await axios.post(`${baseURL}/forgetPassword`,
        { email: user.email, password: newPsw, confirmPassword: confirmPsw },
        { withCredentials: true }
      );
      if (data.message?.toLowerCase().includes("success")) {
        setNewPsw(""); setConfirmPsw("");
        toast.success("Password updated successfully!");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPswLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== user.username) {
      toast.error("Username doesn't match"); return;
    }
    setDeleteLoading(true);
    try {
      await axios.delete(`${baseURL}/api/user/account`,
        { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      localStorage.clear();
      toast.success("Account deleted. Goodbye!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !getNotif(key) };
    setNotifications(updated);
    localStorage.setItem("ff_notifications", JSON.stringify(updated));
    toast.success(`${NOTIFICATION_OPTIONS.find(o => o.key === key)?.label} ${!getNotif(key) ? "enabled" : "disabled"}`);
  };

  const handleRequestNotification = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") toast.success("Browser notifications enabled!");
      else toast.warning("Notification permission denied");
    } else {
      toast.error("Browser notifications not supported");
    }
  };

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "U";

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="ff-card p-4">
            <div className="flex flex-col items-center text-center p-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-700 mb-3"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", fontWeight: 700 }}>
                {initials}
              </div>
              <p className="font-600 text-gray-800 text-sm" style={{ fontWeight: 600 }}>{user.username}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
              <span className={`ff-badge mt-2 ${user.isVerified !== false ? "ff-badge-success" : "ff-badge-warning"}`}>
                <i className={`fa-solid ${user.isVerified !== false ? "fa-circle-check" : "fa-clock"} mr-1 text-xs`}></i>
                {user.isVerified !== false ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="space-y-1">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`nav-item w-full text-left ${activeTab === tab ? "active" : ""}`}>
                  <i className={`text-base w-5 text-center fa-solid ${
                    tab === "Account" ? "fa-user" :
                    tab === "Notifications" ? "fa-bell" :
                    tab === "Security" ? "fa-shield" : "fa-info-circle"
                  }`} style={{ color: activeTab === tab ? "#4F46E5" : "#9CA3AF" }}></i>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>

              {/* ===== Account Tab ===== */}
              {activeTab === "Account" && (
                <div className="space-y-4">
                  <div className="ff-card p-6">
                    <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                          Username
                        </label>
                        <input className="ff-input" value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="Your display name" />
                      </div>
                      <div>
                        <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                          Email Address
                        </label>
                        <input className="ff-input" value={user.email || ""} disabled
                          style={{ background: "#F9FAFB", color: "#9CA3AF" }} />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                      <button onClick={handleSaveAccount} disabled={accountLoading}
                        className="ff-btn ff-btn-primary">
                        {accountLoading
                          ? <><i className="fa-solid fa-spinner animate-spin text-sm mr-1"></i>Saving...</>
                          : <><i className="fa-solid fa-check text-sm mr-1"></i>Save Changes</>}
                      </button>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="ff-card p-6" style={{ borderColor: "#FEE2E2", border: "1px solid #FEE2E2" }}>
                    <h3 className="font-600 text-red-600 mb-1" style={{ fontWeight: 600 }}>Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </p>
                    <button onClick={() => { setDeleteInput(""); setDeleteConfirm(true); }}
                      className="ff-btn ff-btn-danger">
                      <i className="fa-solid fa-trash text-sm mr-1"></i> Delete My Account
                    </button>
                  </div>
                </div>
              )}

              {/* ===== Notifications Tab ===== */}
              {activeTab === "Notifications" && (
                <div className="ff-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-600 text-gray-800" style={{ fontWeight: 600 }}>Notification Settings</h3>
                    <button onClick={handleRequestNotification}
                      className="ff-btn ff-btn-secondary text-sm py-1.5 px-3">
                      <i className="fa-solid fa-bell text-sm mr-1"></i>Enable Browser
                    </button>
                  </div>
                  <div className="space-y-2">
                    {NOTIFICATION_OPTIONS.map(opt => (
                      <div key={opt.key}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleNotification(opt.key)}>
                        <div>
                          <p className="font-500 text-gray-800 text-sm" style={{ fontWeight: 500 }}>{opt.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                        </div>
                        <div className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0`}
                          style={{ background: getNotif(opt.key) ? "#4F46E5" : "#D1D5DB" }}>
                          <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                            style={{ left: getNotif(opt.key) ? "22px" : "2px" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== Security Tab ===== */}
              {activeTab === "Security" && (
                <div className="space-y-4">
                  <div className="ff-card p-6">
                    <h3 className="font-600 text-gray-800 mb-4" style={{ fontWeight: 600 }}>Change Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                          New Password
                        </label>
                        <div className="relative">
                          <input type={showNewPsw ? "text" : "password"} className="ff-input pr-10"
                            placeholder="At least 6 characters"
                            value={newPsw} onChange={e => setNewPsw(e.target.value)} />
                          <button type="button" onClick={() => setShowNewPsw(!showNewPsw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i className={`fa-solid ${showNewPsw ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input type={showConfirmPsw ? "text" : "password"} className="ff-input pr-10"
                            placeholder="Repeat new password"
                            value={confirmPsw} onChange={e => setConfirmPsw(e.target.value)} />
                          <button type="button" onClick={() => setShowConfirmPsw(!showConfirmPsw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i className={`fa-solid ${showConfirmPsw ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                          </button>
                        </div>
                        {confirmPsw && newPsw !== confirmPsw && (
                          <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                        )}
                      </div>
                      <button type="submit" disabled={pswLoading || (confirmPsw && newPsw !== confirmPsw)}
                        className="ff-btn ff-btn-primary">
                        {pswLoading
                          ? <><i className="fa-solid fa-spinner animate-spin text-sm mr-1"></i>Updating...</>
                          : <><i className="fa-solid fa-lock text-sm mr-1"></i>Update Password</>}
                      </button>
                    </form>
                  </div>

                  <div className="ff-card p-6">
                    <h3 className="font-600 text-gray-800 mb-3" style={{ fontWeight: 600 }}>Account Security</h3>
                    <div className="space-y-3">
                      {[
                        { icon: "fa-envelope-circle-check", label: "Email verified",   ok: user.isVerified !== false },
                        { icon: "fa-key",                   label: "Password set",      ok: true },
                        { icon: "fa-shield-halved",         label: "Two-factor auth",   ok: false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <i className={`fa-solid ${s.icon} text-sm`} style={{ color: s.ok ? "#22C55E" : "#9CA3AF" }}></i>
                          <span className="text-sm text-gray-700 flex-1">{s.label}</span>
                          <span className={`ff-badge text-xs ${s.ok ? "ff-badge-success" : "ff-badge-gray"}`}>
                            {s.ok ? "Active" : "Not set"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== About Tab ===== */}
              {activeTab === "About" && (
                <div className="ff-card p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                      <i className="fa-solid fa-bolt text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-700 text-gray-900" style={{ fontWeight: 700 }}>FocusFlow</h3>
                    <p className="text-sm text-gray-500 mt-1">Version 2.0.0 — Premium Productivity Platform</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Task Management",  icon: "fa-list-check",           desc: "Kanban board with drag & drop" },
                      { label: "Habit Tracking",   icon: "fa-fire",                 desc: "Daily streak tracking" },
                      { label: "Goal Setting",     icon: "fa-bullseye",             desc: "Milestones & progress tracking" },
                      { label: "Pomodoro Timer",   icon: "fa-clock",                desc: "Focus sessions with breaks" },
                      { label: "Notes",            icon: "fa-sticky-note",          desc: "Rich text note taking" },
                      { label: "AI Summary",       icon: "fa-wand-magic-sparkles",  desc: "Powered by HuggingFace" },
                      { label: "Flashcards",       icon: "fa-cards-blank",          desc: "Spaced repetition learning" },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                          <i className={`fa-solid ${f.icon} text-sm`} style={{ color: "#4F46E5" }}></i>
                        </div>
                        <div>
                          <p className="text-sm font-500 text-gray-800" style={{ fontWeight: 500 }}>{f.label}</p>
                          <p className="text-xs text-gray-400">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                      Built with ❤️ · React + Node.js + MongoDB
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <ConfirmModal
            title="Delete Account"
            message={`This will permanently delete your account, tasks, habits, notes, and goals. Type your username "${user.username}" to confirm.`}
            confirmLabel={deleteLoading ? "Deleting..." : "Delete Forever"}
            danger
            onConfirm={handleDeleteAccount}
            onCancel={() => setDeleteConfirm(false)}>
            <input
              className="ff-input mb-3 text-sm"
              placeholder={`Type "${user.username}" to confirm`}
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
            />
          </ConfirmModal>
        )}
      </AnimatePresence>
    </div>
  );
}

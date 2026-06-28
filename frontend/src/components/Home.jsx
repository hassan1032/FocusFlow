import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import baseURL from "../environment";

const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

const FEATURES = [
  {
    icon: "fa-solid fa-chart-line",     color: "#4F46E5", bg: "#EEF2FF",
    title: "Analytics Dashboard",
    desc: "Track productivity scores, task completion rates, and weekly progress with beautiful charts.",
  },
  {
    icon: "fa-solid fa-kanban",          color: "#22C55E", bg: "#F0FDF4",
    title: "Kanban Board",
    desc: "Drag-and-drop task management with To Do, In Progress, Review, and Done columns.",
  },
  {
    icon: "fa-solid fa-clock",           color: "#F59E0B", bg: "#FFFBEB",
    title: "Pomodoro Timer",
    desc: "Boost focus with 25-minute work sessions, custom timers, and break management.",
  },
  {
    icon: "fa-solid fa-fire",            color: "#EF4444", bg: "#FEF2F2",
    title: "Habit Tracker",
    desc: "Build consistency with daily habit tracking, weekly streaks, and completion stats.",
  },
  {
    icon: "fa-solid fa-bullseye",        color: "#7C3AED", bg: "#FAF5FF",
    title: "Goal Setting",
    desc: "Set short and long-term goals with milestones, progress bars, and deadline tracking.",
  },
  {
    icon: "fa-solid fa-calendar-days",   color: "#0EA5E9", bg: "#EFF6FF",
    title: "Calendar View",
    desc: "Visualize your schedule with monthly, weekly, and daily views with task indicators.",
  },
  {
    icon: "fa-solid fa-sticky-note",     color: "#4F46E5", bg: "#EEF2FF",
    title: "Smart Notes",
    desc: "Capture ideas with rich note-taking, pinning, tagging, and full-text search.",
  },
  {
    icon: "fa-solid fa-wand-magic-sparkles", color: "#22C55E", bg: "#F0FDF4",
    title: "AI Text Summary",
    desc: "Instantly summarize long articles and documents using AI-powered NLP.",
  },
];

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "500K+", label: "Tasks Completed" },
  { value: "4.9★", label: "User Rating" },
  { value: "99.9%", label: "Uptime" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    avatar: "PS",
    text: "FocusFlow completely transformed my productivity. The Kanban board and Pomodoro timer together are a game changer!",
    color: "#4F46E5",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    avatar: "RV",
    text: "The habit tracker keeps me accountable. I've maintained a 30-day streak and feel more consistent than ever.",
    color: "#22C55E",
  },
  {
    name: "Aisha Khan",
    role: "Student",
    avatar: "AK",
    text: "The AI summary + flashcards combo is incredible for studying. Saved me hours every week!",
    color: "#F59E0B",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (isLoggedIn) {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setUsername(stored.username || "");
    }
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F8FAFC" }}>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0E2E 0%, #1a1756 50%, #0F0E2E 100%)" }}>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
            style={{ background: "#4F46E5", filter: "blur(80px)" }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
            style={{ background: "#7C3AED", filter: "blur(100px)" }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <motion.div {...FadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.4)" }}>
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "float 2s infinite" }}></div>
                <span className="text-sm text-indigo-300 font-500" style={{ fontWeight: 500 }}>
                  Premium Productivity Platform
                </span>
              </motion.div>

              <motion.h1 {...FadeUp(0.1)} className="text-4xl lg:text-6xl font-800 text-white leading-tight mb-6"
                style={{ fontWeight: 800 }}>
                Build Better Habits,<br />
                <span style={{ color: "#818CF8" }}>Stay Focused,</span><br />
                <span style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Achieve More.
                </span>
              </motion.h1>

              <motion.p {...FadeUp(0.2)} className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                FocusFlow is your all-in-one productivity platform — tasks, habits, goals, notes,
                Pomodoro timer, and AI tools in one beautiful interface.
              </motion.p>

              <motion.div {...FadeUp(0.3)} className="flex flex-col sm:flex-row gap-3">
                {isLoggedIn ? (
                  <button onClick={() => navigate("/dashboard")}
                    className="ff-btn text-white text-base px-8 py-3"
                    style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 32px rgba(79,70,229,0.4)" }}>
                    Go to Dashboard
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                ) : (
                  <>
                    <Link to="/signup"
                      className="ff-btn text-white text-base px-8 py-3"
                      style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 32px rgba(79,70,229,0.4)" }}>
                      Get Started Free
                      <i className="fa-solid fa-arrow-right ml-2"></i>
                    </Link>
                    <Link to="/login"
                      className="ff-btn text-white text-base px-8 py-3"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      Sign In
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Social proof */}
              <motion.div {...FadeUp(0.4)} className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  {["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-600 text-white"
                      style={{ background: c, fontWeight: 600 }}>
                      {["S", "A", "R", "P"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => <i key={i} className="fa-solid fa-star text-xs"></i>)}
                  </div>
                  <p className="text-gray-400 text-xs">Loved by 10,000+ professionals</p>
                </div>
              </motion.div>
            </div>

            {/* Right — feature cards preview */}
            <motion.div {...FadeUp(0.2)} className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: "fa-solid fa-chart-line", label: "Dashboard", val: "97%", sub: "Productivity", color: "#4F46E5" },
                { icon: "fa-solid fa-fire", label: "Habits", val: "21 🔥", sub: "Day streak", color: "#EF4444" },
                { icon: "fa-solid fa-clock", label: "Focus Time", val: "4h 20m", sub: "Today", color: "#F59E0B" },
                { icon: "fa-solid fa-check-circle", label: "Tasks", val: "12/15", sub: "Completed", color: "#22C55E" },
              ].map((c, i) => (
                <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-2xl p-5 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)"
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: c.color + "25" }}>
                      <i className={`${c.icon} text-sm`} style={{ color: c.color }}></i>
                    </div>
                    <span className="text-gray-300 text-sm">{c.label}</span>
                  </div>
                  <p className="text-white text-2xl font-700 mb-0.5" style={{ fontWeight: 700 }}>{c.val}</p>
                  <p className="text-gray-400 text-xs">{c.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-b border-gray-200" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <p className="text-3xl font-700 text-gray-900" style={{ fontWeight: 700, color: "#4F46E5" }}>{s.value}</p>
                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" style={{ background: "#F8FAFC" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...FadeUp(0)} className="text-center mb-12">
            <span className="ff-badge ff-badge-primary text-sm mb-3 inline-block">Everything you need</span>
            <h2 className="text-3xl lg:text-4xl font-700 text-gray-900 mb-4" style={{ fontWeight: 700 }}>
              A complete productivity ecosystem
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Replace 5+ apps with one powerful platform that keeps all your productivity tools in sync.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="ff-card p-5 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: f.bg }}>
                  <i className={`${f.icon} text-xl`} style={{ color: f.color }}></i>
                </div>
                <h3 className="font-600 text-gray-800 mb-2 text-sm" style={{ fontWeight: 600 }}>{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...FadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl font-700 text-gray-900 mb-4" style={{ fontWeight: 700 }}>
              Get started in 3 simple steps
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "fa-solid fa-user-plus", title: "Create Account", desc: "Sign up for free in seconds. No credit card needed.", color: "#4F46E5" },
              { step: "02", icon: "fa-solid fa-sliders", title: "Set Up Your Workspace", desc: "Add your tasks, habits, and goals. Customize everything.", color: "#22C55E" },
              { step: "03", icon: "fa-solid fa-rocket", title: "Start Achieving", desc: "Track progress daily and unlock your full potential.", color: "#F59E0B" },
            ].map((s, i) => (
              <motion.div key={i} {...FadeUp(i * 0.15)} className="text-center">
                <div className="relative inline-block mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{ background: s.color + "15" }}>
                    <i className={`${s.icon} text-2xl`} style={{ color: s.color }}></i>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 text-xs font-700 flex items-center justify-center"
                    style={{ borderColor: s.color, color: s.color, fontWeight: 700 }}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6" style={{ background: "#F8FAFC" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...FadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl font-700 text-gray-900 mb-4" style={{ fontWeight: 700 }}>
              Loved by professionals
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...FadeUp(i * 0.1)} className="ff-card p-5">
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <i key={i} className="fa-solid fa-star text-xs"></i>)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-600"
                    style={{ background: t.color, fontWeight: 600 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-500 text-gray-800 text-sm" style={{ fontWeight: 500 }}>{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #0F0E2E, #1a1756)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...FadeUp(0)}>
            <h2 className="text-3xl lg:text-5xl font-700 text-white mb-4" style={{ fontWeight: 700 }}>
              Ready to unlock your<br />
              <span style={{ color: "#818CF8" }}>full potential?</span>
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of professionals who use FocusFlow to stay productive.
            </p>
            {isLoggedIn ? (
              <button onClick={() => navigate("/dashboard")}
                className="ff-btn text-white text-lg px-10 py-4"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 32px rgba(79,70,229,0.5)" }}>
                Open Dashboard
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <Link to="/signup"
                className="ff-btn text-white text-lg px-10 py-4 inline-flex"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 32px rgba(79,70,229,0.5)" }}>
                Get Started Free
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            )}
            <p className="text-gray-500 text-sm mt-4">Free forever • No credit card required</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

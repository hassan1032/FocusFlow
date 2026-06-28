import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBrain, FaClock, FaClipboardList,
  FaLayerGroup, FaBookOpen, FaBolt,
  FaTasks, FaCalendarAlt, FaChartBar,
} from "react-icons/fa";

const features = [
  { Icon: FaBrain,         color: "#4F46E5", bg: "#EEF2FF", title: "Smart Flashcards",    desc: "Memorize concepts faster with interactive flashcards. Study individual decks, flip cards, and track what you know." },
  { Icon: FaClock,         color: "#22C55E", bg: "#F0FDF4", title: "Pomodoro Timer",       desc: "Stay focused with the proven 25/5 technique. Track sessions and build deep work habits automatically." },
  { Icon: FaClipboardList, color: "#F59E0B", bg: "#FFFBEB", title: "Habit Tracker",        desc: "Build daily routines with visual weekly tracking. See your streak, completion rate, and stay consistent." },
  { Icon: FaBookOpen,      color: "#7C3AED", bg: "#FAF5FF", title: "Smart Notes",          desc: "Capture ideas instantly. Search, tag, and organize your notes in one clean, distraction-free workspace." },
  { Icon: FaBolt,          color: "#EF4444", bg: "#FEF2F2", title: "AI Text Summarizer",   desc: "Paste any article or paper and get an instant AI-powered summary. Save hours of reading time." },
  { Icon: FaTasks,         color: "#0EA5E9", bg: "#EFF6FF", title: "Kanban Board",         desc: "Manage tasks with drag-and-drop. Organize by To Do, In Progress, and Done — stay on top of everything." },
  { Icon: FaCalendarAlt,   color: "#D97706", bg: "#FFFBEB", title: "Calendar View",        desc: "See all your tasks and goals on a monthly, weekly, or daily calendar. Never miss a deadline again." },
  { Icon: FaChartBar,      color: "#059669", bg: "#ECFDF5", title: "Progress Analytics",   desc: "Visual dashboards showing your productivity trends, habit streaks, and goal completion over time." },
  { Icon: FaLayerGroup,    color: "#8B5CF6", bg: "#FAF5FF", title: "All-in-One Platform",  desc: "No juggling between 5 different apps. Everything you need — study, plan, track — in one seamless dashboard." },
];

const problems = [
  { problem: "Scattered study tools across multiple apps",   solution: "One unified dashboard for all your learning" },
  { problem: "No way to track daily habits consistently",    solution: "Visual habit tracker with weekly streaks" },
  { problem: "Spending hours reading long articles",         solution: "AI summary in seconds — not hours" },
  { problem: "Forgetting what you studied last week",        solution: "Flashcard decks with flip-card review mode" },
  { problem: "Losing focus after 10 minutes of studying",   solution: "Pomodoro timer that builds deep focus" },
];

const testimonials = [
  { name: "David Foster",   role: "Engineering Student",  text: "FocusFlow transformed my final semester. The Pomodoro and habit tracker changed everything!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { name: "Emma James",     role: "Design Student",       text: "Balancing creative projects and academics became stress-free. Notes and timers in one place — perfect!", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" },
  { name: "Michael Davis",  role: "Remote Learner",       text: "FocusFlow gave me structure. I even use the AI summarizer for all my research papers now!", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face" },
];

export default function WhyFocusFlow() {
  return (
    <div style={{ background: "#F8FAFC", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            WHY FOCUSFLOW
          </span>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.2 }}>
            The Smarter Way to Study
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, maxWidth: 580, margin: "0 auto 32px" }}>
            In a world full of distractions, FocusFlow is your digital partner to reclaim focus,
            improve learning, and achieve your goals — all in one place.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup" style={{ background: "#fff", color: "#4F46E5", padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none" }}
              className="hover:shadow-lg transition-shadow">
              Get Started Free
            </Link>
            <Link to="/about" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
              Learn More
            </Link>
          </div>
        </motion.div>
        <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.08)", transform: "translate(40%, -40%)" }}></div>
      </section>

      {/* Problem vs Solution */}
      <section style={{ padding: "64px 24px", background: "#fff" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>The Problem We Solve</h2>
            <p style={{ color: "#6B7280", marginTop: 8, fontSize: 15 }}>Students face real challenges. FocusFlow addresses all of them.</p>
          </div>
          <div className="space-y-3">
            {problems.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", padding: "16px 20px", borderRadius: 14, border: "1px solid #E5E7EB", background: "#F8FAFC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", flexShrink: 0 }}></div>
                  <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>{p.problem}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-arrow-right text-xs" style={{ color: "#9CA3AF" }}></i>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }}></div>
                  <p style={{ color: "#111827", fontSize: 14, fontWeight: 500, margin: 0 }}>{p.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "64px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>Everything You Need to Succeed</h2>
            <p style={{ color: "#6B7280", marginTop: 8, fontSize: 15 }}>9 powerful tools built into one seamless platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E5E7EB" }}
                className="hover:shadow-md transition-shadow">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <f.Icon style={{ fontSize: 22, color: f.color }} />
                </div>
                <h3 style={{ fontWeight: 600, color: "#111827", marginBottom: 8, fontSize: 16 }}>{f.title}</h3>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", padding: "48px 24px" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "10K+",  label: "Active Students"  },
            { value: "500K+", label: "Tasks Completed"  },
            { value: "4.9★",  label: "Average Rating"   },
            { value: "9",     label: "Built-in Tools"   },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "64px 24px", background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>What Students Are Saying</h2>
            <p style={{ color: "#6B7280", marginTop: 8, fontSize: 15 }}>Real experiences from real learners</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                style={{ background: "#F8FAFC", borderRadius: 18, padding: 24, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[...Array(5)].map((_, j) => <i key={j} className="fa-solid fa-star text-xs" style={{ color: "#F59E0B" }}></i>)}
                </div>
                <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>{t.name}</p>
                    <p style={{ color: "#9CA3AF", fontSize: 12 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "72px 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Ready to Supercharge Your Study Life?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
            Join thousands of students using FocusFlow to achieve academic excellence.
          </p>
          <Link to="/signup"
            style={{ display: "inline-block", background: "#fff", color: "#4F46E5", padding: "13px 36px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none" }}
            className="hover:shadow-lg transition-shadow">
            Start for Free — No Credit Card
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

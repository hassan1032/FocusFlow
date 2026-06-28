import { useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import {
  SiReact, SiTailwindcss, SiNodedotjs,
  SiExpress, SiMongodb, SiJsonwebtokens,
} from "react-icons/si";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Suhana Chaudhary", role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1635366898830-b5d48950e4f6?w=500&auto=format&fit=crop&q=60",
    linkedin: "#", twitter: "#", instagram: "#",
    bio: "Visionary behind FocusFlow, driving innovation and clarity in productivity tools.",
    color: "#4F46E5",
  },
  {
    name: "Tanu Panwar", role: "Backend Engineer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60",
    linkedin: "#", twitter: "#", instagram: "#",
    bio: "Designing intuitive user experiences that make study sessions a delight.",
    color: "#22C55E",
  },
  {
    name: "Vansh Kumar Garg", role: "Frontend Engineer",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60",
    linkedin: "#", twitter: "#", instagram: "#",
    bio: "Building intelligent features like text summarizer and personalized recommendations.",
    color: "#F59E0B",
  },
];

const values = [
  { icon: "📌", title: "Simplicity",  desc: "We make productivity tools easy and intuitive to use."           },
  { icon: "🔒", title: "Privacy",     desc: "Your data stays yours. Always encrypted, never sold."            },
  { icon: "🚀", title: "Innovation",  desc: "Constantly evolving with smart AI-powered features."              },
  { icon: "💬", title: "Feedback",    desc: "We build what users actually need — your voice matters."          },
  { icon: "🎯", title: "Focus",       desc: "Helping students stay on track and distraction-free."             },
  { icon: "🤝", title: "Community",   desc: "Supporting a global learner network, together."                   },
];

const techStack = [
  { Icon: SiReact,        label: "React.js",   color: "#61DAFB", bg: "#EFF6FF" },
  { Icon: SiTailwindcss,  label: "Tailwind",   color: "#06B6D4", bg: "#ECFEFF" },
  { Icon: SiNodedotjs,    label: "Node.js",    color: "#22C55E", bg: "#F0FDF4" },
  { Icon: SiExpress,      label: "Express",    color: "#374151", bg: "#F9FAFB" },
  { Icon: SiMongodb,      label: "MongoDB",    color: "#4ADE80", bg: "#F0FDF4" },
  { Icon: SiJsonwebtokens,label: "JWT Auth",   color: "#8B5CF6", bg: "#FAF5FF" },
];

const stats = [
  { value: "10K+",  label: "Active Users" },
  { value: "500K+", label: "Tasks Completed" },
  { value: "4.9★",  label: "User Rating" },
  { value: "3",     label: "Team Members" },
];

export default function AboutUs() {
  return (
    <div style={{ background: "#F8FAFC", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "80px 24px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "4px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em" }}>
              OUR STORY
            </span>
            <h1 className="text-5xl font-bold text-white mt-4 mb-5" style={{ fontWeight: 700 }}>
              About FocusFlow
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "18px", lineHeight: 1.8, maxWidth: 680, margin: "0 auto" }}>
              We believe productivity isn't about discipline alone — it's about using the right tools.
              FocusFlow helps students and learners stay organized, focused, and stress-free.
            </p>
          </motion.div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
          style={{ background: "#fff", transform: "translate(40%, -40%)" }}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#fff", transform: "translate(-30%, 40%)" }}></div>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", padding: "40px 24px" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
              <p className="text-3xl" style={{ fontWeight: 700, color: "#4F46E5" }}>{s.value}</p>
              <p style={{ color: "#6B7280", fontSize: "14px", marginTop: 4 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "64px 24px" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <i className="fa-solid fa-bullseye" style={{ color: "#4F46E5" }}></i>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Our Mission</h2>
            <p style={{ color: "#6B7280", lineHeight: 1.8 }}>
              To help students and learners stay organized, focused, and stress-free by offering an all-in-one
              platform for habit tracking, flashcards, pomodoro sessions, notes, and AI-powered text summarization.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(79,70,229,0.25)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <i className="fa-solid fa-eye" style={{ color: "#fff" }}></i>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Our Vision</h2>
            <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}>
              To revolutionize how students manage their learning — blending simplicity with smart features,
              making academic success accessible to everyone, one click at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>Our Core Values</h2>
            <p style={{ color: "#6B7280", marginTop: 8, fontSize: 15 }}>The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                style={{ background: "#F8FAFC", borderRadius: 16, padding: 24, border: "1px solid #E5E7EB" }}
                className="hover:shadow-md transition-shadow">
                <span style={{ fontSize: 28 }}>{v.icon}</span>
                <h3 style={{ fontWeight: 600, color: "#111827", marginTop: 12, marginBottom: 6 }}>{v.title}</h3>
                <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: "64px 24px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Our Tech Stack</h2>
          <p style={{ color: "#6B7280", marginBottom: 40, fontSize: 15 }}>
            Built with modern, reliable, and scalable technologies.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-5">
            {techStack.map(({ Icon, label, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                style={{ background: bg, borderRadius: 16, padding: "20px 12px", textAlign: "center" }}
                className="hover:shadow-md transition-shadow cursor-default">
                <Icon style={{ fontSize: 36, color, margin: "0 auto" }} />
                <p style={{ fontSize: 12, color: "#374151", marginTop: 8, fontWeight: 500 }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>Meet the Team</h2>
            <p style={{ color: "#6B7280", marginTop: 8, fontSize: 15 }}>The people behind FocusFlow</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <motion.div key={m.name + i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #E5E7EB", background: "#fff" }}
                className="hover:shadow-lg transition-shadow text-center">
                <div style={{ height: 8, background: m.color }}></div>
                <div style={{ padding: "28px 24px" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", margin: "0 auto 16px", border: `3px solid ${m.color}` }}>
                    <img src={m.image} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 style={{ fontWeight: 600, color: "#111827", fontSize: 17 }}>{m.name}</h3>
                  <p style={{ color: m.color, fontSize: 13, fontWeight: 500, margin: "4px 0 10px" }}>{m.role}</p>
                  <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.7 }}>{m.bio}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
                    {[m.linkedin, m.twitter, m.instagram].map((link, j) => {
                      const icons = ["fa-linkedin", "fa-twitter", "fa-instagram"];
                      return (
                        <a key={j} href={link} target="_blank" rel="noopener noreferrer"
                          style={{ width: 32, height: 32, borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}
                          className="hover:shadow-md transition-shadow">
                          <i className={`fa-brands ${icons[j]} text-sm`}></i>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
          Ready to Transform Your Study Life?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 28, fontSize: 16 }}>
          Join thousands of learners using FocusFlow every day.
        </p>
        <Link to="/signup"
          style={{ display: "inline-block", background: "#fff", color: "#4F46E5", padding: "12px 32px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none" }}
          className="hover:shadow-lg transition-shadow">
          Get Started Free
        </Link>
      </section>
    </div>
  );
}

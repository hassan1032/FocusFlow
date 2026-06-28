import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "collection", icon: "fa-database", color: "#4F46E5", title: "Information We Collect",
    content: [
      "Email address for account creation, authentication, and optional newsletter subscriptions.",
      "User-generated data including notes, flashcards, habit logs, task lists, and study session records.",
      "Anonymous usage statistics (page visits, feature interactions) to improve performance and identify bugs.",
      "Session tokens stored in httpOnly cookies for secure authentication.",
    ],
  },
  {
    id: "usage", icon: "fa-chart-bar", color: "#22C55E", title: "How We Use Your Data",
    content: [
      "To personalize your FocusFlow dashboard and provide a tailored productivity experience.",
      "To send study reminders and productivity tips — only if you have enabled notifications.",
      "To improve feature performance, UI responsiveness, and overall application security.",
      "To communicate important account updates or changes to this policy.",
    ],
  },
  {
    id: "sharing", icon: "fa-shield-halved", color: "#F59E0B", title: "Data Sharing & Protection",
    content: [
      "We do not sell, rent, or share your personal data with third parties under any circumstances.",
      "All data is encrypted in transit using HTTPS and stored securely in encrypted databases.",
      "Passwords are hashed using bcrypt with a secure salt factor — we never store plain-text passwords.",
      "You can request full account deletion at any time via Settings → Account → Delete Account.",
    ],
  },
  {
    id: "cookies", icon: "fa-cookie-bite", color: "#7C3AED", title: "Cookies & Local Storage",
    content: [
      "We use httpOnly cookies to store JWT session tokens — this prevents XSS attacks.",
      "Local storage is used to cache user preferences such as notification settings and theme choices.",
      "No sensitive information such as passwords or personal identifiers is ever stored in local storage.",
      "You can clear all local storage data by clearing your browser cache at any time.",
    ],
  },
  {
    id: "rights", icon: "fa-user-shield", color: "#EF4444", title: "Your Rights",
    content: [
      "Right to access: You can view all data associated with your account at any time within the app.",
      "Right to rectification: Update your username and email from the Settings page.",
      "Right to erasure: Delete your account and all associated data permanently via Settings.",
      "Right to portability: Contact us to request a data export of your FocusFlow account.",
    ],
  },
  {
    id: "updates", icon: "fa-rotate", color: "#0EA5E9", title: "Policy Updates",
    content: [
      "We may update this Privacy Policy occasionally to reflect product changes or legal requirements.",
      "Significant updates will be communicated via in-app notification or email to registered users.",
      "Continued use of FocusFlow after policy updates constitutes acceptance of the revised terms.",
      "The effective date of the latest version is shown at the bottom of this page.",
    ],
  },
  {
    id: "contact", icon: "fa-envelope", color: "#22C55E", title: "Contact Us",
    content: [
      "Privacy inquiries: privacy@focusflow.com",
      "General support: support@focusflow.com",
      "For data deletion requests, please use the in-app account deletion feature in Settings.",
      "We aim to respond to all privacy-related requests within 48 business hours.",
    ],
  },
];

export default function PrivacyPolicy() {
  const [active, setActive] = useState("collection");

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) setActive(s.id);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ background: "#F8FAFC", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "72px 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>LEGAL</span>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", marginTop: 16, marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
            Your privacy is our priority. Here's exactly how we handle your data.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 12 }}>Last updated: June 2026</p>
        </motion.div>
      </section>

      {/* Content */}
      <section style={{ padding: "64px 24px" }}>
        <div className="max-w-5xl mx-auto flex gap-8 items-start">

          {/* Sticky sidebar */}
          <div className="hidden lg:block" style={{ width: 220, flexShrink: 0, position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #E5E7EB" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", marginBottom: 12 }}>SECTIONS</p>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8,
                    textDecoration: "none", marginBottom: 2,
                    background: active === s.id ? s.color + "12" : "transparent",
                    color: active === s.id ? s.color : "#6B7280",
                    fontSize: 13, fontWeight: active === s.id ? 600 : 400,
                    transition: "all 0.15s",
                  }}>
                  <i className={`fa-solid ${s.icon} text-xs`}></i>
                  <span>{s.title.replace(/\d\.\s*/, "")}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Summary banner */}
            <div style={{ background: "#EEF2FF", borderRadius: 16, padding: 20, border: "1px solid #C7D2FE", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <i className="fa-solid fa-info-circle mt-0.5" style={{ color: "#4F46E5", fontSize: 16, flexShrink: 0 }}></i>
              <p style={{ color: "#3730A3", fontSize: 14, lineHeight: 1.7 }}>
                <strong>Summary:</strong> We collect minimal data, never sell it, encrypt everything,
                and give you full control to export or delete your account at any time.
              </p>
            </div>

            {sections.map((s, i) => (
              <motion.div key={s.id} id={s.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`fa-solid ${s.icon}`} style={{ color: s.color }}></i>
                  </div>
                  <h2 style={{ fontWeight: 600, color: "#111827", fontSize: 18 }}>
                    {i + 1}. {s.title}
                  </h2>
                </div>
                <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                  {s.content.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, marginTop: 8, flexShrink: 0 }}></div>
                      <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{item}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Footer */}
            <div style={{ textAlign: "center", paddingTop: 16 }}>
              <p style={{ color: "#9CA3AF", fontSize: 13 }}>
                © {new Date().getFullYear()} FocusFlow. All rights reserved. &nbsp;·&nbsp;
                <a href="mailto:support@focusflow.com" style={{ color: "#4F46E5", textDecoration: "none" }}>support@focusflow.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

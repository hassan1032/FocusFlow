import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_QUESTIONS = [
  "How do I reset my password?",
  "What features does FocusFlow have?",
  "How does the Pomodoro timer work?",
  "Is my data safe?",
];

const BOT_RESPONSES = [
  { pattern: /hi|hello|hey|hola|greetings/i,    reply: "Hey there! 👋 I'm FocusBot. How can I help you today?" },
  { pattern: /reset password|forgot password/i,  reply: "Click 'Forgot Password' on the login page, enter your email, and you'll receive an OTP to set a new password." },
  { pattern: /create account|sign up|register/i, reply: "Click 'Get Started' on the home page. Registration is free and only takes 30 seconds!" },
  { pattern: /pomodoro|timer|focus session/i,    reply: "The Pomodoro timer uses the classic 25-minute work / 5-minute break cycle. Start a session, add your task, and FocusFlow will track your productivity automatically." },
  { pattern: /flashcard|flash card|deck|study/i, reply: "Create decks in the Flashcards section, add cards with a term and definition, then use Study Mode to flip through them with Know It / Still Learning tracking." },
  { pattern: /habit|routine|streak/i,            reply: "The Habit Tracker lets you create daily habits and mark them complete each day. You'll see a 7-day weekly grid and streak stats for every habit." },
  { pattern: /note|notes|journal/i,              reply: "The Notes page lets you create, edit, search, and delete rich-text notes. Perfect for capturing study material and ideas." },
  { pattern: /task|kanban|board|todo/i,          reply: "The Kanban Board lets you drag tasks between To Do, In Progress, and Done columns. You can also set due dates and priorities." },
  { pattern: /summary|summarize|ai|text/i,       reply: "The AI Text Summarizer uses a Hugging Face model to condense long articles or research papers. Just paste the text and hit Summarize!" },
  { pattern: /goal|goals|target/i,               reply: "Goals lets you set long-term targets, break them into milestones, and track your progress visually. Head to the Goals section!" },
  { pattern: /privacy|data|safe|secure/i,        reply: "Your data is encrypted and never sold. Passwords are bcrypt-hashed and sessions use httpOnly cookies. Full details in our Privacy Policy." },
  { pattern: /delete account|remove account/i,   reply: "Go to Settings → Account → Delete Account. This permanently removes all your data. This action cannot be undone." },
  { pattern: /free|price|cost|paid/i,            reply: "FocusFlow is completely free! No hidden costs, no premium tiers — just create an account and use everything." },
  { pattern: /contact|support|help|email/i,      reply: "You can reach us at support@focusflow.com or use the Contact page. We respond within 24 hours." },
  { pattern: /thank|thanks|thx|ty/i,             reply: "You're welcome! 😊 Is there anything else I can help you with?" },
  { pattern: /bye|goodbye|see you/i,             reply: "Bye! Happy studying! 🎓" },
  { pattern: /about|who made|team/i,             reply: "FocusFlow was built by a passionate team of developers. Check out the About page to meet the team and learn more!" },
  { pattern: /calendar|schedule|event/i,         reply: "The Calendar view shows all your tasks on a monthly/weekly/daily calendar. Navigate with arrow keys or the month picker." },
  { pattern: /progress|analytics|stats/i,        reply: "Your Dashboard shows task completion, habit streaks, goal progress, and Pomodoro session stats — all visualized with charts." },
];

const FEEDBACK_KEYWORDS = /not working|error|issue|problem|feedback|improve|suggestion|bug|crash|broken|wrong/i;

function getBotReply(text) {
  for (const { pattern, reply } of BOT_RESPONSES) {
    if (pattern.test(text)) return reply;
  }
  return "I'm not sure about that one. Try asking about features, your account, or say 'contact' to reach our support team! 🤖";
}

export default function Chatbot() {
  const [isOpen, setIsOpen]   = useState(false);
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm FocusBot 🤖 Your AI assistant for FocusFlow. Ask me anything or tap a quick question below!" },
  ]);
  const [typing, setTyping]   = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", message: "" });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const handleSend = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    setMessages(prev => [...prev, { from: "user", text: msg }]);

    if (FEEDBACK_KEYWORDS.test(msg)) {
      setTimeout(() => {
        setMessages(prev => [...prev, { from: "bot", text: "Sounds like you'd like to share feedback! Please fill out the form below and we'll look into it right away." }]);
        setShowFeedback(true);
      }, 500);
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: getBotReply(msg) }]);
    }, 800 + Math.random() * 400);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSendingFeedback(true);
    try {
      const fd = new FormData();
      Object.entries(feedbackForm).forEach(([k, v]) => fd.append(k, v));
      await fetch("https://formsubmit.co/ajax/suhanachaudhary212@gmail.com", {
        method: "POST", headers: { Accept: "application/json" }, body: fd,
      });
    } catch {}
    setSendingFeedback(false);
    setFeedbackSent(true);
    setShowFeedback(false);
    setMessages(prev => [...prev, { from: "bot", text: "Thanks for the feedback! We'll look into it and get back to you. 🙏" }]);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
          background: isOpen ? "#6B7280" : "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
        }}>
        <i className={`fa-solid ${isOpen ? "fa-times" : "fa-comment-dots"} text-lg`}></i>
        {!isOpen && messages.length > 1 && (
          <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", fontSize: 10, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {messages.filter(m => m.from === "bot").length}
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", bottom: 92, right: 24, zIndex: 9998,
              width: 360, maxWidth: "calc(100vw - 32px)",
              background: "#fff", borderRadius: 20,
              boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column", overflow: "hidden",
              fontFamily: "'Poppins', sans-serif",
            }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="fa-solid fa-robot text-white"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 }}>FocusBot</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80" }}></div>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: 0 }}>Online · typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", maxHeight: 360, minHeight: 200 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-end", gap: 6 }}>
                  {m.from === "bot" && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className="fa-solid fa-robot text-xs" style={{ color: "#4F46E5" }}></i>
                    </div>
                  )}
                  <div style={{
                    maxWidth: "75%", padding: "10px 13px", borderRadius: m.from === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: m.from === "user" ? "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" : "#F3F4F6",
                    color: m.from === "user" ? "#fff" : "#374151",
                    fontSize: 13, lineHeight: 1.6,
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-robot text-xs" style={{ color: "#4F46E5" }}></i>
                  </div>
                  <div style={{ background: "#F3F4F6", borderRadius: "14px 14px 14px 2px", padding: "12px 16px", display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{
                        width: 7, height: 7, borderRadius: "50%", background: "#9CA3AF",
                        animation: `typingBounce 1.2s infinite ${j * 0.2}s`,
                      }}></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback form */}
              {showFeedback && !feedbackSent && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <p style={{ fontWeight: 600, color: "#374151", fontSize: 13, marginBottom: 10 }}>Share your feedback</p>
                  <form onSubmit={handleFeedbackSubmit}>
                    {["name", "email"].map(field => (
                      <input key={field} type={field === "email" ? "email" : "text"} required
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + " *"}
                        value={feedbackForm[field]} onChange={e => setFeedbackForm(p => ({ ...p, [field]: e.target.value }))}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E7EB", marginBottom: 8, fontSize: 12, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }} />
                    ))}
                    <textarea required rows={3} placeholder="Describe the issue or suggestion *"
                      value={feedbackForm.message} onChange={e => setFeedbackForm(p => ({ ...p, message: e.target.value }))}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E7EB", marginBottom: 8, fontSize: 12, resize: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="submit" disabled={sendingFeedback}
                        style={{ flex: 1, background: "#4F46E5", color: "#fff", border: "none", padding: "8px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                        {sendingFeedback ? "Sending..." : "Send Feedback"}
                      </button>
                      <button type="button" onClick={() => setShowFeedback(false)}
                        style={{ background: "#F3F4F6", color: "#6B7280", border: "none", padding: "8px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions (only at start) */}
            {messages.length <= 2 && (
              <div style={{ padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => handleSend(q)}
                    style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, border: "1px solid #C7D2FE", background: "#EEF2FF", color: "#4F46E5", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ borderTop: "1px solid #F3F4F6", padding: "10px 12px", display: "flex", gap: 8 }}>
              <input ref={inputRef}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "9px 13px", borderRadius: 22, border: "1px solid #E5E7EB", outline: "none", fontSize: 13, fontFamily: "'Poppins', sans-serif", background: "#F8FAFC" }} />
              <button onClick={() => handleSend()}
                style={{ width: 38, height: 38, borderRadius: "50%", background: input.trim() ? "#4F46E5" : "#E5E7EB", color: input.trim() ? "#fff" : "#9CA3AF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}

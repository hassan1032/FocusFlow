import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #0F0E2E, #1a1756)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                <i className="fa-solid fa-bolt text-white"></i>
              </div>
              <span className="text-xl font-700 text-white" style={{ fontWeight: 700 }}>
                Focus<span style={{ color: "#818CF8" }}>Flow</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Your all-in-one productivity platform. Build habits, manage tasks, and achieve goals — all in one place.
            </p>
            <div className="flex gap-3">
              {["fa-brands fa-twitter", "fa-brands fa-linkedin", "fa-brands fa-github", "fa-brands fa-instagram"].map((icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.3)" }}>
                  <i className={`${icon} text-indigo-300 text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-600 mb-4 text-sm" style={{ fontWeight: 600 }}>Product</h4>
            <ul className="space-y-2">
              {[
                { to: "/why-focusflow", label: "Features" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 text-sm hover:text-white transition-colors no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-600 mb-4 text-sm" style={{ fontWeight: 600 }}>Tools</h4>
            <ul className="space-y-2">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/tasks", label: "Kanban Board" },
                { to: "/habits", label: "Habit Tracker" },
                { to: "/pomodora", label: "Pomodoro Timer" },
                { to: "/notes", label: "Notes" },
                { to: "/goals", label: "Goals" },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 text-sm hover:text-white transition-colors no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © 2026 FocusFlow. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors no-underline">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors no-underline">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

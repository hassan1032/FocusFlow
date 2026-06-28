import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import baseURL from "../environment";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

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

  return (
    <nav className="sticky top-0 z-50" style={{
      background: "rgba(15,14,46,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(79,70,229,0.2)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
            <i className="fa-solid fa-bolt text-white text-sm"></i>
          </div>
          <span className="text-lg font-700 text-white" style={{ fontWeight: 700 }}>
            Focus<span style={{ color: "#818CF8" }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/why-focusflow", label: "Why Us" },
            { to: "/contact", label: "Contact" },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="text-sm text-gray-300 hover:text-white transition-colors no-underline"
              style={{ fontWeight: 500 }}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard"
                className="ff-btn text-white text-sm py-2 px-4"
                style={{ background: "rgba(79,70,229,0.3)", border: "1px solid rgba(79,70,229,0.5)" }}>
                Dashboard
              </Link>
              <button onClick={handleLogout}
                className="ff-btn text-white text-sm py-2 px-4"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors no-underline"
                style={{ fontWeight: 500 }}>
                Sign in
              </Link>
              <Link to="/signup"
                className="ff-btn text-white text-sm py-2 px-5"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fa-solid ${isOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-2 border-t border-indigo-900/40">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/why-focusflow", label: "Why Us" },
            { to: "/contact", label: "Contact" },
          ].map(item => (
            <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-gray-300 hover:text-white transition-colors no-underline">
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}
                  className="ff-btn text-white text-sm py-2 justify-center"
                  style={{ background: "rgba(79,70,229,0.3)", border: "1px solid rgba(79,70,229,0.5)" }}>
                  Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="ff-btn text-white text-sm py-2"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="ff-btn text-sm py-2 justify-center"
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}
                  className="ff-btn text-white text-sm py-2 justify-center"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

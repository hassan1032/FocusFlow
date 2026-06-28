import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import baseURL from "../environment";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPsw, setShowPsw] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseURL}/signup`, form, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("email", form.email);
        setTimeout(() => navigate("/otp"), 800);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "linear-gradient(135deg, #0F0E2E, #1a1756)" }}>
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
            <i className="fa-solid fa-bolt text-white"></i>
          </div>
          <span className="text-xl font-700 text-white" style={{ fontWeight: 700 }}>
            Focus<span style={{ color: "#818CF8" }}>Flow</span>
          </span>
        </Link>
        <div>
          <h2 className="text-4xl font-700 text-white mb-4" style={{ fontWeight: 700 }}>
            Start your journey<br />
            <span style={{ color: "#818CF8" }}>to peak productivity.</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of professionals using FocusFlow to achieve more, every day.
          </p>
          {[
            { icon: "fa-solid fa-list-check",   text: "Organize tasks with Kanban board" },
            { icon: "fa-solid fa-calendar-days", text: "Calendar view with deadlines" },
            { icon: "fa-solid fa-wand-magic-sparkles", text: "AI-powered text summarization" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(79,70,229,0.2)" }}>
                <i className={`${f.icon} text-indigo-400 text-sm`}></i>
              </div>
              <span className="text-gray-300 text-sm">{f.text}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm">© 2025 FocusFlow. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 no-underline">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
              <i className="fa-solid fa-bolt text-white text-sm"></i>
            </div>
            <span className="text-lg font-700 text-gray-900" style={{ fontWeight: 700 }}>FocusFlow</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-700 text-gray-900 mb-2" style={{ fontWeight: 700 }}>Create account</h1>
            <p className="text-gray-400 text-sm">
              Already have one?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-500 no-underline"
                style={{ fontWeight: 500 }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Full Name</label>
              <input type="text" name="username" className="ff-input"
                placeholder="Your name" value={form.username} onChange={handleChange} required />
            </div>

            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Email address</label>
              <input type="email" name="email" className="ff-input"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Password</label>
              <div className="relative">
                <input type={showPsw ? "text" : "password"} name="password" className="ff-input pr-10"
                  placeholder="At least 8 characters" value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPsw(!showPsw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={`fa-solid ${showPsw ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="ff-btn ff-btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <><i className="fa-solid fa-spinner animate-spin text-sm mr-2"></i>Creating account...</>
              ) : (
                <>Create account <i className="fa-solid fa-arrow-right text-sm ml-2"></i></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-indigo-600 no-underline hover:underline">Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-indigo-600 no-underline hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

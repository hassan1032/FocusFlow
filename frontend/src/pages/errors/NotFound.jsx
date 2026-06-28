import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "#F8FAFC", fontFamily: "'Poppins', sans-serif" }}>
      <div className="text-8xl font-800 mb-4" style={{ fontWeight: 800, color: "#4F46E5" }}>404</div>
      <h2 className="text-2xl font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>Page not found</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="ff-btn ff-btn-primary">
          <i className="fa-solid fa-home text-sm"></i> Go Home
        </Link>
        <Link to="/dashboard" className="ff-btn ff-btn-secondary">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

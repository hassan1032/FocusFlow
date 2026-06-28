import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Public pages
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OtpPage from "./components/OtpPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import AboutUs from "./components/AboutUs";
import WhyFocusFlow from "./components/WhyFocusFlow";
import ContactUs from "./components/ContactUs";
import NotFound from "./pages/errors/NotFound";

// App pages (protected — use AppLayout)
import Dashboard from "./pages/Dashboard/Dashboard";
import KanbanBoard from "./pages/Kanban/KanbanBoard";
import CalendarView from "./pages/Calendar/CalendarView";
import Goals from "./pages/Goals/Goals";
import HabitDashboard from "./components/HabitDashboard";
import Note from "./pages/Home/Note";
import Section from "./pomodora/Section";
import FlashApp from "./FlashApp";
import TextSummarize from "./textSummarize/TextSummarize";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

import ScrollLink from "./ScrollLink";
import Chatbot from "./components/Chatbot";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Protected wrapper
function AppPage({ children, pageTitle }) {
  return <AppLayout pageTitle={pageTitle}>{children}</AppLayout>;
}

// Wrapper to show old Navbar+Footer only on public pages
function PublicShell({ children }) {
  return (
    <>
      <Navbar />
      <ScrollLink />
      {children}
      <Chatbot />
      <Footer />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* ===== Public routes ===== */}
        <Route path="/" element={<PublicShell><Home /></PublicShell>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
        <Route path="/privacy" element={<PublicShell><PrivacyPolicy /></PublicShell>} />
        <Route path="/terms" element={<PublicShell><TermsAndConditions /></PublicShell>} />
        <Route path="/contact" element={<PublicShell><ContactUs /></PublicShell>} />
        <Route path="/about" element={<PublicShell><AboutUs /></PublicShell>} />
        <Route path="/why-focusflow" element={<PublicShell><WhyFocusFlow /></PublicShell>} />

        {/* ===== Protected app routes ===== */}
        <Route path="/dashboard" element={<AppPage pageTitle="Dashboard"><Dashboard /></AppPage>} />
        <Route path="/tasks" element={<AppPage pageTitle="Kanban Board"><KanbanBoard /></AppPage>} />
        <Route path="/calendar" element={<AppPage pageTitle="Calendar"><CalendarView /></AppPage>} />
        <Route path="/goals" element={<AppPage pageTitle="Goals"><Goals /></AppPage>} />
        <Route path="/habits" element={<AppPage pageTitle="Habit Tracker"><HabitDashboard /></AppPage>} />
        <Route path="/notes" element={<AppPage pageTitle="Notes"><Note /></AppPage>} />
        <Route path="/pomodora" element={
          <AppPage pageTitle="Pomodoro Timer">
            <Section setDarkMode={setDarkMode} darkMode={darkMode} />
          </AppPage>
        } />
        <Route path="/flashcard/*" element={<AppPage pageTitle="Flashcards"><FlashApp /></AppPage>} />
        <Route path="/text" element={<AppPage pageTitle="AI Summary"><TextSummarize /></AppPage>} />
        <Route path="/profile" element={<AppPage pageTitle="Profile"><Profile /></AppPage>} />
        <Route path="/settings" element={<AppPage pageTitle="Settings"><Settings /></AppPage>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

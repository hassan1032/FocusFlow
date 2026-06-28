import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import baseURL from "../environment";
import HabitTracker from "./HabitTracker";

const HabitDashboard = () => {
  const [user, setUser] = useState({});
  const [habits, setHabits] = useState([]);
  const [weeklyDate, setWeeklyDate] = useState([]);

  const generateWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`);
    }
    setWeeklyDate(dates);
  };

  const fetchHabits = useCallback(async () => {
    try {
      const res = await axios.get(`${baseURL}/api/habits`, { withCredentials: true });
      setHabits(res.data?.habits || []);
    } catch (err) {
      console.error("Error fetching habits:", err);
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser) setUser(storedUser);
    fetchHabits();
    generateWeekDates();
  }, [fetchHabits]);

  return (
    <HabitTracker
      user={user}
      habits={habits}
      weeklyDate={weeklyDate}
      onRefresh={fetchHabits}
    />
  );
};

export default HabitDashboard;

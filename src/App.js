import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import EventDashboard from './EventDashboard';
import CreateEvent from './CreateEvent';
import './css/Register.css';
import './css/Login.css';
import './css/App.css';

const App = () => {
  // ✅ Directly initializing state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('guest') === 'true');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "");
  const location = useLocation();
  const navigate = useNavigate();
  const dashboardRef = useRef();

  useEffect(() => {
    console.log("📌 Checking Local Storage on Page Load:");
    console.log("📌 Token:", token);
    console.log("📌 Username:", username);
    console.log("📌 Is Guest:", isGuest);
  }, [token, username, isGuest]); // ✅ Log only when values change

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guest');
    localStorage.removeItem("username");
    setToken(null);
    setIsGuest(false);
    setUsername("");

    if (dashboardRef.current) {
      dashboardRef.current.resetFilters();
    }

    navigate("/login");
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">Event Manager</div>
        <div className="navbar-links">
          {isAuthPage ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/events">Event Dashboard</Link>
              <Link to="/create-event" onClick={(e) => {
                if (isGuest) {
                  e.preventDefault();
                  alert("You need to log in to create an event.");
                  window.location.href = "/login?redirect=events";
                }
              }}>Create Event</Link>
              {isGuest ? (
                <Link to="/login">Login</Link>
              ) : (
                <>
                  {token && username && (
                    <span className="navbar-username" style={{ color: "white", fontWeight: "bold", marginRight: "10px" }}>
                      👤 {username}
                    </span>
                  )}
                  {token && (
                    <button className="logout-button" onClick={logout}>Logout</button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to={!token && !isGuest ? "/login" : "/events"} replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} setIsGuest={setIsGuest} setUsername={setUsername} />} />
        <Route path="/events" element={<EventDashboard ref={dashboardRef} token={token} isGuest={isGuest} />} />
        <Route path="/create-event" element={<CreateEvent isGuest={isGuest} />} />
      </Routes>
    </div>
  );
};

export default App;

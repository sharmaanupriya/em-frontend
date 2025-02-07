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
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('guest') === 'true');
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Use navigate to redirect after logout
  const dashboardRef = useRef();
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedGuest = localStorage.getItem('guest');
  
    console.log("📌 Checking Local Storage on Page Load:");
    console.log("📌 Token:", storedToken);
    console.log("📌 Username:", storedUsername);
    console.log("📌 Is Guest:", storedGuest);
  
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedGuest === 'true') {
      setIsGuest(true);
    } else {
      setIsGuest(false);
    }
  }, []);
  
  

  const logout = () => {
    // ✅ Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('guest');
    localStorage.removeItem("username");
    setToken(null);
    setIsGuest(false);
    setUsername("");

    // ✅ Reset filters on EventDashboard if applicable
    if (dashboardRef.current) {
      dashboardRef.current.resetFilters();
    }

    // ✅ Redirect to login page after logout
    navigate("/login");
  };

  // ✅ Check if the user is on the login or register page
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
              {/* {!isGuest && <button className="logout-button" onClick={logout}>Logout</button>} */}
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to={!token && !isGuest ? "/login" : "/events"} replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} setIsGuest={setIsGuest} setUsername={setUsername} />} />
        {/* <Route path="/login" element={<Login setToken={setToken} setIsGuest={setIsGuest} />} /> */}
        <Route path="/events" element={<EventDashboard ref={dashboardRef} token={token} isGuest={isGuest} />} />
        <Route path="/create-event" element={<CreateEvent isGuest={isGuest} />} />
      </Routes>
    </div>
  );
};

export default App;

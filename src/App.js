import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './css/Register.css';
import './css/Login.css';
import './css/App.css'; // Add a new CSS file for styling the nav bar
import Register from './Register';
import Login from './Login';
import EventDashboard from './EventDashboard';
import CreateEvent from './CreateEvent';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const dashboardRef = useRef(); // Reference to access resetFilters in EventDashboard

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    if (dashboardRef.current) {
      dashboardRef.current.resetFilters(); // Call resetFilters when logging out
    }
  };

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-brand">Event Manager</div>
          <div className="navbar-links">
            {!token && (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}
            {token && (
              <>
                <Link to="/events">Event Dashboard</Link>
                <Link to="/create-event">Create Event</Link>
                <button className="logout-button" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/events"
            element={<EventDashboard ref={dashboardRef} />} // Pass the ref
          />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

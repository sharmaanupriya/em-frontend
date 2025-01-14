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
    // Clear session data
    localStorage.removeItem('token');
    setToken(null);

    // Reset filters on EventDashboard if applicable
    if (dashboardRef.current) {
      dashboardRef.current.resetFilters();
    }
  };

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-brand">Event Manager</div>
          <div className="navbar-links">
            {!token ? (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
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
          <Route path="/" element={token ? <Navigate to="/events" replace /> : <Navigate to="/login" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/events" replace />} />
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/events" replace />} />
          <Route
            path="/events"
            element={<EventDashboard ref={dashboardRef} token={token} />} // Pass token to EventDashboard
          />
          <Route
            path="/create-event"
            element={token ? <CreateEvent /> : <Navigate to="/login" replace />} // Protect this route
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

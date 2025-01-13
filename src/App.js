import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import EventDashboard from './EventDashboard'; 
import CreateEvent from './CreateEvent'; 

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          {token && (
            <>
              <Link to="/events">Event Dashboard</Link>
              <Link to="/create-event">Create Event</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/events" element={<EventDashboard />} /> {/* Using element prop */}
          <Route path="/create-event" element={<CreateEvent />} /> {/* Using element prop */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

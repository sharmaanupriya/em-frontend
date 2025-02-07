import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './axios';

const Login = ({ setToken, setIsGuest, setUsername }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log("🚀 Full API Response:", response.data);  // ✅ Log full response
  
      const { token, user } = response.data;
  
      if (token && user) {
        console.log("✅ Storing Username:", user.username); // ✅ Log username before storing
  
        localStorage.setItem('userId', user.id || user._id);
        localStorage.setItem('username', user.username || "");  // ✅ Save username correctly
        localStorage.setItem('token', token);
  
        setToken(token);
        setUsername(user.username || ""); // ✅ Update state
        setIsGuest(false);
  
        navigate(redirectPath ? `/${redirectPath}` : "/events");
      } else {
        setMessage('Login failed, no token returned');
        setMessageType('error');
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setMessage('Login failed: ' + (error.response?.data?.message || 'Server error'));
      setMessageType('error');
    }
  };
  
  
  // ✅ Guest Login Function - Sets Guest Mode & Navigates Immediately
  const handleGuestLogin = () => {
    localStorage.setItem('guest', 'true'); // Mark user as guest
    setIsGuest(true); // Update guest state
    setUsername("");
    navigate('/events'); // Redirect to event dashboard
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>

        {/* ✅ Guest Login Button */}
        <button className="guest-login-button" onClick={handleGuestLogin}>
          Guest Login
        </button>

        {message && <p className={`message ${messageType}`}>{message}</p>}
        <p className="signin-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

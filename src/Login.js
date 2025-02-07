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
      console.log("🚀 Full API Response:", response.data);

      const { token, user } = response.data;

      if (token && user) {
        console.log("✅ Storing Username:", user.username);

        localStorage.setItem('userId', user.id || user._id);
        localStorage.setItem('username', user.username || "");
        localStorage.setItem('token', token);
        localStorage.removeItem('guest'); // ✅ Remove guest mode on login

        setToken(token);
        setUsername(user.username || "");
        setIsGuest(false); // ✅ Ensure guest mode is turned off

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

  // ✅ Guest Login - Ensures proper handling
  const handleGuestLogin = () => {
    localStorage.setItem('guest', 'true'); 
    localStorage.removeItem('token'); // ✅ Remove any existing login token
    setIsGuest(true);
    setToken(null);
    setUsername("");

    navigate('/events');
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

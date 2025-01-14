import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // To differentiate between success and error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setMessage('Login successful');
        setMessageType('success'); // Set success message type
        navigate('/'); // Redirect to the home page after successful login
      } else {
        setMessage('Login failed, no token returned');
        setMessageType('error'); // Set error message type
      }
    } catch (error) {
      setMessage('Login failed');
      setMessageType('error'); // Set error message type
    }
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
        {message && <p className={`message ${messageType}`}>{message}</p>} {/* Apply dynamic class */}
        <p className="signup-link">
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

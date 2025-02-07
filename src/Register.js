import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = { username, email, password };

    console.log("Sending request to register:", requestData); // ✅ Debug log

    try {
      const response = await api.post('/auth/register', requestData, {
        headers: { 'Content-Type': 'application/json' } // ✅ Ensure JSON format
      });

      // ✅ Successful registration
      console.log("Server response:", response.data);

      setMessage('Registration successful! Redirecting to login...');
      setMessageType('success');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error.response?.data); // ✅ Debug API response

      if (error.response) {
        if (error.response.status === 400) {
          setMessage('Invalid input. Please check your details.');
        } else if (error.response.status === 409) {
          setMessage('User already exists. Please use a different email.');
        } else if (error.response.status === 500) {
          setMessage('Server error. Please try again later.');
        } else {
          setMessage('Something went wrong. Please try again.');
        }
      } else {
        setMessage('Network error. Please check your connection.');
      }

      setMessageType('error');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit" className="register-button">Register</button>
        </form>
        {message && <p className={`message ${messageType}`}>{message}</p>}
        <p className="signin-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="link">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

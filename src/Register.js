import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import api from './axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // To determine message type (success or error)
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending the request to register the user
      await api.post('/auth/register', { username, email, password });

      // Registration successful
      setMessage('Registration successful! Redirecting to login...');
      setMessageType('success');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      // Error handling based on different error types
      
      // Check for user already exists (409 Conflict)
      if (error.response && error.response.status === 409) {
        setMessage('User already exists. Please use a different username or email.');
      } 
      
      // Check for server error (500 Internal Server Error)
      else if (error.response && error.response.status === 500) {
        setMessage('Server error. Please try again later.');
      } 
      
      // Handle any other errors (e.g., network issues, client-side errors)
      else if (error.response) {
        setMessage('Something went wrong. Please try again.');
      } else {
        setMessage('Network error. Please check your connection.');
      }

      // Set the error message type
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
        {message && <p className={`message ${messageType}`}>{message}</p>} {/* Apply the dynamic class */}
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



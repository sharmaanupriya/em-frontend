import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting to log in with:', email, password);

    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('API Response:', response);

      const { token } = response.data;
      console.log('Received token:', token);

      if (token) {
        localStorage.setItem('token', token);  // Store the token in localStorage
        setToken(token);  // Set the token in the app state
        setMessage('Login successful');
        // navigate('/');  // Redirect to the home page after successful login
      } else {
        setMessage('Login failed, no token returned');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed');
    }
  };

  return (
    <div>
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;

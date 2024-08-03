import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const response = await fetch('http://127.0.0.1:8000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username,
        password
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      } else {
        setError('Login failed');
      }
    } else {
      const data = await response.json();
      setError(data.detail || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const response = await fetch('http://127.0.0.1:8000/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    if (response.ok) {
      alert('User created successfully');
      const loginResponse = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username,
          password
        })
      });
      const data = await loginResponse.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      }
    } else {
      const data = await response.json();
      setError(data.detail || 'User creation failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="button-container">
        <button
          className={`toggle-button ${isLogin ? 'active' : 'inactive'}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-button ${!isLogin ? 'active' : 'inactive'}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {isLogin ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
}

export default Login;

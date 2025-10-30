import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ role, navigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const roleConfig = {
    user: { color: '#38D200', title: 'User Login' },
    admin: { color: '#0473EA', title: 'Admin Login' },
    ops: { color: '#38D200', title: 'Ops Login' },
  };

  const config = roleConfig[role] || { color: '#333', title: 'Login' };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { token } = response.data;
      if (token) {
        // Save token in localStorage
        localStorage.setItem('token', token);

        // Decode token payload to extract role (optional)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;

        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          if (userRole === 'ADMIN') navigate('admin-dashboard');
          else if (userRole === 'OPS') navigate('ops-dashboard');
          else navigate('subscriber-dashboard');
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.error === 'INVALID_CREDENTIALS') {
        setMessage('Invalid email or password.');
      } else {
        setMessage('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button className="back-button" onClick={() => navigate('landing')}>
          ← Back
        </button>

        <div className="auth-header">
          <h1 className="auth-title">{config.title}</h1>
          <p className="auth-subtitle">Enter your credentials to continue</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                id="email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button
            className="submit-button"
            style={{ backgroundColor: config.color }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Logging in...' : <>Login <ArrowRight size={20} /></>}
          </button>
        </div>

        {message && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '15px',
              color: message.includes('success') ? 'green' : 'red'
            }}
          >
            {message}
          </p>
        )}

        <div className="auth-footer">
          Don't have an account?{' '}
          <button
            className="link-button"
            style={{ color: config.color }}
            onClick={() => navigate('signup', role)}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

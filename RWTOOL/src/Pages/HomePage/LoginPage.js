import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = ({ role, navigate }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handleSubmit = () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            if (role === 'ops') {
                if (formData.email === 'ops@rwtool.com' && formData.password === 'ops123') navigate('ops-dashboard');
                else alert('Invalid Ops credentials. Try: email = ops@rwtool.com | password = ops123');
            } else if (role === 'admin') {
                if (formData.email === 'admin@rwtool.com' && formData.password === 'admin123') navigate('admin-dashboard');
                else alert('Invalid Admin credentials. Try: email = admin@rwtool.com | password = admin123');
            } else if (role === 'user') {
                if (formData.email === 'user@rwtool.com' && formData.password === 'user123') navigate('subscriber-dashboard');
                else alert('Invalid User credentials. Try: email = user@rwtool.com | password = user123');
            } else {
                alert(`${config.title} successful! (Demo)`);
            }
        } else {
            setErrors(newErrors);
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
                                placeholder="........"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <button
                        className="submit-button"
                        style={{ backgroundColor: config.color }}
                        onClick={handleSubmit}
                    >
                        Login <ArrowRight size={20} />
                    </button>
                </div>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <button className="link-button" style={{ color: config.color }} onClick={() => navigate('signup', role)}>
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
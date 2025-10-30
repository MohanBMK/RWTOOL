
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';

const SignupPage = ({ role, navigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const roleConfig = {
        user: { color: '#38D200', title: 'User Registration', needsOrg: true },
        admin: { color: '#0473EA', title: 'Admin Registration', needsOrg: true },
        ops: { color: '#38D200', title: 'Ops Registration', needsOrg: false }
    };

    const config = roleConfig[role];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (config.needsOrg && !formData.organization.trim()) {
            newErrors.organization = 'Organization is required';
        }
        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            console.log('Signup successful:', { role, ...formData });
            alert(`${config.title} successful! Please login.`);
            navigate('login', role);
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <button className="back-button" onClick={() => navigate('landing')}>
                    ← Back
                </button>

                <div className="auth-header">
                    <h1 className="auth-title">{config.title}</h1>
                    <p className="auth-subtitle">Create your account to get started</p>
                </div>

                <div className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <div className="input-wrapper">
                            <User size={20} className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    {config.needsOrg && (
                        <div className="form-group">
                            <label htmlFor="organization" className="form-label">
                                {role === 'user' ? 'Organization to Subscribe' : 'Organization Name'}
                            </label>
                            <div className="input-wrapper">
                                <Building2 size={20} className="input-icon" />
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    className={`form-input ${errors.organization ? 'error' : ''}`}
                                    placeholder="Acme Corp"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            {errors.organization && <span className="error-text">{errors.organization}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        className="submit-button"
                        style={{ backgroundColor: config.color }}
                        onClick={handleSubmit}
                    >
                        Create Account <ArrowRight size={20} />
                    </button>
                </div>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <button
                            className="link-button"
                            style={{ color: config.color }}
                            onClick={() => navigate('login', role)}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

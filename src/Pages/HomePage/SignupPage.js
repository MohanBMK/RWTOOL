import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Briefcase } from 'lucide-react';
import axios from 'axios';

const SignupPage = ({ role, navigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        domain: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const roleConfig = {
        user: { color: '#38D200', title: 'User Registration' },
        admin: { color: '#0473EA', title: 'Admin Registration' },
        ops: { color: '#38D200', title: 'Ops Registration' }
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
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, '')))
            newErrors.phone = 'Phone number must be 10 digits';
        if (role === 'user' && !formData.domain.trim()) newErrors.domain = 'Domain is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
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
            const payload = {
                fullName: formData.name,
                email: formData.email,
                phoneNumber: formData.phone,
                domain: role === 'user' ? formData.domain : null,
                password: formData.password,
                role: role.toUpperCase()
            };

            const res = await axios.post('http://localhost:8080/api/auth/signup', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status === 201) {
                setMessage('Account created successfully! Please login.');
                setTimeout(() => navigate('login', role), 1500);
            }
        } catch (err) {
            if (err.response?.data?.error === 'EMAIL_EXISTS') {
                setMessage('Email already registered. Try logging in.');
            } else {
                setMessage('Signup failed. Please try again.');
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

                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone size={20} className="input-icon" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    {role === 'user' && (
                        <div className="form-group">
                            <label htmlFor="domain" className="form-label">Domain/Industry</label>
                            <div className="input-wrapper">
                                <Briefcase size={20} className="input-icon" />
                                <select
                                    id="domain"
                                    name="domain"
                                    className={`form-input ${errors.domain ? 'error' : ''}`}
                                    value={formData.domain}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '45px' }}
                                >
                                    <option value="">Select your domain</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Credit">Credit</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Loan">Loan</option>
                                </select>
                            </div>
                            {errors.domain && <span className="error-text">{errors.domain}</span>}
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
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={20} /></>}
                    </button>
                </div>

                {message && (
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '15px',
                            color: message.includes('successfully') ? 'green' : 'red'
                        }}
                    >
                        {message}
                    </p>
                )}

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

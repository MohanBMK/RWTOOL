import React from 'react';
import { User, Settings, Wrench } from 'lucide-react';

const LandingPage = ({ navigate }) => {
    const roles = [
        {
            id: 'user',
            title: 'User',
            description: 'Access organizational reports and updates.',
            icon: User,
            color: '#38D200',
            bgColor: 'rgba(56, 210, 0, 0.1)'
        },
        {
            id: 'admin',
            title: 'Admin',
            description: 'Manage users, reports, domains and approvals.',
            icon: Settings,
            color: '#0473EA',
            bgColor: 'rgba(4, 115, 234, 0.1)'
        },
        {
            id: 'ops',
            title: 'Ops',
            description: 'Handle data syncing and storage operations.',
            icon: Wrench,
            color: '#38D200',
            bgColor: 'rgba(56, 210, 0, 0.1)'
        }
    ];

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="landing-header">
                    <h1 className="landing-title">
                        Welcome to <span className="brand-name">RW Tool</span>
                    </h1>
                    <p className="landing-subtitle">
                        A centralized platform for report subscription and management.
                    </p>
                </div>

                <div className="role-cards">
                    {roles.map((role) => (
                        <div key={role.id} className="role-card">
                            <div
                                className="role-icon-wrapper"
                                style={{ backgroundColor: role.bgColor }}
                            >
                                <role.icon size={40} style={{ color: role.color }} />
                            </div>
                            <h2 className="role-title">{role.title}</h2>
                            <p className="role-description">{role.description}</p>
                            <button
                                className="role-button"
                                style={{ backgroundColor: role.color }}
                                onClick={() => navigate('login', role.id)}
                            >
                                Login
                            </button>
                        </div>
                    ))}
                </div>

                <footer className="landing-footer">
                    © 2025 RW Tool — All Rights Reserved.
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
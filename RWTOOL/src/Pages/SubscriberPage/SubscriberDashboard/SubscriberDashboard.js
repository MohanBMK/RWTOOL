
import React, { useState } from 'react';
import SubscriptionRequestComponent from '../SubscriptionRequestComponent/SubscriptionRequestComponent';
import DownloadReportComponent from '../DownloadReport/DownloadReportComponent';
import SubscriptionDashboard from '../SubscriptionStatusPage/SubsciptionDashboard';
import SubscriberNotification from '../SubscriberNotification/SubscriberNotification';
import SubscriberProfile from '../Profile/SubscriberProfile';
import { LogOut } from 'lucide-react';
import '../../AdminPage/AdminDashBoard/Dashboard.css';
import './SubscriberDashboard.css';

const SubscriberDashboard = ({ navigate: navigateToPage }) => {
    const [view, setView] = useState('dashboard');
    const [open, setOpen] = useState(true);

    const logout = () => {
        navigateToPage('landing');
    };

    const user = { name: 'Tony Stark', email: 'tony3000@stark.com', role: 'Subscriber' };

    const [subscriptions] = useState([
        { id: 1, domain: 'Equities', status: 'APPROVED', requestedAt: '2024-12-01', approvedAt: '2024-12-02' },
        { id: 2, domain: 'FX', status: 'APPROVED', requestedAt: '2024-12-05', approvedAt: '2024-12-06' },
        { id: 3, domain: 'Commodities', status: 'PENDING', requestedAt: '2024-12-15', approvedAt: null },
        { id: 4, domain: 'Fixed Income', status: 'REJECTED', requestedAt: '2024-11-20', approvedAt: '2024-11-22' }
    ]);

    const [reports] = useState([
        { id: 1, title: 'Q4 2024 Equities Market Analysis', domain: 'Equities', publishedAt: '2024-12-15', version: 'v1.2', format: 'PDF', size: '2.4 MB', downloads: 145 },
        { id: 2, title: 'FX Trading Weekly Summary', domain: 'FX', publishedAt: '2024-12-18', version: 'v2.0', format: 'XLSX', size: '856 KB', downloads: 98 },
        { id: 3, title: 'Global Equities Performance Review', domain: 'Equities', publishedAt: '2024-12-20', version: 'v1.1', format: 'PDF', size: '1.8 MB', downloads: 312 },
        { id: 4, title: 'FX Volatility Index Analysis', domain: 'FX', publishedAt: '2024-12-22', version: 'v1.0', format: 'CSV', size: '645 KB', downloads: 87 }
    ]);

    const approvedDomains = subscriptions.filter(s => s.status === 'APPROVED').map(s => s.domain);
    const filteredReports = reports.filter(r => approvedDomains.includes(r.domain));

    const nav = [
        { name: 'Dashboard', view: 'dashboard' },
        { name: 'My Subscriptions', view: 'subscriptions' },
        { name: 'Request Subscription', view: 'request' },
        { name: 'Download Reports', view: 'downloads' },
        { name: 'Profile', view: 'profile' }
    ];

    const renderContent = () => {
        if (view === 'subscriptions') return <SubscriptionDashboard subscriptions={subscriptions} />;
        if (view === 'request') return <SubscriptionRequestComponent subscriptions={subscriptions} />;
        if (view === 'downloads') return <DownloadReportComponent reports={reports} subscriptions={subscriptions} />;
        if (view === 'profile') return <SubscriberProfile />;

        return (
            <>
                <h1>Dashboard</h1>
                <p className="subtitle">Welcome back, {user.name}</p>
                <div className="stats">
                    <div className="card"><div><p className="label">Active Subscriptions</p><h2>{subscriptions.filter(s => s.status === 'APPROVED').length}</h2></div></div>
                    <div className="card"><div><p className="label">Pending Requests</p><h2>{subscriptions.filter(s => s.status === 'PENDING').length}</h2></div></div>
                    <div className="card"><div><p className="label">Available Reports</p><h2>{filteredReports.length}</h2></div></div>
                    <div className="card"><div><p className="label">Rejected Requests</p><h2>{subscriptions.filter(s => s.status === 'REJECTED').length}</h2></div></div>
                </div>
                <div className="grid">
                    <div className="card">
                        <div className="header">
                            <div><h3> My Subscriptions</h3><p>Approved and pending domains</p></div>
                            <button onClick={() => setView('subscriptions')}>View all</button>
                        </div>
                        <table>
                            <thead><tr><th>Domain</th><th>Status</th></tr></thead>
                            <tbody>
                                {subscriptions.slice(0, 5).map(s => (
                                    <tr key={s.id}><td className="bold">{s.domain}</td><td><span className={`badge ${s.status.toLowerCase()}`}>{s.status}</span></td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card">
                        <div className="header">
                            <div><h3> Download Reports</h3><p>Reports for approved domains</p></div>
                            <button onClick={() => setView('downloads')}>View all</button>
                        </div>
                        <table>
                            <thead><tr><th>Title</th><th>Domain</th></tr></thead>
                            <tbody>
                                {filteredReports.slice(0, 5).map(r => (
                                    <tr key={r.id}><td className="bold">{r.title}</td><td>{r.domain}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="dash">
            <div className={`side ${open ? 'open' : ''}`}>
                <div className="side-head">
                    <span className="logo-icon"></span>
                    <div><h2>RW Tool</h2><p>Subscriber Panel</p></div>
                </div>
                <div className="side-nav">
                    <p className="nav-label">Navigation</p>
                    {nav.map((n, i) => (
                        <button key={i} onClick={() => setView(n.view)} className={`nav-btn ${view === n.view ? 'active' : ''}`}>
                            <span>{n.icon}</span>{n.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="main">
                <div className="top">
                    <button onClick={() => setOpen(!open)} className="menu">☰</button>
                    <div className="actions">
                        <SubscriberNotification />
                        <button onClick={logout} className="logout-btn">
                            <LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>
                </div>
                <div className="content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default SubscriberDashboard;
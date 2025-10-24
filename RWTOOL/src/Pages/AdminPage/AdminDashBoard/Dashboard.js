import React, { useState } from "react";
import ApproveRejectSubscription from "../ApproveReject/ApproveRejectSubscription";
import { DomainManagement } from "../DomainManagement/DomainManagement";
import { FilePathManagement } from "../FilePathManagement/FilePathManagement";
import { UserGroupAccess } from "../UserGroupAccess/UserGroupAccess";
import './Dashboard.css';
import AuditLogs from "../AuditLog/AuditLogs";
import AdminNotification from "../AdminNotification/AdminNotification";
import { LogOut } from 'lucide-react'

export default function Dashboard({ navigate }) {
    const [view, setView] = useState('dashboard');
    const [open, setOpen] = useState(true);

    const logout = () => {
        navigate('landing'); // Redirect to landing page
    };


    const stats = [
        { label: "Total Users", val: "1,248", change: "+12% from last month " },
        { label: "Active Reports", val: "348", change: "+8 new this week" },
        { label: "Pending Requests", val: "23", change: "Requires attention" },
        { label: "System Activity", val: "4", change: "Last 24 hours" }

    ];


    const requests = [
        { id: 1, name: "Bhavesh", domain: "Finance", status: "Pending" },
        { id: 2, name: "Ramesh", domain: "Cybersecurity", status: "Approved" },
        { id: 3, name: "Suresh", domain: "Domain", status: "Pending" },
    ];

    const nav = [
        { name: "Dashboard", icon: "", view: "dashboard" },
        { name: "Approve/Reject Subscription", icon: "", view: "approve" },
        { name: "Domain Management", icon: "", view: "domains" },
        { name: "File Path Management", icon: "", view: "filepaths" },
        { name: "User Group Access", icon: "", view: "usergroups" },
        { name: "Logs", icon: "", view: "logs" }
    ];

    const domains = [
        { name: "Financial Reports", desc: "Financial and accounting report", created: "15/01/2024" },
        { name: "Operation", desc: "Operational metric", created: "15/01/2024" },
        { name: "Aabc", desc: "aabcd", created: "15/01/2024" }
    ];

    const renderContent = () => {
        if (view == 'approve') return <ApproveRejectSubscription />;
        if (view == 'domains') return <DomainManagement />;
        if (view == 'filepaths') return <FilePathManagement />;
        if (view == 'usergroups') return <UserGroupAccess />;
        if (view == 'logs') return <AuditLogs />;


        return <>
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back! Here's an overview of your system</p>
            <div className="stats">
                {stats.map((s, i) => (
                    <div key={i} className="card">
                        <div><p className="label">{s.label}</p><h2>{s.val}</h2><p className="change">{s.change} </p> </div>

                    </div>
                ))}
            </div>
            <div className="grid">
                <div className="card">
                    <div className="header">
                        <div><h3> Approve/Reject Subscription</h3><p>Latest user access requests</p></div>
                        <button onClick={() => setView('approve')}>View all</button>
                    </div>
                    <table>
                        <thead><tr><th>User</th><th>Domain</th><th>Status</th></tr></thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id}>
                                    <td className="bold">{r.name}</td>
                                    <td>{r.domain}</td>
                                    <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                <div className="card">
                    <div className="header">
                        <div><h3> Domain Management </h3><p> Available report domains</p>
                        </div>
                        <button onClick={() => setView('domains')}> View all</button>
                    </div>
                    <table>
                        <thead><tr><th>Domain Name</th><th> Description </th><th>Created</th></tr></thead>
                        <tbody>
                            {domains.map((d, i) => (
                                <tr key={i}>
                                    <td className="bold">{d.name}</td>
                                    <td>{d.desc}</td>
                                    <td>{d.created}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </>
    };

    return (
        <div className="dash">
            <div className={`side ${open ? 'open' : ''}`}>
                <div className="side-head">
                    <span className="logo-icon"></span>
                    <div><h2>RW Tool</h2><p>Admin Panel</p></div>
                </div>

                <div className="side-nav">
                    <p className="nav-label">Management</p>
                    {nav.map((n, i) => (
                        <button key={i} onClick={() => setView(n.view)} className={`nav-btn ${view == n.view ? 'active' : ''}`}>
                            <span>{n.icon}</span>{n.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="main">
                <div className="top">
                    <button onClick={() => setOpen(!open)} className="menu">☰</button>
                    <div className="actions">
                        <AdminNotification />
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
}
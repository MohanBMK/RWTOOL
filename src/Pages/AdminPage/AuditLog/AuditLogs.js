import React, { useState, useEffect } from 'react';
import { Download, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AuditLogs.css';

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('All Actions');
    const [filterRole, setFilterRole] = useState('All Users');
    const [dateRange, setDateRange] = useState('7days');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Replace with your API call
    const auditData = [
        { id: 1, timestamp: '2024-01-10 14:32:15', user: 'admin@rwtool.com', role: 'Admin', action: 'USER_APPROVED', details: 'Approved subscription request for john.doe@example.com', status: 'success' },
        { id: 2, timestamp: '2024-01-10 14:28:43', user: 'admin@rwtool.com', role: 'Admin', action: 'REPORT_UPLOAD', details: 'Uploaded Q4 Financial Report', status: 'success' },
        { id: 3, timestamp: '2024-01-10 14:15:22', user: 'jane.smith@rwtool.com', role: 'Subscriber', action: 'REPORT_VIEW', details: 'Viewed Financial Report Q3 2024', status: 'success' },
        { id: 4, timestamp: '2024-01-10 13:45:11', user: 'unknown', role: 'Subscriber', action: 'LOGIN_FAILED', details: 'Failed login attempt', status: 'failed' },
        { id: 5, timestamp: '2024-01-10 13:30:22', user: 'admin@rwtool.com', role: 'Admin', action: 'USER_REJECTED', details: 'Rejected subscription request for inactive user', status: 'success' },
        { id: 6, timestamp: '2024-01-10 12:55:33', user: 'subscriber@rwtool.com', role: 'Subscriber', action: 'REPORT_DOWNLOAD', details: 'Downloaded Operations Report July 2024', status: 'success' },
        { id: 7, timestamp: '2024-01-10 12:20:15', user: 'john.doe@rwtool.com', role: 'Subscriber', action: 'USER_LOGIN', details: 'User logged in successfully', status: 'success' },
        { id: 8, timestamp: '2024-01-10 11:45:00', user: 'admin@rwtool.com', role: 'Admin', action: 'DOMAIN_ADDED', details: 'Added new domain: marketing.reports.com', status: 'success' },
        { id: 9, timestamp: '2024-01-10 11:30:15', user: 'subscriber2@rwtool.com', role: 'Subscriber', action: 'REPORT_VIEW', details: 'Viewed Marketing Report Q2 2024', status: 'success' },
        { id: 10, timestamp: '2024-01-10 11:15:45', user: 'admin@rwtool.com', role: 'Admin', action: 'USER_APPROVED', details: 'Approved subscription request for alice@example.com', status: 'success' },
        { id: 11, timestamp: '2024-01-10 10:55:30', user: 'subscriber3@rwtool.com', role: 'Subscriber', action: 'REPORT_DOWNLOAD', details: 'Downloaded HR Report June 2024', status: 'success' },
        { id: 12, timestamp: '2024-01-10 10:40:20', user: 'admin@rwtool.com', role: 'Admin', action: 'REPORT_UPLOAD', details: 'Uploaded Annual Financial Statement', status: 'success' }
    ];

    const filteredData = auditData.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'All Actions' || log.action === filterAction;
        const matchesRole = filterRole === 'All Users' || log.role === filterRole;
        return matchesSearch && matchesAction && matchesRole;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterAction, filterRole, dateRange]);

    return (
        <div className="audit-logs-container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="audit-title">Audit Logs</h2>
                    <p className="audit-subtitle">Monitor all admin and subscriber activities in real-time</p>
                </div>
                <button className="btn btn-export">
                    <Download size={18} className="me-2" />
                    Export Logs
                </button>
            </div>

            {/* Recent Activity */}
            <div className="info-card mb-4">
                <h5 className="card-header-title">
                    <Clock size={20} className="me-2" />
                    Recent Activity
                </h5>
                <div className="timeline">
                    {auditData.slice(0, 5).map(activity => (
                        <div key={activity.id} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className={`role-badge-small ${activity.role === 'Admin' ? 'role-admin' : 'role-subscriber'}`}>{activity.role}</span>
                                    <small className="text-muted">{activity.timestamp.split(' ')[1]}</small>
                                </div>
                                <div className="timeline-action">{activity.action}</div>
                                <div className="timeline-user">{activity.user}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Log */}
            <div className="activity-section">
                <div className="mb-4">
                    <h4 className="activity-title">Activity Log</h4>
                    <p className="activity-subtitle mb-3">Complete audit trail of system activities</p>
                    {(filterAction !== 'All Actions' || filterRole !== 'All Users') && (
                        <div className="mb-3">
                            <small className="text-muted me-2">Active Filters:</small>
                            {filterAction !== 'All Actions' && <span className="filter-chip">{filterAction}</span>}
                            {filterRole !== 'All Users' && <span className="filter-chip">{filterRole}</span>}
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="row g-3 mb-4">
                    <div className="col-md-2">
                        <select className="form-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                            {['All Users', 'Admin', 'Subscriber'].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
                            {['All Actions', 'USER_APPROVED', 'USER_REJECTED', 'REPORT_UPLOAD', 'REPORT_VIEW', 'REPORT_DOWNLOAD', 'USER_LOGIN', 'LOGIN_FAILED', 'DOMAIN_ADDED'].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select className="form-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                            {[{ v: 'today', l: 'Today' }, { v: '7days', l: 'Last 7 Days' }, { v: '30days', l: 'Last 30 Days' }, { v: '90days', l: 'Last 90 Days' }].map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <Search size={18} className="text-muted" />
                            </span>
                            <input type="text" className="form-control border-start-0" placeholder="Search by user, action, or details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-outline-secondary w-100" title="Advanced Filters">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Info */}
                <div className="mb-3 d-flex justify-content-between">
                    <small className="text-muted">Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredData.length)} of {filteredData.length} records</small>
                    <small className="text-muted">Page {currentPage} of {totalPages || 1}</small>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="table audit-table">
                        <thead>
                            <tr>{['Timestamp', 'User', 'Role', 'Action', 'Details', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(log => (
                                <tr key={log.id}>
                                    <td className="text-muted">{log.timestamp}</td>
                                    <td className="fw-semibold">{log.user}</td>
                                    <td><span className={`role-badge ${log.role === 'Admin' ? 'role-admin' : 'role-subscriber'}`}>{log.role}</span></td>
                                    <td><span className="action-badge">{log.action}</span></td>
                                    <td>{log.details}</td>
                                    <td>
                                        <span className={`status-badge status-${log.status}`}>{log.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <button className="btn btn-pagination" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft size={18} className="me-1" />
                        Previous
                    </button>
                    <div className="pagination-info">
                        <span className="page-number">{currentPage}</span>
                        <span className="text-muted mx-2">of</span>
                        <span className="page-number">{totalPages || 1}</span>
                    </div>
                    <button className="btn btn-pagination" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                        Next
                        <ChevronRight size={18} className="ms-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
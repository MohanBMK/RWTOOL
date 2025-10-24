import React, { useState } from 'react';
import './DownloadReport.css';
import { useNavigate, Routes, Route } from 'react-router-dom';

import PDFViewer from '../PDFViewer/PDFViewer';

const DownloadReportComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedFile,setSelectedFile] = useState(null);

    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedReports, setSelectedReports] = useState([]);

    const [reports, setReports] = useState([
        { id: 1, title: 'Q4 2024 Financial Report', description: 'Comprehensive quarterly financial statements, P&L analysis, and balance sheet review', domain: 'Finance', publishedDate: '15 Dec 2024', version: 'v1.2', favorite: false, fileName: 'Q4_2024_Financial_Report.pdf' },
        { id: 2, title: 'Risk Exposure Summary', description: 'Value at Risk (VaR), stress testing results, and compliance reporting metrics', domain: 'Risk Management', publishedDate: '18 Dec 2024', version: 'v2.0', favorite: false, fileName: 'Risk_Exposure_Summary.pdf' },
        { id: 3, title: 'Trading Performance Report', description: 'Trade blotter analysis, position tracking, and performance analytics dashboard', domain: 'Trading', publishedDate: '10 Dec 2024', version: 'v1.0', favorite: false, fileName: 'Trading_Performance_Report.pdf' },
        { id: 4, title: 'HR Analytics Monthly', description: 'Workforce metrics, hiring funnel analysis, retention and employee engagement data', domain: 'HR Analytics', publishedDate: '20 Dec 2024', version: 'v1.1', favorite: false, fileName: 'HR_Analytics_Monthly.pdf' },
        { id: 5, title: 'Operations KPI Dashboard', description: 'Process efficiency metrics, throughput analysis, SLA compliance, and incident tracking', domain: 'Operations', publishedDate: '22 Dec 2024', version: 'v2.1', favorite: false, fileName: 'Operations_KPI_Dashboard.pdf' },
        { id: 6, title: 'Compliance Audit Report', description: 'Audit trails, policy adherence tracking, and regulatory submission documentation', domain: 'Compliance', publishedDate: '12 Dec 2024', version: 'v1.0', favorite: false, fileName: 'Compliance_Audit_Report.pdf' }
    ]);

    const domains = ['Finance', 'Risk Management', 'Trading', 'HR Analytics', 'Operations', 'Compliance'];

    const filteredReports = reports.filter(r => {
        const search = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const dom = filterCategory === 'all' || r.domain === filterCategory;
        const fav = !showFavorites || r.favorite;
        return search && dom && fav;
    });

    const toggleFavorite = (id) => {
        setReports(reports.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
    };

    const getFavoritesCount = () => reports.filter(r => r.favorite).length;

    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop();
        link.click();
    };

    const handleSelectReport = (id) => {
        setSelectedReports(prev => 
            prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedReports.length === filteredReports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(filteredReports.map(r => r.id));
        }
    };

    const handleDownloadSelected = () => {
        
        // Download each selected report
        selectedReports.forEach(id => {
            const report = reports.find(r => r.id === id);
            if (report) {
                handleDownload(report.fileName);
            }
        });
        // Clear selections after download
        setSelectedReports([]);
    };

    if(selectedFile) return <PDFViewer fileName={selectedFile.fileName} displayName={selectedFile.displayName} onBack={() => setSelectedFile(null)} />;

    return (
        <div className="download-report-container">
            {/* Header Section */}
            <div className="hero-section mb-5">
                <div className="d-flex align-items-center mb-3">
                    <div className="hero-icon me-3">
                        <i className="bi bi-file-earmark-arrow-down"></i>
                    </div>
                    <div>
                        <h1 className="hero-title mb-2">Download Reports</h1>
                        <p className="hero-subtitle mb-0">
                            Access and download your reports of the respective approved domain
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Search and Filter */}
            <div className="search-filter-section card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                            <div className="search-wrapper">
                                <i className="bi bi-search search-icon"></i>
                                <input type="text" className="form-control search-input" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <select className="form-select filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="all">All Domains</option>
                                {domains.map(dom => <option key={dom} value={dom}>{dom}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className={`btn w-100 ${showFavorites ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setShowFavorites(!showFavorites)}
                            >
                                <i className="bi bi-star-fill me-2"></i>
                                Favorites
                                <span className="badge bg-light text-dark ms-2">{getFavoritesCount()}</span>
                            </button>
                        </div>
                    </div>
                    {selectedReports.length > 0 && (
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">
                                        <i className="bi bi-check-square me-2"></i>
                                        {selectedReports.length} report(s) selected
                                    </span>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={handleSelectAll}>
                                            {selectedReports.length === filteredReports.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                        <button className="btn btn-download" onClick={handleDownloadSelected}>
                                            <i className="bi bi-download me-2"></i>
                                            Download Selected
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reports */}
            {filteredReports.length > 0 ? (
                <div className="row g-4">
                    {filteredReports.map(r => (
                        <div key={r.id} className="col-12">
                            <div className="card report-card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <div className="form-check me-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={selectedReports.includes(r.id)}
                                                onChange={() => handleSelectReport(r.id)}
                                                style={{ width: '20px', height: '20px', marginTop: '5px', cursor: 'pointer' }}
                                            />
                                        </div>
                                        <div className="report-icon me-3">
                                            <i className="bi bi-file-earmark-text"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h4 className="report-card-title mb-0">{r.title}</h4>
                                                <button
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => toggleFavorite(r.id)}
                                                    style={{ fontSize: '1.5rem', color: r.favorite ? '#ffc107' : '#ccc' }}
                                                >
                                                    <i className={`bi bi-star${r.favorite ? '-fill' : ''}`}></i>
                                                </button>
                                            </div>
                                            <p className="report-description text-muted mb-3">{r.description}</p>
                                            <div className="report-meta d-flex flex-wrap gap-3 mb-4">
                                                {[
                                                    { icon: 'folder', label: 'Domain', value: r.domain },
                                                    { icon: 'calendar-event', label: 'Published', value: r.publishedDate },
                                                    { icon: 'tag', label: 'Version', value: r.version },
                                                    { icon: 'file-pdf', label: 'Format', value: 'PDF' }
                                                ].map((meta, i) => (
                                                    <span key={i} className="meta-item">
                                                        <i className={`bi bi-${meta.icon} me-1`}></i>
                                                        <strong>{meta.label}:</strong> {meta.value}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="d-flex gap-3 flex-wrap">
                                                <button className="btn btn-download" onClick={() => handleDownload(r.fileName)}>
                                                    <i className="bi bi-download me-2"></i>Download Report
                                                </button>
                                                <button className="btn btn-preview-new" onClick={() => setSelectedFile({ fileName: r.fileName, displayName: r.title })}>
                                                    <i className="bi bi-eye me-2"></i>Preview Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox no-results-icon"></i>
                        <h5 className="mt-3 mb-2">No Reports Found</h5>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DownloadReportComponent;
import React, { useState, useEffect } from 'react';
import './DownloadReport.css';
import { useNavigate, Routes, Route } from 'react-router-dom';
import folderService from '../../../services/folderservice';
import reportService from '../../../services/reportService';

import PDFViewer from '../PDFViewer/PDFViewer';

const DownloadReportComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedReports, setSelectedReports] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [domains, setDomains] = useState([]);
    const [statusMsg, setStatusMsg] = useState('');

    // TODO: Replace with actual user from auth context
    const currentUser = {
        name: 'Tony Stark',
        email: 'tony3000@stark.com',
        role: 'Subscriber'
    };

    // Fetch user's accessible files on component mount
    useEffect(() => {
        fetchUserFiles();
    }, []);

    const fetchUserFiles = async () => {
        try {
            setLoading(true);
            const files = await folderService.getUserAccessibleFiles(currentUser.email);
            
            // Transform files to reports format; display title without prefix before the first underscore and without extension; capture format from extension
            const transformedReports = files.map((file, index) => {
                const original = file.name || '';
                const underscoreIdx = original.indexOf('_');
                const afterPrefix = underscoreIdx >= 0 ? original.substring(underscoreIdx + 1) : original;
                const lastDot = afterPrefix.lastIndexOf('.');
                const display = lastDot > 0 ? afterPrefix.substring(0, lastDot) : afterPrefix;
                const ext = lastDot > 0 ? afterPrefix.substring(lastDot + 1).toLowerCase() : '';
                return {
                    id: index + 1,
                    title: display,
                    description: `File from ${file.folder} folder`,
                    domain: file.folder,
                    publishedDate: file.modified ? new Date(file.modified).toLocaleDateString() : 'N/A',
                    version: 'v1.0',
                    favorite: false,
                    size: file.size,
                    fileName: file.name,
                    folderPath: file.folder,
                    format: ext || 'unknown'
                };
            });

            // Load favorites from backend and mark reports
            let favs = [];
            try {
                favs = await reportService.getFavorites(currentUser.email);
            } catch (e) {
                // ignore errors; keep favorites empty
            }
            const favoredReports = transformedReports.map(r => ({
                ...r,
                favorite: favs.some(f => f.folder === r.folderPath && f.fileName === r.fileName)
            }));

            setReports(favoredReports);
            
            // Extract unique domains (folders)
            const uniqueDomains = [...new Set(files.map(f => f.folder))].sort();
            setDomains(uniqueDomains);
        } catch (error) {
            console.error('Error fetching user files:', error);
            setReports([]);
            setDomains([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = reports.filter(r => {
        const search = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const dom = filterCategory === 'all' || r.domain === filterCategory;
        const fav = !showFavorites || r.favorite;
        return search && dom && fav;
    });

    const toggleFavorite = async (id) => {
        const target = reports.find(r => r.id === id);
        if (!target) return;
        const userId = currentUser.email;

        // Optimistic update
        const newFav = !target.favorite;
        setReports(prev => prev.map(r => r.id === id ? { ...r, favorite: newFav } : r));

        try {
            if (newFav) {
                await reportService.addFavorite(userId, target.folderPath, target.fileName);
            } else {
                await reportService.removeFavorite(userId, target.folderPath, target.fileName);
            }
        } catch (e) {
            // revert on error
            setReports(prev => prev.map(r => r.id === id ? { ...r, favorite: !newFav } : r));
            setStatusMsg('Failed to update favorites.');
        }
    };

    const getFavoritesCount = () => reports.filter(r => r.favorite).length;

    const handleDownload = (report) => {
        // Download file from backend
        const downloadUrl = `http://localhost:8080/api/files/download?folder=${encodeURIComponent(report.folderPath)}&fileName=${encodeURIComponent(report.fileName)}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = report.fileName;
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

    const handleDownloadSelected = async () => {
        try {
            if (selectedReports.length === 0) return;
            if (selectedReports.length === 1) {
                const single = reports.find(r => r.id === selectedReports[0]);
                if (single) handleDownload(single);
                setSelectedReports([]);
                return;
            }

            const files = selectedReports
                .map(id => reports.find(r => r.id === id))
                .filter(Boolean)
                .map(r => ({ folder: r.folderPath, fileName: r.fileName }));

            setStatusMsg("Preparing ZIP for selected reports...");
            const blob = await reportService.downloadBatch(files, "selected_reports.zip");
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'selected_reports.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setStatusMsg("");
        } catch (e) {
            console.error('Batch download error:', e);
            setStatusMsg('Failed to download selected reports.');
        } finally {
            setSelectedReports([]);
        }
    };

    const handlePreviewReport = async (report) => {
        setStatusMsg("");
        try {
            const userId = currentUser?.email || "subscriber-demo";
            const data = await reportService.presignView(
                report.id.toString(),
                userId,
                report.folderPath,
                report.fileName
            );

            if (!data) {
                setStatusMsg("Preview not available.");
                return;
            }
            if (data.message && !data.url) {
                setStatusMsg(data.message);
                return;
            }
            if (!data.url) {
                setStatusMsg("No URL received for preview.");
                return;
            }

            setSelectedFile({
                fileName: report.fileName,
                displayName: report.title,
                presignedUrl: data.url,
                reportId: report.id
            });
        } catch (error) {
            console.error("Preview error:", error);
            setStatusMsg("Failed to preview report. Please try again.");
        }
    };

    if(selectedFile) {
        return (
            <PDFViewer 
                displayName={selectedFile.displayName}
                presignedUrl={selectedFile.presignedUrl}
                onBack={() => setSelectedFile(null)} 
            />
        );
    }

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
                        <div className="col-md-4">
                            <select className="form-select filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="all">All Domains</option>
                                {domains.map(dom => <option key={dom} value={dom}>{dom}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
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

            {/* Status Message */}
            {statusMsg && (
                <div className="alert alert-info alert-dismissible fade show" role="alert">
                    {statusMsg}
                    <button type="button" className="btn-close" onClick={() => setStatusMsg('')}></button>
                </div>
            )}

            {/* Reports */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your accessible files...</p>
                </div>
            ) : filteredReports.length > 0 ? (
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
                                            <div className="report-meta d-flex flex-wrap gap-3 mb-4">
                                                {[
                                                    { icon: 'folder', label: 'Domain', value: r.domain },
                                                    { icon: 'calendar-event', label: 'Published', value: r.publishedDate },
                                                    { icon: 'file-pdf', label: 'Format', value: r.format }
                                                ].map((meta, i) => (
                                                    <span key={i} className="meta-item">
                                                        <i className={`bi bi-${meta.icon} me-1`}></i>
                                                        <strong>{meta.label}:</strong> {meta.value}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="d-flex gap-3 flex-wrap">
                                                <button className="btn btn-download" onClick={() => handleDownload(r)}>
                                                    <i className="bi bi-download me-2"></i>Download Report
                                                </button>
                                                <button className="btn btn-preview-new" onClick={() => handlePreviewReport(r)}>
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
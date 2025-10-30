import React, { useEffect, useRef, useState } from 'react';
import './PDFViewer.css';
import reportViewerService from '../../../services/reportViewerService';

const PDFViewer = ({ fileName, folderPath, displayName, onBack }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState('idle');
    const pdfContainerRef = useRef(null);
    const iframeRef = useRef(null);

    const reportDisplayName = displayName || fileName;

    const pdfData = {
        fileName,
        displayName: reportDisplayName,
        folderPath
    };

    // Fetch PDF from backend on component mount
    useEffect(() => {
        const fetchPDF = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get preview URL using ReportViewerService
                const previewUrl = reportViewerService.getPreviewUrl(folderPath, fileName);
                setPdfUrl(previewUrl);
                setLoading(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setError('Failed to load PDF. Please try again.');
                setLoading(false);
            }
        };

        if (fileName && folderPath) {
            fetchPDF();
        } else {
            setError('Missing file information');
            setLoading(false);
        }
    }, [fileName, folderPath]);

    const handleBack = () => {
        if (typeof onBack === 'function') {
            onBack();
            return;
        }
        window.history.back();
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            pdfContainerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    const handleDownload = () => {
        if (downloadStatus === 'downloading') return;

        setDownloadStatus('downloading');

        // Trigger actual download from backend
        const downloadUrl = reportViewerService.getDownloadUrl(folderPath, fileName);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        setTimeout(() => {
            setDownloadStatus('completed');
            setTimeout(() => {
                setDownloadStatus('idle');
            }, 2500);
        }, 500);
    };

    return (
        <div className="pdf-viewer-container" ref={pdfContainerRef}>
            {downloadStatus !== 'idle' && (
                <div className={`download-status-toast ${downloadStatus}`}>
                    <div className="toast-title">
                        {downloadStatus === 'downloading' ? 'Preparing download…' : 'Download ready'}
                    </div>
                    <div className="toast-body">
                        {downloadStatus === 'completed' && (
                            <div className="toast-success">
                                <span className="checkmark">✓</span>
                                <span>Download started</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <header className="viewer-header">
                <div className="header-title">
                    <h2>RW Tool - Report Viewer</h2>
                    <span className="report-title">{pdfData.displayName}</span>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleBack}
                        style={{ marginRight: '10px' }}
                    >
                        ← Back
                    </button>    
                    <button 
                        className="btn btn-primary" 
                        onClick={handleDownload}
                        disabled={loading || error}
                    >
                        📥 Download PDF
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleFullscreen}
                    >
                        ⛶ Fullscreen
                    </button>
                </div>
            </header>

            <div className="pdf-content-area">
                {loading && (
                    <div className="pdf-loading">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading PDF...</p>
                    </div>
                )}

                {error && (
                    <div className="pdf-error">
                        <div className="error-icon">⚠️</div>
                        <h3>Error Loading PDF</h3>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={handleBack}>
                            Go Back
                        </button>
                    </div>
                )}

                {!loading && !error && pdfUrl && (
                    <iframe
                        ref={iframeRef}
                        src={pdfUrl}
                        title={reportDisplayName}
                        className="pdf-iframe"
                        frameBorder="0"
                    />
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
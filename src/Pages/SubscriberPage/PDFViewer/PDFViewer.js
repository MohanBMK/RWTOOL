import React, { useEffect, useState } from 'react';
import './PDFViewer.css';
 
export default function PDFViewer({
  displayName = 'Report',
  presignedUrl,
  onBack
}) {
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFitWidth, setIsFitWidth] = useState(false);
 
  useEffect(() => {
    setLoading(true);
    setIframeError(null);
    // Small delay to let iframe mount
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [presignedUrl]);
 
  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    setIsFitWidth(false);
  };
 
  const handleFitWidth = () => {
    setIsFitWidth(prev => !prev);
    // When fitting width, reset zoom to 1 for predictable sizing
    if (!isFitWidth) setZoomLevel(1);
  };
 
  const handleFullscreen = () => {
    const container = document.querySelector('.pdf-viewer-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };
 
  const handleDownload = () => {
    if (!presignedUrl) return;
    const a = document.createElement('a');
    a.href = presignedUrl;
    a.download = `${displayName || 'report'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
 
  return (
    <div className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="pdf-viewer-header">
        <div className="left">
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <h2 className="pdf-viewer-title" style={{ marginLeft: 12 }}>{displayName}</h2>
        </div>
        <div className="right" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Zoom controls */}
          <select
            className="zoom-select"
            value={zoomLevel}
            onChange={handleZoomChange}
            title="Zoom"
          >
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2">200%</option>
          </select>
          <button
            className={`btn ${isFitWidth ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleFitWidth}
            title={isFitWidth ? 'Actual Size' : 'Fit Width'}
          >
            {isFitWidth ? 'Actual Size' : 'Fit Width'}
          </button>
          {presignedUrl && (
            <>
              <button className="btn btn-primary" onClick={handleDownload} title="Download PDF">
                Download
              </button>
              <a
                className="btn btn-outline-primary"
                href={presignedUrl}
                target="_blank"
                rel="noreferrer"
                title="Open PDF in new tab"
              >
                Open in new tab
              </a>
            </>
          )}
          <button className="btn btn-secondary" onClick={handleFullscreen}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>
 
      {!presignedUrl && (
        <div className="pdf-viewer-empty">
          No PDF URL provided. Please go back and choose a report.
        </div>
      )}
 
      {presignedUrl && (
        <div className="pdf-viewer-frame-wrap" style={{ overflow: 'auto' }}>
          {loading && (
            <div className="pdf-viewer-loading">
              Loading preview…
            </div>
          )}
 
          {iframeError && (
            <div className="pdf-viewer-error">
              Could not display inside the app. Use "Open in new tab" above.
            </div>
          )}
 
          {!iframeError && (
            <div
              style={{
                transform: isFitWidth ? undefined : `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                width: isFitWidth ? '100%' : undefined
              }}
            >
              <iframe
                key={presignedUrl}
                src={presignedUrl}
                title={displayName}
                className="pdf-viewer-iframe"
                style={{ width: isFitWidth ? '100%' : '100%', height: 'calc(100vh - 140px)', border: 'none' }}
                onError={() => setIframeError('failed')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
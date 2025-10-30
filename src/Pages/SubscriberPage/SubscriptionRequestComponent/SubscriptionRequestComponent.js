import React, { useState, useEffect } from 'react';
import './SubscriptionRequest.css';
import domainService from '../../../services/domainService';
import subscriptionService from '../../../services/subscriptionService';
import 'bootstrap-icons/font/bootstrap-icons.css';
const SubscriptionRequestComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestingDomain, setRequestingDomain] = useState(null);
    const [requestReason, setRequestReason] = useState('');
    const [reasonError, setReasonError] = useState('');
 
    // Domain catalog fetched from backend
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [notification, setNotification] = useState('');
 
    // TODO: Replace with actual user from auth context/session
    // Example: const currentUser = useAuth(); or get from Redux/Context
    const currentUser = {
        name: 'Tony Stark',
        email: 'tony3000@stark.com',
        domain: 'Finance', // User's working domain (from profile)
        role: 'Subscriber'
    };
 
    // Fetch available domains and user subscriptions from backend
    useEffect(() => {
        fetchData();
    }, []);
 
    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch all domains
            const domainsData = await domainService.getAllDomains();
           
            // Fetch user's subscription requests
            const subscriptionsData = await subscriptionService.getRequestsByUser(currentUser.email);
            setUserSubscriptions(subscriptionsData);
           
            // Map domains with subscription status
            const domainsWithStatus = domainsData.map(domain => {
                const subscription = subscriptionsData.find(sub => sub.domainId === domain.id);
                return {
                    ...domain,
                    subscriptionId: subscription?.id || null,
                    status: subscription?.status?.toLowerCase() || null,
                    requestReason: subscription?.requestReason || '',
                    rejectionReason: subscription?.rejectionReason || ''
                };
            });
            setDomains(domainsWithStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
            setNotification('Error loading domains. Please try again.');
            setTimeout(() => setNotification(''), 3000);
        } finally {
            setLoading(false);
        }
    };
 
    const filteredDomains = domains.filter(d => {
        const q = searchQuery.toLowerCase();
        const match = d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
        return (filterStatus === 'all' || d.status === filterStatus) && match;
    });
 
    const handleRequest = (domain) => {
        setRequestingDomain(domain);
        setRequestReason('');
        setReasonError('');
        setShowRequestModal(true);
    };
 
    const handleSubmitRequest = async () => {
        if (!requestReason.trim()) {
            setReasonError('Please type a reason for your request');
            return;
        }
 
        try {
            // Create subscription request with user profile info
            const requestData = {
                domainId: requestingDomain.id,
                domainName: requestingDomain.name,
                requestReason: requestReason,
                userName: currentUser.name,
                userEmail: currentUser.email,
                userDepartment: currentUser.domain, // Send user's working domain
                userRole: currentUser.role
            };
 
            await subscriptionService.createRequest(requestData);
           
            // Refresh data to show updated status
            await fetchData();
           
            setNotification('Subscription request submitted successfully!');
            setTimeout(() => setNotification(''), 3000);
           
            setShowRequestModal(false);
            setRequestingDomain(null);
            setRequestReason('');
            setReasonError('');
        } catch (error) {
            const errorMessage = error.message || 'Failed to submit request';
            setReasonError(errorMessage);
        }
    };
 
    const handleCancel = async (domainId, subscriptionId) => {
        try {
            await subscriptionService.cancelRequest(subscriptionId, currentUser.email);
            await fetchData();
            setNotification('Request cancelled successfully');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            setNotification('Error cancelling request');
            setTimeout(() => setNotification(''), 3000);
        }
    };
    const getCount = (status) => domains.filter(d => d.status === status).length;
 
    return (
        <div className="subscription-container">
            {/* Notification */}
            {notification && (
                <div className="alert alert-info alert-dismissible fade show" role="alert" style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    minWidth: '300px'
                }}>
                    {notification}
                </div>
            )}
 
            {/* Hero Section */}
            <div className="hero-section mb-5">
                <div className="d-flex align-items-center mb-3">
                    <div className="hero-icon me-3">
                        <i className="bi bi-folder-check"></i>
                    </div>
                    <div>
                        <h1 className="hero-title mb-2">Domain Subscription Center</h1>
                        <p className="hero-subtitle mb-0">
                            Browse and request access to business domains like Finance, Risk Management, Trading, and HR Analytics
                        </p>
                    </div>
                </div>
            </div>
 
            {/* Search & Filter Section */}
            <div className="card shadow-sm mb-4 filter-card">
                <div className="card-body p-4">
                    <div className="row g-3 mb-3">
                        <div className="col-12">
                            <div className="search-wrapper">
                                <i className="bi bi-search search-icon"></i>
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder="Search domains by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button
                            className={`btn filter-btn ${filterStatus === 'all' ? 'active' : 'btn-outline-secondary'}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            <i className="bi bi-grid-3x3-gap me-2"></i>
                            All Domains
                            <span className="badge ms-2">{domains.length}</span>
                        </button>
                    </div>
                </div>
            </div>
 
            {/* Domains Section */}
            <div className="domains-header mb-4">
                <h4 className="domains-title">
                    <i className="bi bi-collection me-2"></i>
                    Available Domains
                </h4>
                <p className="domains-subtitle">
                    Showing {filteredDomains.length} of {domains.length} domains
                </p>
            </div>
 
            {filteredDomains.length === 0 ? (
                <div className="no-results card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox no-results-icon"></i>
                        <h5 className="mt-3 mb-2">No Domains Found</h5>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredDomains.map(d => (
                        <div key={d.id} className="col-12 col-lg-6">
                            <div className={`card domain-card shadow-sm h-100 report-card ${d.status || ''}`}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="domain-icon me-3">
                                            <i className="bi bi-folder-fill"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="domain-name mb-0">{d.name}</h5>
                                        </div>
                                        {d.status && (
                                            <span className={`status-badge badge ${
                                                d.status === 'approved' ? 'bg-success' :
                                                d.status === 'rejected' ? 'bg-danger' :
                                                'bg-warning text-dark'
                                            }`}>
                                                {d.status === 'approved' ? (
                                                    <><i className="bi bi-check-circle me-1"></i>Approved</>
                                                ) : d.status === 'rejected' ? (
                                                    <><i className="bi bi-x-circle me-1"></i>Rejected</>
                                                ) : (
                                                    <><i className="bi bi-clock me-1"></i>Pending</>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                   
                                    <div className="domain-meta mb-3">
                                        <span className="meta-item">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Description: {d.description}
                                        </span>
                                    </div>
 
                                    <div className="action-buttons">
                                        {d.status === 'approved' ? (
                                            <button className="btn btn-success w-100" disabled>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Access Granted
                                            </button>
                                        ) : d.status === 'pending' ? (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-warning flex-grow-1" disabled>
                                                    <i className="bi bi-hourglass-split me-2"></i>
                                                    Pending Approval
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleCancel(d.id, d.subscriptionId)}
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </div>
                                        ) : d.status === 'rejected' ? (
                                            <button className="btn btn-danger w-100" disabled>
                                                <i className="bi bi-x-circle me-2"></i>
                                                Request Rejected
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-gradient w-100"
                                                onClick={() => handleRequest(d)}
                                            >
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Request Access
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
 
            {/* Request Access Modal */}
            {showRequestModal && requestingDomain && (
                <div className="modal-backdrop" onClick={() => setShowRequestModal(false)} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1050
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Request Access to {requestingDomain.name}
                        </h3>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ color: '#666', marginBottom: '15px' }}>
                                <strong>Domain:</strong> {requestingDomain.name}
                            </p>
                            <p style={{ color: '#666', marginBottom: '15px' }}>
                                <strong>Description:</strong> {requestingDomain.description}
                            </p>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                                Reason for Request <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Please explain why you need access to this domain..."
                                value={requestReason}
                                onChange={(e) => {
                                    setRequestReason(e.target.value);
                                    if (reasonError) setReasonError('');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: reasonError ? '1px solid #dc3545' : '1px solid #ddd',
                                    fontSize: '14px'
                                }}
                            />
                            {reasonError && (
                                <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {reasonError}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowRequestModal(false)}
                                style={{ padding: '8px 20px' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmitRequest}
                                style={{ padding: '8px 20px' }}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
 
export default SubscriptionRequestComponent;
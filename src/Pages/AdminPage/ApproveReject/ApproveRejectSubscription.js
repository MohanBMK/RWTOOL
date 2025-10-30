import React, { useEffect, useState } from "react";
import "./ApproveRejectSubscription.css";
import subscriptionService from "../../../services/subscriptionService";

const ApproveRejectSubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingSubscription, setRejectingSubscription] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");
    const [loadingAD, setLoadingAD] = useState(true);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoadingAD(true);
            const data = await subscriptionService.getAllRequests();
            
            // Transform backend data to match component structure
            const subscriptionsWithAD = data.map((sub) => {
                // Use domain from user profile (userDepartment field contains the domain from profile)
                const profileDomain = sub.userDepartment || 'Unknown';
                return {
                    id: sub.id,
                    name: sub.userName,
                    email: sub.userEmail,
                    domain: sub.domainName,
                    date: new Date(sub.requestedDate).toLocaleDateString(),
                    reviewedDate: sub.reviewedDate ? new Date(sub.reviewedDate).toLocaleDateString() : null,
                    status: sub.status,
                    requestReason: sub.requestReason,
                    rejectionReason: sub.rejectionReason,
                    userDepartment: sub.userDepartment,
                    userRole: sub.userRole,
                    actualDepartment: profileDomain, // Show domain from user profile
                    departmentMatch: profileDomain.toLowerCase() === sub.domainName.toLowerCase(),
                    profileDomain: profileDomain
                };
            });

            setSubscriptions(subscriptionsWithAD);
        } catch (error) {
            console.error('Error fetching subscription requests:', error);
            setNotification('Error loading subscription requests');
            setTimeout(() => setNotification(''), 3000);
        } finally {
            setLoadingAD(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await subscriptionService.approveRequest(id);
            setNotification('Subscription request approved successfully!');
            setTimeout(() => setNotification(''), 3000);
            // Refresh the list
            await fetchPendingRequests();
        } catch (error) {
            console.error('Error approving request:', error);
            setNotification('Error approving request');
            setTimeout(() => setNotification(''), 3000);
        }
    };

    const openRejectModal = (subscription) => {
        setRejectingSubscription(subscription);
        if (!subscription.departmentMatch) {
            setRejectionReason("Requested domain does not match user's department");
        } else {
            setRejectionReason("");
        }
        setShowRejectModal(true);
    };

    const closeRejectModal = () => {
        setShowRejectModal(false);
        setRejectingSubscription(null);
        setRejectionReason("");
        setOtherReasonText("");
    };

    const handleReject = async () => {
        const finalReason = rejectionReason === "Other" ? otherReasonText : rejectionReason;
        
        if (!finalReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        try {
            await subscriptionService.rejectRequest(rejectingSubscription.id, finalReason);
            setNotification('Subscription request rejected');
            setTimeout(() => setNotification(''), 3000);
            closeRejectModal();
            // Refresh the list
            await fetchPendingRequests();
        } catch (error) {
            console.error('Error rejecting request:', error);
            setNotification('Error rejecting request');
            setTimeout(() => setNotification(''), 3000);
        }
    };

    const filteredData = subscriptions.filter((sub) => {
        const matchSearch =
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            sub.domain.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "All" ? true : sub.status.toUpperCase() === filter.toUpperCase();
        return matchSearch && matchFilter;
    });

    const pendingCount = subscriptions.filter((s) => s.status === "PENDING").length;

    return (
        <div className="ar-container">
            {/* Notification */}
            {notification && (
                <div className="ar-notification">{notification}</div>
            )}
            <div className="ar-top-header">
                <div className="ar-header-left">
                    <h2 className="ar-title">Subscription Requests</h2>
                    <p className="ar-subtitle">Manage and review employee subscription requests</p>
                </div>
                <div className="ar-header-right">
                    <span className="ar-pending-count">
                        
                        {pendingCount} Pending
                    </span>
                </div>
            </div>

            <div className="ar-search-filter-section">
                <input
                    type="text"
                    className="ar-search-input"
                    placeholder="Search by name, email, or domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="ar-filter-buttons">
                    {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                        <button
                            key={tab}
                            className={`ar-filter-tab ${filter === tab ? "ar-active" : ""}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ar-cards-container">
                {loadingAD && (
                    <div className="ar-loading">Loading AD information...</div>
                )}
                {!loadingAD && filteredData.map((sub) => (
                    <div key={sub.id} className={`ar-subscription-card ${!sub.departmentMatch && sub.status.toUpperCase() === 'PENDING' ? 'ar-mismatch' : ''}`}>
                        <div className="ar-sub-info">
                            <h5 className="ar-name">{sub.name}</h5>
                            <p className="ar-email">{sub.email}</p>
                            <p className="ar-date">Request Date: {sub.date}</p>
                            {sub.reviewedDate && (
                                <p className="ar-date" style={{color: '#6c757d'}}>
                                    Reviewed Date: {sub.reviewedDate}
                                </p>
                            )}
                            
                            <div className="ar-domain-comparison">
                                <div className="ar-domain-row">
                                    <span className="ar-domain-label">Requested Domain:</span>
                                    <span className="ar-domain-value">{sub.domain}</span>
                                </div>
                                <div className="ar-domain-row">
                                    <span className="ar-domain-label">User Profile Domain:</span>
                                    <span className={`ar-domain-value ${sub.departmentMatch ? 'ar-match' : 'ar-no-match'}`}>
                                        {sub.actualDepartment}
                                        {sub.departmentMatch ? ' ✓' : ' ✗'}
                                    </span>
                                </div>
                            </div>
                            
                            {sub.requestReason && (
                                <div className="ar-request-reason">
                                    <strong>Request Reason:</strong>
                                    <p>{sub.requestReason}</p>
                                </div>
                            )}
                            
                            {!sub.departmentMatch && sub.status.toUpperCase() === 'PENDING' && (
                                <div className="ar-warning">
                                    ⚠️ Department mismatch detected
                                </div>
                            )}
                            
                            {sub.status.toUpperCase() === 'REJECTED' && sub.rejectionReason && (
                                <div className="ar-rejection-reason">
                                    <strong>Rejection Reason:</strong> {sub.rejectionReason}
                                </div>
                            )}
                        </div>

                        <div className="ar-sub-actions">
                            <span
                                className={`ar-status-badge ${
                                    sub.status.toUpperCase() === "PENDING"
                                        ? "ar-status-pending"
                                        : sub.status.toUpperCase() === "APPROVED"
                                        ? "ar-status-approved"
                                        : "ar-status-rejected"
                                }`}
                            >
                                {sub.status}
                            </span>

                            {sub.status.toUpperCase() === "PENDING" && (
                                <div className="ar-btn-group">
                                    <button
                                        className="ar-action-btn ar-approve"
                                        onClick={() => handleApprove(sub.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="ar-action-btn ar-reject"
                                        onClick={() => openRejectModal(sub)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {!loadingAD && filteredData.length === 0 && (
                    <p className="ar-no-data">No records found.</p>
                )}
            </div>

            {showRejectModal && rejectingSubscription && (
                <div className="ar-modal-backdrop" onClick={closeRejectModal}>
                    <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="ar-modal-title">Reject Subscription Request</h2>
                        <div className="ar-modal-user-info">
                            <p><strong>User:</strong> {rejectingSubscription.name}</p>
                            <p><strong>Email:</strong> {rejectingSubscription.email}</p>
                            <p><strong>Requested Domain:</strong> {rejectingSubscription.domain}</p>
                            <p><strong>Actual Department:</strong> {rejectingSubscription.actualDepartment}</p>
                        </div>
                        
                        {rejectingSubscription.requestReason && (
                            <div className="ar-modal-request-reason">
                                <strong>📝 Subscriber's Request Reason:</strong>
                                <p>{rejectingSubscription.requestReason}</p>
                            </div>
                        )}
                        
                        <div className="ar-modal-form">
                            <label className="ar-modal-label">Reason for Rejection *</label>
                            <select
                                className="ar-modal-select"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            >
                                <option value="">-- Select Reason --</option>
                                <option value="Requested domain does not match user's department">
                                    Requested domain does not match user's department
                                </option>
                                <option value="User not found in Active Directory">
                                    User not found in Active Directory
                                </option>
                                <option value="Insufficient permissions for requested domain">
                                    Insufficient permissions for requested domain
                                </option>
                                <option value="Domain access restricted">
                                    Domain access restricted
                                </option>
                                <option value="Other">Other</option>
                            </select>
                            
                            {rejectionReason === "Other" && (
                                <textarea
                                    className="ar-modal-textarea"
                                    placeholder="Please specify the reason..."
                                    rows="3"
                                    value={otherReasonText}
                                    onChange={(e) => setOtherReasonText(e.target.value)}
                                />
                            )}
                        </div>
                        
                        <div className="ar-modal-actions">
                            <button className="ar-modal-btn ar-cancel" onClick={closeRejectModal}>
                                Cancel
                            </button>
                            <button className="ar-modal-btn ar-confirm-reject" onClick={handleReject}>
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveRejectSubscription;
import React, { useEffect, useState } from "react";
import "./ApproveRejectSubscription.css";

const AD_USERS = [
  {
    email: "bhavesh@gmail.com",
    name: "Bhavesh",
    department: "Finance",
    adGroup: "Wealth Compliance",
    title: "Financial Analyst"
  },
  {
    email: "ram@gmail.com",
    name: "Ram",
    department: "Operations",
    adGroup: "Wealth User Admin",
    title: "Operations Manager"
  },
  {
    email: "rahul@gmail.com",
    name: "Rahul",
    department: "Finance",
    adGroup: "Wealth Compliance",
    title: "Senior Accountant"
  },
  {
    email: "priya@gmail.com",
    name: "Priya",
    department: "HR",
    adGroup: "HR Analytics Group",
    title: "HR Manager"
  },
  {
    email: "john.doe@company.com",
    name: "John Doe",
    department: "Compliance",
    adGroup: "Wealth Compliance",
    title: "Compliance Officer"
  },
  {
    email: "jane.smith@company.com",
    name: "Jane Smith",
    department: "Compliance",
    adGroup: "Wealth Compliance",
    title: "Senior Compliance Analyst"
  },
  {
    email: "admin.user@company.com",
    name: "Admin User",
    department: "IT",
    adGroup: "Wealth User Admin",
    title: "System Administrator"
  }
];

const getUserDepartment = (email) => {
  const user = AD_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user ? user.department : "Unknown";
};

const ApproveRejectSubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingSubscription, setRejectingSubscription] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");
    const [loadingAD, setLoadingAD] = useState(true);

    useEffect(() => {
        setLoadingAD(true);
        const dummyData = [
            {
                id: 1,
                name: "Bhavesh",
                email: "bhavesh@gmail.com",
                domain: "Finance",
                date: "15/01/2025",
                status: "Pending",
                requestReason: "I need access to Finance domain to generate quarterly financial reports and analyze budget allocations for my department."
            },
            {
                id: 2,
                name: "Ram",
                email: "ram@gmail.com",
                domain: "Investment",
                date: "12/01/2025",
                status: "Pending",
                requestReason: "Required for managing investment portfolios and tracking asset performance metrics."
            },
            {
                id: 3,
                name: "Rahul",
                email: "rahul@gmail.com",
                domain: "Finance",
                date: "14/01/2025",
                status: "Pending",
                requestReason: "Need to access financial statements and compliance reports for audit purposes."
            },
        ];

        const subscriptionsWithAD = dummyData.map((sub) => {
            const department = getUserDepartment(sub.email);
            return {
                ...sub,
                actualDepartment: department,
                departmentMatch: department.toLowerCase() === sub.domain.toLowerCase()
            };
        });

        setSubscriptions(subscriptionsWithAD);
        setLoadingAD(false);
    }, []);

    const handleApprove = (id) => {
        setSubscriptions((prev) =>
            prev.map((sub) =>
                sub.id === id ? { ...sub, status: "Approved" } : sub
            )
        );
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

    const handleReject = () => {
        const finalReason = rejectionReason === "Other" ? otherReasonText : rejectionReason;
        
        if (!finalReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        setSubscriptions((prev) =>
            prev.map((sub) =>
                sub.id === rejectingSubscription.id 
                    ? { ...sub, status: "Rejected", rejectionReason: finalReason } 
                    : sub
            )
        );
        closeRejectModal();
    };

    const filteredData = subscriptions.filter((sub) => {
        const matchSearch =
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            sub.domain.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "All" ? true : sub.status === filter;
        return matchSearch && matchFilter;
    });

    const pendingCount = subscriptions.filter((s) => s.status === "Pending").length;

    return (
        <div className="ar-container">
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
                    <div key={sub.id} className={`ar-subscription-card ${!sub.departmentMatch && sub.status === 'Pending' ? 'ar-mismatch' : ''}`}>
                        <div className="ar-sub-info">
                            <h5 className="ar-name">{sub.name}</h5>
                            <p className="ar-email">{sub.email}</p>
                            <p className="ar-date">Request Date: {sub.date}</p>
                            
                            <div className="ar-domain-comparison">
                                <div className="ar-domain-row">
                                    <span className="ar-domain-label">Requested Domain:</span>
                                    <span className="ar-domain-value">{sub.domain}</span>
                                </div>
                                <div className="ar-domain-row">
                                    <span className="ar-domain-label">Actual Department (AD):</span>
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
                            
                            {!sub.departmentMatch && sub.status === 'Pending' && (
                                <div className="ar-warning">
                                    ⚠️ Department mismatch detected
                                </div>
                            )}
                            
                            {sub.status === 'Rejected' && sub.rejectionReason && (
                                <div className="ar-rejection-reason">
                                    <strong>Rejection Reason:</strong> {sub.rejectionReason}
                                </div>
                            )}
                        </div>

                        <div className="ar-sub-actions">
                            <span
                                className={`ar-status-badge ${
                                    sub.status === "Pending"
                                        ? "ar-status-pending"
                                        : sub.status === "Approved"
                                        ? "ar-status-approved"
                                        : "ar-status-rejected"
                                }`}
                            >
                                {sub.status}
                            </span>

                            {sub.status === "Pending" && (
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
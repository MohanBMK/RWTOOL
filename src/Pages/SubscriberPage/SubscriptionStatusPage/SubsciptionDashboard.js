// SubscriptionDashboard.js
import React, { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge"; // default export
import subscriptionService from "../../../services/subscriptionService";

export default function SubscriptionDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock user email - In production, get from auth context/session
    const currentUserEmail = "tony3000@stark.com";

    useEffect(() => {
        fetchUserSubscriptions();
    }, []);

    const fetchUserSubscriptions = async () => {
        try {
            setLoading(true);
            const data = await subscriptionService.getRequestsByUser(currentUserEmail);
            setSubscriptions(data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = subscriptions.filter((sub) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            q === "" ||
            sub.domainName.toLowerCase().includes(q) ||
            (sub.rejectionReason && sub.rejectionReason.toLowerCase().includes(q));
        const matchesStatus =
            statusFilter === "All" ||
            sub.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const primaryGradient = "linear-gradient(135deg, #0473EA 0%, #0A5BB8 50%, #064A8E 100%)";
    const subtitleBlue = "#4A89C7";

    return (
        <div
            style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                background:
                    "linear-gradient(180deg, rgba(4,115,234,0.06) 0%, rgba(10,91,184,0.03) 50%, rgba(6,74,142,0.02) 100%)",
                padding: 32,
                minHeight: "100vh",
            }}
        >
            <main style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div
                    style={{
                        borderRadius: 20,
                        overflow: "hidden",
                        background: "#fff",
                        boxShadow: "0 8px 30px rgba(6,74,142,0.08)",
                    }}
                >
                    <div style={{ height: 8, background: primaryGradient }} />

                    <div style={{ padding: "22px 28px" }}>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "1.9rem",
                                color: "#064A8E",
                                fontWeight: 700,
                            }}
                        >
                            Subscription Status
                        </h1>
                        <p
                            style={{
                                margin: "8px 0 18px",
                                color: subtitleBlue,
                                fontSize: "0.95rem",
                            }}
                        >
                            Manage your report subscriptions and review their approval status
                        </p>

                        {/* Search + Filters */}
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 16,
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <div style={{ flex: "1 1 300px", position: "relative" }}>
                                <i
                                    className="bi bi-search"
                                    style={{
                                        position: "absolute",
                                        left: 14,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#9fbde8",
                                    }}
                                />
                                <input
                                    type="search"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: "100%",
                                        height: 48,
                                        borderRadius: 28,
                                        paddingLeft: 44,
                                        border: "1px solid #e7f0ff",
                                        backgroundColor: "#fbfdff",
                                    }}
                                />
                            </div>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["All", "Pending", "Approved", "Rejected"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        style={{
                                            minWidth: 90,
                                            borderRadius: 20,
                                            fontWeight: 500,
                                            border: "none",
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            background:
                                                statusFilter === status
                                                    ? status === "Approved"
                                                        ? "#10b981"
                                                        : status === "Pending"
                                                            ? "#f59e0b"
                                                            : status === "Rejected"
                                                                ? "#ef4444"
                                                                : "#0473EA"
                                                    : "#f1f5f9",
                                            color:
                                                statusFilter === status
                                                    ? "white"
                                                    : "rgba(6,74,142,0.8)",
                                        }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "48px 0" }}>
                                <p style={{ color: "#7a8fae" }}>Loading subscriptions...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "48px 0" }}>
                                <div
                                    style={{
                                        width: 88,
                                        height: 88,
                                        margin: "0 auto 12px",
                                        borderRadius: "50%",
                                        background: "#f3fbff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <i
                                        className="bi bi-inbox"
                                        style={{ fontSize: "2rem", color: "#9fbde8" }}
                                    />
                                </div>
                                <p style={{ color: "#7a8fae" }}>No subscriptions yet.</p>
                            </div>
                        ) : (
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: 14,
                                }}
                            >
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #eef6ff" }}>
                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "1rem 0",
                                                fontSize: 12,
                                                color: "#7d8fa8",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Report Domain
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                                padding: "1rem 0",
                                                fontSize: 12,
                                                color: "#7d8fa8",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            style={{
                                                borderBottom: "1px solid #f1f5fb",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <td style={{ padding: "12px 0" }}>
                                                <div style={{ fontWeight: 600, color: "#0b3f7a" }}>
                                                    {sub.domainName}
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            background: "#f6fbff",
                                                            color: "#064A8E",
                                                            padding: "4px 8px",
                                                            borderRadius: 12,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        <i className="bi bi-calendar3 me-1"></i>
                                                        {new Date(sub.requestedDate).toLocaleDateString(
                                                            "en-US",
                                                            { month: "short", day: "numeric", year: "numeric" }
                                                        )}
                                                    </span>
                                                </div>
                                                {sub.status.toLowerCase() === 'rejected' && sub.rejectionReason && (
                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                            padding: "8px 12px",
                                                            background: "#fee2e2",
                                                            borderLeft: "3px solid #ef4444",
                                                            borderRadius: 4,
                                                        }}
                                                    >
                                                        <div style={{ fontSize: 11, color: "#991b1b", fontWeight: 600, marginBottom: 2 }}>
                                                            REJECTION REASON
                                                        </div>
                                                        <div style={{ fontSize: 13, color: "#dc2626" }}>
                                                            {sub.rejectionReason}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <StatusBadge status={sub.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
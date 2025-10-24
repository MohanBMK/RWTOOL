// StatusBadge.js
import React from "react";

export default function StatusBadge({ status }) {
    const s = (status || "").toLowerCase();

    const config =
        s === "approved"
            ? {
                bgColor: "rgba(16,185,129,0.15)",
                textColor: "#059669",
                dotColor: "#10b981",
                label: "Approved",
            }
            : s === "rejected"
                ? {
                    bgColor: "rgba(239,68,68,0.15)",
                    textColor: "#dc2626",
                    dotColor: "#ef4444",
                    label: "Rejected",
                }
                : s === "pending"
                    ? {
                        bgColor: "rgba(245,158,11,0.15)",
                        textColor: "#d97706",
                        dotColor: "#f59e0b",
                        label: "Pending",
                    }
                    : {
                        bgColor: "rgba(11,63,122,0.06)",
                        textColor: "#064A8E",
                        dotColor: "#9ca3af",
                        label: status || "Unknown",
                    };

    return (
        <span
            className="d-inline-flex align-items-center px-3 py-1"
            style={{
                color: config.textColor,
                backgroundColor: config.bgColor,
                borderRadius: "16px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
            }}
        >
            <span
                style={{
                    width: 8,
                    height: 8,
                    backgroundColor: config.dotColor,
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: 6,
                    boxShadow: "0 0 6px rgba(0,0,0,0.04)",
                }}
            />
            <span style={{ fontSize: "0.9rem" }}>{config.label}</span>
        </span>
    );
}
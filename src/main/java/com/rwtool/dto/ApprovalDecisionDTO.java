package com.rwtool.dto;

public class ApprovalDecisionDTO {
    private String action; // "APPROVE" or "REJECT"
    private String rejectionReason; // Only for REJECT

    public ApprovalDecisionDTO() {}

    public ApprovalDecisionDTO(String action, String rejectionReason) {
        this.action = action;
        this.rejectionReason = rejectionReason;
    }

    // Getters and Setters
    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
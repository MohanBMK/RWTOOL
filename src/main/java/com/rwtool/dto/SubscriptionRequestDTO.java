package com.rwtool.dto;

public class SubscriptionRequestDTO {
    private String domainId;
    private String domainName;
    private String requestReason;
    private String userName;
    private String userEmail;
    private String userDepartment;
    private String userRole;

    // Constructors
    public SubscriptionRequestDTO() {}

    public SubscriptionRequestDTO(String domainId, String domainName, String requestReason,
                                  String userName, String userEmail, String userDepartment, String userRole) {
        this.domainId = domainId;
        this.domainName = domainName;
        this.requestReason = requestReason;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userDepartment = userDepartment;
        this.userRole = userRole;
    }

    // Getters and Setters
    public String getDomainId() {
        return domainId;
    }

    public void setDomainId(String domainId) {
        this.domainId = domainId;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public String getRequestReason() {
        return requestReason;
    }

    public void setRequestReason(String requestReason) {
        this.requestReason = requestReason;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserDepartment() {
        return userDepartment;
    }

    public void setUserDepartment(String userDepartment) {
        this.userDepartment = userDepartment;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
}
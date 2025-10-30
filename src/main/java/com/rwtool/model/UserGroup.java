package com.rwtool.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_groups")
public class UserGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ad_group_name", nullable = false, unique = true)
    private String adGroupName;

    @Column(name = "associated_domain")
    private String associatedDomain;

    @ElementCollection
    @CollectionTable(name = "user_group_folders", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "folder_path")
    private List<String> folderAccess = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_group_members", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "user_email")
    private List<String> members = new ArrayList<>();

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    public UserGroup() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdGroupName() {
        return adGroupName;
    }

    public void setAdGroupName(String adGroupName) {
        this.adGroupName = adGroupName;
    }

    public String getAssociatedDomain() {
        return associatedDomain;
    }

    public void setAssociatedDomain(String associatedDomain) {
        this.associatedDomain = associatedDomain;
    }

    public List<String> getFolderAccess() {
        return folderAccess;
    }

    public void setFolderAccess(List<String> folderAccess) {
        this.folderAccess = folderAccess;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}
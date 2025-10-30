package com.rwtool.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "domains")
public class Domain {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    public Domain() {
        this.createdDate = LocalDateTime.now();
    }

    public Domain(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdDate = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
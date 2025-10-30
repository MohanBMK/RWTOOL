package com.rwtool.controller;

import com.rwtool.model.UserGroup;
import com.rwtool.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-groups")
@CrossOrigin(origins = "http://localhost:3000")
public class UserGroupController {

    @Autowired
    private UserGroupService userGroupService;

    // Get all user groups
    @GetMapping
    public ResponseEntity<List<UserGroup>> getAllGroups() {
        try {
            List<UserGroup> groups = userGroupService.getAllGroups();
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get user group by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserGroup> getGroupById(@PathVariable Long id) {
        try {
            return userGroupService.getGroupById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get groups by user email
    @GetMapping("/user/{email}")
    public ResponseEntity<List<UserGroup>> getGroupsByUserEmail(@PathVariable String email) {
        try {
            List<UserGroup> groups = userGroupService.getGroupsByUserEmail(email);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get user's accessible folders
    @GetMapping("/user/{email}/folders")
    public ResponseEntity<List<String>> getUserAccessibleFolders(@PathVariable String email) {
        try {
            List<String> folders = userGroupService.getUserAccessibleFolders(email);
            return ResponseEntity.ok(folders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new user group
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody UserGroup group) {
        try {
            UserGroup created = userGroupService.createGroup(group);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Update user group
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable Long id, @RequestBody UserGroup group) {
        try {
            UserGroup updated = userGroupService.updateGroup(id, group);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Delete user group
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        try {
            userGroupService.deleteGroup(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Add user to group
    @PostMapping("/{id}/members")
    public ResponseEntity<?> addUserToGroup(@PathVariable Long id, @RequestBody String userEmail) {
        try {
            UserGroup group = userGroupService.getGroupById(id)
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            if (!group.getMembers().contains(userEmail)) {
                group.getMembers().add(userEmail);
                userGroupService.updateGroup(id, group);
            }
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Remove user from group
    @DeleteMapping("/{id}/members/{email}")
    public ResponseEntity<?> removeUserFromGroup(@PathVariable Long id, @PathVariable String email) {
        try {
            userGroupService.removeUserFromGroup(id, email);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

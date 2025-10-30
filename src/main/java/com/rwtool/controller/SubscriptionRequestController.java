package com.rwtool.controller;

import com.rwtool.dto.ApprovalDecisionDTO;
import com.rwtool.dto.SubscriptionRequestDTO;
import com.rwtool.model.SubscriptionRequest;
import com.rwtool.service.SubscriptionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionRequestController {

    @Autowired
    private SubscriptionRequestService subscriptionRequestService;

    // Get all subscription requests (for admin)
    @GetMapping
    public ResponseEntity<List<SubscriptionRequest>> getAllRequests() {
        try {
            List<SubscriptionRequest> requests = subscriptionRequestService.getAllRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get pending requests (for admin)
    @GetMapping("/pending")
    public ResponseEntity<List<SubscriptionRequest>> getPendingRequests() {
        try {
            List<SubscriptionRequest> requests = subscriptionRequestService.getPendingRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get requests by user email (for user dashboard)
    @GetMapping("/user/{email}")
    public ResponseEntity<List<SubscriptionRequest>> getRequestsByUser(@PathVariable String email) {
        try {
            List<SubscriptionRequest> requests = subscriptionRequestService.getRequestsByUser(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get request by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionRequest> getRequestById(@PathVariable String id) {
        try {
            SubscriptionRequest request = subscriptionRequestService.getRequestById(id);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Create new subscription request (for users)
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody SubscriptionRequestDTO requestDTO) {
        try {
            SubscriptionRequest request = subscriptionRequestService.createRequest(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Approve or reject request (for admin)
    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewRequest(
            @PathVariable String id,
            @RequestBody ApprovalDecisionDTO decision) {
        try {
            SubscriptionRequest request = subscriptionRequestService.processRequest(id, decision);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Approve request (for admin)
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable String id) {
        try {
            SubscriptionRequest request = subscriptionRequestService.approveRequest(id);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Reject request (for admin)
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable String id,
            @RequestBody ApprovalDecisionDTO decision) {
        try {
            String reason = decision.getRejectionReason();
            SubscriptionRequest request = subscriptionRequestService.rejectRequest(id, reason);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Cancel request (for users)
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRequest(
            @PathVariable String id,
            @RequestParam String userEmail) {
        try {
            subscriptionRequestService.cancelRequest(id, userEmail);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get dashboard statistics (for admin)
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            List<SubscriptionRequest> allRequests = subscriptionRequestService.getAllRequests();

            long totalRequests = allRequests.size();
            long pendingCount = allRequests.stream()
                    .filter(r -> "PENDING".equalsIgnoreCase(r.getStatus()))
                    .count();
            long approvedCount = allRequests.stream()
                    .filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus()))
                    .count();
            long rejectedCount = allRequests.stream()
                    .filter(r -> "REJECTED".equalsIgnoreCase(r.getStatus()))
                    .count();

            double approvalRate = totalRequests > 0
                    ? (approvedCount * 100.0) / (approvedCount + rejectedCount)
                    : 0.0;

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalRequests", totalRequests);
            stats.put("pendingRequests", pendingCount);
            stats.put("approvedRequests", approvedCount);
            stats.put("rejectedRequests", rejectedCount);
            stats.put("approvalRate", Math.round(approvalRate * 10) / 10.0); // Round to 1 decimal

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
package com.rwtool.repository;


import com.rwtool.model.RoutingLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutingLogRepository extends JpaRepository<RoutingLog, Long> {
}
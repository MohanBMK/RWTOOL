package com.rwtool.repository;

import com.rwtool.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    Optional<UserGroup> findByAdGroupName(String adGroupName);
    Optional<UserGroup> findByAssociatedDomain(String associatedDomain);

    @Query("SELECT g FROM UserGroup g JOIN g.members m WHERE m = :email")
    List<UserGroup> findByMemberEmail(@Param("email") String email);
}
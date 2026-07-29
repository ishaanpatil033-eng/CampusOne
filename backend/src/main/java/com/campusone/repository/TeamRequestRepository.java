package com.campusone.repository;

import com.campusone.entity.TeamRequest;
import com.campusone.entity.TeamRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRequestRepository extends JpaRepository<TeamRequest, Long> {

    List<TeamRequest> findAllByOrderByCreatedAtDesc();

    List<TeamRequest> findByStatusOrderByCreatedAtDesc(TeamRequestStatus status);

    @Query("SELECT DISTINCT tr FROM TeamRequest tr JOIN tr.requiredSkills s " +
           "WHERE LOWER(s) LIKE LOWER(CONCAT('%', :skill, '%')) " +
           "ORDER BY tr.createdAt DESC")
    List<TeamRequest> findBySkill(@Param("skill") String skill);

    @Query("SELECT DISTINCT tr FROM TeamRequest tr JOIN tr.requiredSkills s " +
           "WHERE LOWER(s) LIKE LOWER(CONCAT('%', :skill, '%')) " +
           "AND tr.status = :status " +
           "ORDER BY tr.createdAt DESC")
    List<TeamRequest> findBySkillAndStatus(
            @Param("skill") String skill,
            @Param("status") TeamRequestStatus status
    );
}

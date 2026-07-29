package com.campusone.repository;

import com.campusone.entity.Announcement;
import com.campusone.entity.AnnouncementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    /**
     * All active announcements (not expired), pinned first, then newest.
     */
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.expiresAt IS NULL OR a.expiresAt > :now) " +
           "ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findActive(@Param("now") LocalDateTime now);

    /**
     * Active announcements filtered by type.
     */
    @Query("SELECT a FROM Announcement a WHERE " +
           "a.type = :type AND " +
           "(a.expiresAt IS NULL OR a.expiresAt > :now) " +
           "ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findActiveByType(
            @Param("type") AnnouncementType type,
            @Param("now") LocalDateTime now
    );

    /** Count urgent active announcements (for badge counters). */
    @Query("SELECT COUNT(a) FROM Announcement a WHERE " +
           "a.type = 'URGENT' AND " +
           "(a.expiresAt IS NULL OR a.expiresAt > :now)")
    long countActiveUrgent(@Param("now") LocalDateTime now);
}

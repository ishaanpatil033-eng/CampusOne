package com.campusone.repository;

import com.campusone.entity.Event;
import com.campusone.entity.EventCategory;
import com.campusone.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /** All non-cancelled events ordered by soonest first. */
    @Query("SELECT e FROM Event e WHERE e.status != 'CANCELLED' ORDER BY e.eventDate ASC")
    List<Event> findAllActive();

    /** Active events filtered by category. */
    @Query("SELECT e FROM Event e WHERE e.category = :category AND e.status != 'CANCELLED' ORDER BY e.eventDate ASC")
    List<Event> findByCategoryActive(@Param("category") EventCategory category);

    /** Events created by a specific organizer. */
    List<Event> findByOrganizerUidOrderByEventDateAsc(String organizerUid);

    /** Mark past UPCOMING events as COMPLETED automatically. */
    @Query("SELECT e FROM Event e WHERE e.status = 'UPCOMING' AND e.eventDate < :now")
    List<Event> findExpiredUpcoming(@Param("now") LocalDateTime now);
}

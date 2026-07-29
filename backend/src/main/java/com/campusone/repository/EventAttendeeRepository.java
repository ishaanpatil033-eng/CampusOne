package com.campusone.repository;

import com.campusone.entity.EventAttendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface EventAttendeeRepository extends JpaRepository<EventAttendee, Long> {

    Optional<EventAttendee> findByEventIdAndUserUid(Long eventId, String userUid);

    boolean existsByEventIdAndUserUid(Long eventId, String userUid);

    void deleteByEventIdAndUserUid(Long eventId, String userUid);

    /** Returns the set of event IDs the user is registered for. Used to build isRegistered flags. */
    @Query("SELECT ea.event.id FROM EventAttendee ea WHERE ea.userUid = :userUid")
    Set<Long> findEventIdsByUserUid(@Param("userUid") String userUid);

    int countByEventId(Long eventId);
}

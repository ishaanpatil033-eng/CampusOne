package com.campusone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_event_status",   columnList = "status"),
        @Index(name = "idx_event_category", columnList = "category"),
        @Index(name = "idx_event_date",     columnList = "event_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "event_end_date")
    private LocalDateTime eventEndDate;

    @Column(length = 255)
    private String location;

    /** Null means unlimited capacity. */
    @Column(name = "max_attendees")
    private Integer maxAttendees;

    /** Denormalized counter — updated atomically with EventAttendee inserts/deletes. */
    @Column(name = "current_attendees", nullable = false)
    @Builder.Default
    private Integer currentAttendees = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private EventCategory category = EventCategory.OTHER;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(length = 255)
    private String organizer;

    @Column(name = "organizer_uid", length = 128)
    private String organizerUid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EventStatus status = EventStatus.UPCOMING;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

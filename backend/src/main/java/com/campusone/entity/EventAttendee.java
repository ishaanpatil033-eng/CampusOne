package com.campusone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "event_attendees",
    uniqueConstraints = @UniqueConstraint(
            name = "uk_event_user",
            columnNames = {"event_id", "user_uid"}
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAttendee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "user_uid", nullable = false, length = 128)
    private String userUid;

    @Column(name = "user_name", length = 255)
    private String userName;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Column(name = "registered_at", nullable = false)
    @Builder.Default
    private LocalDateTime registeredAt = LocalDateTime.now();
}

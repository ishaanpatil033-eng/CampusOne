package com.campusone.dto.response;

import com.campusone.entity.Event;
import com.campusone.entity.EventCategory;
import com.campusone.entity.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private LocalDateTime eventEndDate;
    private String location;
    private Integer maxAttendees;
    private Integer currentAttendees;
    private EventCategory category;
    private String imageUrl;
    private String organizer;
    private String organizerUid;
    private EventStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Whether the requesting user is registered for this event. */
    private boolean registered;
    /** Whether the event has reached max capacity. */
    private boolean full;

    public static EventResponse fromEntity(Event e, boolean registered) {
        boolean full = e.getMaxAttendees() != null
                && e.getCurrentAttendees() >= e.getMaxAttendees();
        return EventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .eventDate(e.getEventDate())
                .eventEndDate(e.getEventEndDate())
                .location(e.getLocation())
                .maxAttendees(e.getMaxAttendees())
                .currentAttendees(e.getCurrentAttendees())
                .category(e.getCategory())
                .imageUrl(e.getImageUrl())
                .organizer(e.getOrganizer())
                .organizerUid(e.getOrganizerUid())
                .status(e.getStatus())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .registered(registered)
                .full(full)
                .build();
    }
}

package com.campusone.dto.request;

import com.campusone.entity.EventCategory;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private LocalDateTime eventEndDate;

    private String location;

    private EventCategory category = EventCategory.OTHER;

    @Min(value = 1, message = "Max attendees must be at least 1")
    private Integer maxAttendees;

    private String imageUrl;

    private String organizer;
}

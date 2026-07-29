package com.campusone.dto.response;

import com.campusone.entity.Announcement;
import com.campusone.entity.AnnouncementType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {

    private Long id;
    private String title;
    private String content;
    private AnnouncementType type;
    private String author;
    private String department;
    private Boolean isPinned;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean expired;

    public static AnnouncementResponse fromEntity(Announcement a) {
        return AnnouncementResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .content(a.getContent())
                .type(a.getType())
                .author(a.getAuthor())
                .department(a.getDepartment())
                .isPinned(a.getIsPinned())
                .expiresAt(a.getExpiresAt())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .expired(a.getExpiresAt() != null && a.getExpiresAt().isBefore(LocalDateTime.now()))
                .build();
    }
}

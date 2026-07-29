package com.campusone.dto.response;

import com.campusone.entity.ItemCategory;
import com.campusone.entity.ItemStatus;
import com.campusone.entity.ItemType;
import com.campusone.entity.LostFoundItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LostFoundResponse {

    private Long id;
    private String title;
    private String description;
    private ItemType type;
    private String imageUrl;
    private String location;
    private ItemCategory category;
    private String reportedByUid;
    private String reportedByName;
    private String reportedByContact;
    private ItemStatus status;
    private String claimedByUid;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LostFoundResponse fromEntity(LostFoundItem item) {
        return LostFoundResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .type(item.getType())
                .imageUrl(item.getImageUrl())
                .location(item.getLocation())
                .category(item.getCategory())
                .reportedByUid(item.getReportedByUid())
                .reportedByName(item.getReportedByName())
                .reportedByContact(item.getReportedByContact())
                .status(item.getStatus())
                .claimedByUid(item.getClaimedByUid())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}

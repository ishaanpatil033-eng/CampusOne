package com.campusone.dto.response;

import com.campusone.entity.ProjectType;
import com.campusone.entity.TeamRequest;
import com.campusone.entity.TeamRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamRequestResponse {

    private Long id;
    private String title;
    private String description;
    private ProjectType projectType;
    private Set<String> requiredSkills;
    private Integer teamSize;
    private Integer currentSize;
    private String contactInfo;
    private TeamRequestStatus status;
    private String postedByUid;
    private String postedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TeamRequestResponse fromEntity(TeamRequest tr) {
        return TeamRequestResponse.builder()
                .id(tr.getId())
                .title(tr.getTitle())
                .description(tr.getDescription())
                .projectType(tr.getProjectType())
                .requiredSkills(tr.getRequiredSkills())
                .teamSize(tr.getTeamSize())
                .currentSize(tr.getCurrentSize())
                .contactInfo(tr.getContactInfo())
                .status(tr.getStatus())
                .postedByUid(tr.getPostedByUid())
                .postedByName(tr.getPostedByName())
                .createdAt(tr.getCreatedAt())
                .updatedAt(tr.getUpdatedAt())
                .build();
    }
}

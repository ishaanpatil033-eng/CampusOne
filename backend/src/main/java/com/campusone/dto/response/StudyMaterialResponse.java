package com.campusone.dto.response;

import com.campusone.entity.FileType;
import com.campusone.entity.StudyMaterial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyMaterialResponse {

    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private String fileName;
    private FileType fileType;
    private String subject;
    private String department;
    private String uploadedByUid;
    private String uploadedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static StudyMaterialResponse fromEntity(StudyMaterial m) {
        return StudyMaterialResponse.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .fileUrl(m.getFileUrl())
                .fileName(m.getFileName())
                .fileType(m.getFileType())
                .subject(m.getSubject())
                .department(m.getDepartment())
                .uploadedByUid(m.getUploadedByUid())
                .uploadedByName(m.getUploadedByName())
                .createdAt(m.getCreatedAt())
                .updatedAt(m.getUpdatedAt())
                .build();
    }
}

package com.campusone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials", indexes = {
        @Index(name = "idx_sm_subject",    columnList = "subject"),
        @Index(name = "idx_sm_department", columnList = "department")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_url", nullable = false, length = 1024)
    private String fileUrl;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", length = 30)
    @Builder.Default
    private FileType fileType = FileType.OTHER;

    @Column(length = 100)
    private String subject;

    @Column(length = 100)
    private String department;

    @Column(name = "uploaded_by_uid", length = 128)
    private String uploadedByUid;

    @Column(name = "uploaded_by_name", length = 255)
    private String uploadedByName;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

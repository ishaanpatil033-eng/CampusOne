package com.campusone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "team_requests", indexes = {
        @Index(name = "idx_tr_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class TeamRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_type", length = 30)
    @Builder.Default
    private ProjectType projectType = ProjectType.OTHER;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "team_request_skills",
            joinColumns = @JoinColumn(name = "team_request_id")
    )
    @Column(name = "skill", length = 100)
    @Builder.Default
    private Set<String> requiredSkills = new HashSet<>();

    @Column(name = "team_size")
    @Builder.Default
    private Integer teamSize = 4;

    @Column(name = "current_size")
    @Builder.Default
    private Integer currentSize = 1;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TeamRequestStatus status = TeamRequestStatus.OPEN;

    @Column(name = "posted_by_uid", length = 128)
    private String postedByUid;

    @Column(name = "posted_by_name", length = 255)
    private String postedByName;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

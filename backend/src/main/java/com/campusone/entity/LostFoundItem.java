package com.campusone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "lost_found_items", indexes = {
        @Index(name = "idx_lf_type",   columnList = "type"),
        @Index(name = "idx_lf_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class LostFoundItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ItemType type;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ItemCategory category = ItemCategory.OTHER;

    @Column(name = "reported_by_uid", length = 128)
    private String reportedByUid;

    @Column(name = "reported_by_name", length = 255)
    private String reportedByName;

    @Column(name = "reported_by_contact", length = 255)
    private String reportedByContact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private ItemStatus status = ItemStatus.ACTIVE;

    @Column(name = "claimed_by_uid", length = 128)
    private String claimedByUid;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

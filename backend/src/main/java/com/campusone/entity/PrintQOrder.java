package com.campusone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "printq_orders", indexes = {
        @Index(name = "idx_pq_user", columnList = "user_uid"),
        @Index(name = "idx_pq_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PrintQOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_uid", nullable = false, length = 128)
    private String userUid;

    @Column(name = "user_name", length = 255)
    private String userName;

    @Column(name = "file_url", nullable = false, length = 1024)
    private String fileUrl;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "is_color")
    @Builder.Default
    private Boolean isColor = false;

    @Column(name = "spiral_binding")
    @Builder.Default
    private Boolean spiralBinding = false;

    @Column(name = "lamination")
    @Builder.Default
    private Boolean lamination = false;

    @Column(name = "pickup_time_slot", length = 100)
    private String pickupTimeSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

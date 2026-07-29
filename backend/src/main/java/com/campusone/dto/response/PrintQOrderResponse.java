package com.campusone.dto.response;

import com.campusone.entity.OrderStatus;
import com.campusone.entity.PrintQOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrintQOrderResponse {
    private Long id;
    private String userUid;
    private String userName;
    private String fileUrl;
    private String fileName;
    private Integer pageCount;
    private Boolean isColor;
    private Boolean spiralBinding;
    private Boolean lamination;
    private String pickupTimeSlot;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PrintQOrderResponse fromEntity(PrintQOrder o) {
        return PrintQOrderResponse.builder()
                .id(o.getId())
                .userUid(o.getUserUid())
                .userName(o.getUserName())
                .fileUrl(o.getFileUrl())
                .fileName(o.getFileName())
                .pageCount(o.getPageCount())
                .isColor(o.getIsColor())
                .spiralBinding(o.getSpiralBinding())
                .lamination(o.getLamination())
                .pickupTimeSlot(o.getPickupTimeSlot())
                .status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}

package com.campusone.dto.response;

import com.campusone.entity.CanteenOrder;
import com.campusone.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CanteenOrderResponse {
    private Long id;
    private String userUid;
    private String userName;
    private String itemsJson;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CanteenOrderResponse fromEntity(CanteenOrder o) {
        return CanteenOrderResponse.builder()
                .id(o.getId())
                .userUid(o.getUserUid())
                .userName(o.getUserName())
                .itemsJson(o.getItemsJson())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}

package com.campusone.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCanteenOrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<CanteenOrderItemDto> items;

    @NotNull(message = "Total amount is required")
    private Double totalAmount;
}

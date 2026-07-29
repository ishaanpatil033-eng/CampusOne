package com.campusone.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CanteenOrderItemDto {
    @NotBlank
    private String id;
    
    @NotBlank
    private String name;
    
    @NotNull
    @Min(1)
    private Integer quantity;
    
    @NotNull
    @Min(0)
    private Double price;
}

package com.campusone.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePrintQOrderRequest {

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    @NotBlank(message = "File name is required")
    private String fileName;

    private Integer pageCount;
    private Boolean isColor = false;
    private Boolean spiralBinding = false;
    private Boolean lamination = false;

    @NotBlank(message = "Pickup time slot is required")
    private String pickupTimeSlot;
}

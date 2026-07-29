package com.campusone.dto.request;

import com.campusone.entity.ItemCategory;
import com.campusone.entity.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLostFoundRequest {

    @NotNull(message = "Item type (LOST or FOUND) is required")
    private ItemType type;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String imageUrl;

    @NotBlank(message = "Location is required")
    private String location;

    private ItemCategory category = ItemCategory.OTHER;

    private String reportedByContact;
}

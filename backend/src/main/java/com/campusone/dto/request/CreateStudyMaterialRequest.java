package com.campusone.dto.request;

import com.campusone.entity.FileType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateStudyMaterialRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    private String fileName;

    private FileType fileType = FileType.OTHER;

    @NotBlank(message = "Subject is required")
    private String subject;

    private String department;
}

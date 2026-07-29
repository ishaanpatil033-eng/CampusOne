package com.campusone.dto.request;

import com.campusone.entity.ProjectType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeamRequestRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private ProjectType projectType = ProjectType.OTHER;

    private Set<String> requiredSkills = new HashSet<>();

    @Min(value = 1, message = "Team size must be at least 1")
    private Integer teamSize = 4;

    private String contactInfo;
}

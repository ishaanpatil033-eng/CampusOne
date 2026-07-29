package com.campusone.controller;

import com.campusone.dto.request.CreateStudyMaterialRequest;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.StudyMaterialResponse;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.service.StudyMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-materials")
@RequiredArgsConstructor
@Slf4j
public class StudyMaterialController {

    private final StudyMaterialService studyMaterialService;

    /**
     * GET /api/study-materials
     * GET /api/study-materials?subject=Mathematics
     * GET /api/study-materials?department=CS
     * GET /api/study-materials?subject=CS&department=Engineering
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudyMaterialResponse>>> getMaterials(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String department
    ) {
        List<StudyMaterialResponse> materials = studyMaterialService.getMaterials(subject, department);
        return ResponseEntity.ok(ApiResponse.success(materials));
    }

    /**
     * GET /api/study-materials/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyMaterialResponse>> getById(@PathVariable Long id) {
        StudyMaterialResponse material = studyMaterialService.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudyMaterial", "id", id));
        return ResponseEntity.ok(ApiResponse.success(material));
    }

    /**
     * POST /api/study-materials
     * Creates a study material entry (stores metadata + Firebase Storage URL).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StudyMaterialResponse>> create(
            @RequestBody @Valid CreateStudyMaterialRequest request,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid  = (String) claims.get("uid");
        String name = (String) claims.getOrDefault("name", "Anonymous");
        StudyMaterialResponse created = studyMaterialService.create(request, uid, name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Study material shared successfully", created));
    }
}

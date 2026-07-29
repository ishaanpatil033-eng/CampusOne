package com.campusone.controller;

import com.campusone.dto.response.AnnouncementResponse;
import com.campusone.dto.response.ApiResponse;
import com.campusone.entity.AnnouncementType;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@Slf4j
public class AnnouncementController {

    private final AnnouncementService announcementService;

    /**
     * GET /api/announcements
     * GET /api/announcements?type=URGENT
     * GET /api/announcements?type=COLLEGE
     * GET /api/announcements?type=DEPARTMENT
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getAnnouncements(
            @RequestParam(required = false) AnnouncementType type
    ) {
        List<AnnouncementResponse> announcements = announcementService.getAnnouncements(type);
        return ResponseEntity.ok(ApiResponse.success(announcements));
    }

    /**
     * GET /api/announcements/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> getById(@PathVariable Long id) {
        AnnouncementResponse response = announcementService.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/announcements/stats
     * Returns summary counts for the dashboard badge.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        long urgentCount = announcementService.countActiveUrgent();
        return ResponseEntity.ok(ApiResponse.success(Map.of("urgentCount", urgentCount)));
    }
}

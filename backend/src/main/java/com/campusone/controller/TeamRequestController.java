package com.campusone.controller;

import com.campusone.dto.request.CreateTeamRequestRequest;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.TeamRequestResponse;
import com.campusone.entity.TeamRequestStatus;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.service.TeamRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/team-requests")
@RequiredArgsConstructor
@Slf4j
public class TeamRequestController {

    private final TeamRequestService teamRequestService;

    /**
     * GET /api/team-requests
     * GET /api/team-requests?skill=React
     * GET /api/team-requests?status=OPEN
     * GET /api/team-requests?skill=Python&status=OPEN
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamRequestResponse>>> getRequests(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) TeamRequestStatus status
    ) {
        List<TeamRequestResponse> requests = teamRequestService.getRequests(skill, status);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    /**
     * GET /api/team-requests/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamRequestResponse>> getById(@PathVariable Long id) {
        TeamRequestResponse tr = teamRequestService.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TeamRequest", "id", id));
        return ResponseEntity.ok(ApiResponse.success(tr));
    }

    /**
     * POST /api/team-requests
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TeamRequestResponse>> create(
            @RequestBody @Valid CreateTeamRequestRequest request,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid  = (String) claims.get("uid");
        String name = (String) claims.getOrDefault("name", "Anonymous");
        TeamRequestResponse created = teamRequestService.create(request, uid, name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team request posted successfully", created));
    }

    /**
     * PATCH /api/team-requests/{id}/toggle-status
     * Toggles OPEN <-> CLOSED. Only the original poster can do this.
     */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<TeamRequestResponse>> toggleStatus(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid = (String) claims.get("uid");
        TeamRequestResponse updated = teamRequestService.toggleStatus(id, uid);
        return ResponseEntity.ok(ApiResponse.success("Status updated", updated));
    }
}

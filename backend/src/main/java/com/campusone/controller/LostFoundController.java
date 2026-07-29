package com.campusone.controller;

import com.campusone.dto.request.CreateLostFoundRequest;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.LostFoundResponse;
import com.campusone.entity.ItemType;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.service.LostFoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lost-found")
@RequiredArgsConstructor
@Slf4j
public class LostFoundController {

    private final LostFoundService lostFoundService;

    /**
     * GET /api/lost-found
     * GET /api/lost-found?type=LOST
     * GET /api/lost-found?q=iphone
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LostFoundResponse>>> getItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(name = "q", required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.success(lostFoundService.getItems(type, keyword)));
    }

    /**
     * GET /api/lost-found/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LostFoundResponse>> getById(@PathVariable Long id) {
        LostFoundResponse item = lostFoundService.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostFoundItem", "id", id));
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    /**
     * POST /api/lost-found
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LostFoundResponse>> report(
            @RequestBody @Valid CreateLostFoundRequest request,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid  = (String) claims.get("uid");
        String name = (String) claims.getOrDefault("name", "Anonymous");
        LostFoundResponse created = lostFoundService.report(request, uid, name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item reported successfully", created));
    }

    /**
     * PATCH /api/lost-found/{id}/claim
     */
    @PatchMapping("/{id}/claim")
    public ResponseEntity<ApiResponse<LostFoundResponse>> claim(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid = (String) claims.get("uid");
        LostFoundResponse updated = lostFoundService.markAsClaimed(id, uid);
        return ResponseEntity.ok(ApiResponse.success("Item marked as claimed", updated));
    }
}

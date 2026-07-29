package com.campusone.controller;

import com.campusone.dto.request.CreateEventRequest;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.EventResponse;
import com.campusone.entity.EventCategory;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;

    /**
     * GET /api/events
     * GET /api/events?category=TECHNICAL
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEvents(
            @RequestParam(required = false) EventCategory category,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String userUid = (String) claims.get("uid");
        return ResponseEntity.ok(ApiResponse.success(eventService.getEvents(category, userUid)));
    }

    /**
     * GET /api/events/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getById(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String userUid = (String) claims.get("uid");
        EventResponse event = eventService.getById(id, userUid)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    /**
     * POST /api/events
     */
    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> create(
            @RequestBody @Valid CreateEventRequest request,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid  = (String) claims.get("uid");
        String name = (String) claims.getOrDefault("name", "Anonymous");
        EventResponse created = eventService.create(request, uid, name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", created));
    }

    /**
     * POST /api/events/{id}/register
     */
    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<EventResponse>> register(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid   = (String) claims.get("uid");
        String name  = (String) claims.getOrDefault("name", "Anonymous");
        String email = (String) claims.getOrDefault("email", "");
        EventResponse response = eventService.register(id, uid, name, email);
        return ResponseEntity.ok(ApiResponse.success("Registered successfully", response));
    }

    /**
     * DELETE /api/events/{id}/register
     */
    @DeleteMapping("/{id}/register")
    public ResponseEntity<ApiResponse<EventResponse>> unregister(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid = (String) claims.get("uid");
        EventResponse response = eventService.unregister(id, uid);
        return ResponseEntity.ok(ApiResponse.success("Unregistered successfully", response));
    }
}

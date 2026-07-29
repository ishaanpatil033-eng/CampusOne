package com.campusone.controller;

import com.campusone.dto.response.AdminStatsResponse;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.UserResponse;
import com.campusone.entity.Role;
import com.campusone.entity.User;
import com.campusone.repository.UserRepository;
import com.campusone.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    private void requireAdmin(Map<String, Object> claims) {
        String uid = (String) claims.get("uid");
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        if (user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Requires ADMIN privileges");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats(
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        requireAdmin(claims);
        return ResponseEntity.ok(ApiResponse.success(adminService.getSystemStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        requireAdmin(claims);
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        requireAdmin(claims);
        return ResponseEntity.ok(ApiResponse.success(adminService.updateUserRole(id, role)));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        requireAdmin(claims);
        adminService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    @DeleteMapping("/lost-found/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLostFoundItem(
            @PathVariable Long id,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        requireAdmin(claims);
        adminService.deleteLostFoundItem(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully", null));
    }
}

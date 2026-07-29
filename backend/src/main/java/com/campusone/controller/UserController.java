package com.campusone.controller;

import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.UserResponse;
import com.campusone.security.FirebaseAuthenticationToken;
import com.campusone.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * POST /api/users/sync
     * Called after Firebase login on the frontend.
     * Verifies the Firebase ID token (via SecurityFilter) and creates/fetches the user in DB.
     */
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<UserResponse>> syncUser(
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String firebaseUid = (String) claims.get("uid");
        String email       = (String) claims.get("email");
        String name        = (String) claims.get("name");
        String picture     = (String) claims.get("picture");

        UserResponse user = userService.syncUser(firebaseUid, email, name, picture);
        return ResponseEntity.ok(ApiResponse.success("User synced successfully", user));
    }

    /**
     * GET /api/users/me
     * Returns the current authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String firebaseUid = (String) claims.get("uid");
        UserResponse user = userService.getCurrentUserProfile(firebaseUid);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}

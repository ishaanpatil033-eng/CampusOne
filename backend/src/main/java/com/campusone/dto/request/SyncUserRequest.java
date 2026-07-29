package com.campusone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Optional request body for user sync.
 * The Firebase ID token is sent via Authorization header (Bearer <token>).
 * This DTO can carry additional fields in the future.
 */
@Data
@NoArgsConstructor
public class SyncUserRequest {
    // Reserved for future fields (e.g., device info, preferences)
}

package com.campusone.service;

import com.campusone.dto.response.UserResponse;
import com.campusone.entity.User;

import java.util.Optional;

public interface UserService {

    /**
     * Sync a Firebase-authenticated user with the local database.
     * Creates the user if not found, otherwise returns existing.
     *
     * @param firebaseUid   Firebase UID from verified token
     * @param email         User's email
     * @param displayName   User's display name
     * @param photoUrl      User's photo URL
     * @return UserResponse with the synced user profile
     */
    UserResponse syncUser(String firebaseUid, String email, String displayName, String photoUrl);

    /**
     * Find a user by their Firebase UID.
     */
    Optional<User> findByFirebaseUid(String firebaseUid);

    /**
     * Find a user by their database ID.
     */
    Optional<User> findById(Long id);

    /**
     * Get the current authenticated user's profile.
     */
    UserResponse getCurrentUserProfile(String firebaseUid);
}

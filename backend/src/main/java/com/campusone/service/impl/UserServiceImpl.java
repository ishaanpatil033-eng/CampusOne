package com.campusone.service.impl;

import com.campusone.dto.response.UserResponse;
import com.campusone.entity.Role;
import com.campusone.entity.User;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.UserRepository;
import com.campusone.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserResponse syncUser(String firebaseUid, String email, String displayName, String photoUrl) {
        log.debug("Syncing user with Firebase UID: {}", firebaseUid);

        User user = userRepository.findByFirebaseUid(firebaseUid)
                .map(existing -> updateUserIfNeeded(existing, email, displayName, photoUrl))
                .orElseGet(() -> createNewUser(firebaseUid, email, displayName, photoUrl));

        log.info("User synced successfully: id={}, email={}", user.getId(), user.getEmail());
        return UserResponse.fromEntity(user);
    }

    @Override
    public Optional<User> findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserResponse getCurrentUserProfile(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with Firebase UID: " + firebaseUid));
        return UserResponse.fromEntity(user);
    }

    // ──────────── Private helpers ────────────

    private User createNewUser(String firebaseUid, String email, String displayName, String photoUrl) {
        log.info("Creating new user: email={}", email);
        Role role = userRepository.count() == 0 ? Role.ADMIN : Role.STUDENT;
        User newUser = User.builder()
                .firebaseUid(firebaseUid)
                .email(email)
                .displayName(displayName)
                .photoUrl(photoUrl)
                .role(role)
                .isActive(true)
                .build();
        return userRepository.save(newUser);
    }

    private User updateUserIfNeeded(User existing, String email, String displayName, String photoUrl) {
        boolean changed = false;

        if (displayName != null && !displayName.equals(existing.getDisplayName())) {
            existing.setDisplayName(displayName);
            changed = true;
        }
        if (photoUrl != null && !photoUrl.equals(existing.getPhotoUrl())) {
            existing.setPhotoUrl(photoUrl);
            changed = true;
        }

        if (changed) {
            log.debug("Updating user profile: id={}", existing.getId());
            return userRepository.save(existing);
        }
        return existing;
    }
}

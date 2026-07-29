package com.campusone.service.impl;

import com.campusone.dto.response.AdminStatsResponse;
import com.campusone.dto.response.UserResponse;
import com.campusone.entity.Role;
import com.campusone.entity.User;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.AnnouncementRepository;
import com.campusone.repository.EventRepository;
import com.campusone.repository.LostFoundRepository;
import com.campusone.repository.UserRepository;
import com.campusone.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final LostFoundRepository lostFoundRepository;
    private final AnnouncementRepository announcementRepository;

    @Override
    public AdminStatsResponse getSystemStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalEvents(eventRepository.count())
                .totalLostFoundItems(lostFoundRepository.count())
                .totalAnnouncements(announcementRepository.count())
                .build();
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setRole(role);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event", "id", eventId);
        }
        eventRepository.deleteById(eventId);
    }

    @Override
    @Transactional
    public void deleteLostFoundItem(Long itemId) {
        if (!lostFoundRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("LostFoundItem", "id", itemId);
        }
        lostFoundRepository.deleteById(itemId);
    }
}

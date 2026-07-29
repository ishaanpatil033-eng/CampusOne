package com.campusone.service;

import com.campusone.dto.response.AdminStatsResponse;
import com.campusone.dto.response.UserResponse;
import com.campusone.entity.Role;

import java.util.List;

public interface AdminService {
    AdminStatsResponse getSystemStats();
    List<UserResponse> getAllUsers();
    UserResponse updateUserRole(Long userId, Role role);
    void deleteEvent(Long eventId);
    void deleteLostFoundItem(Long itemId);
}

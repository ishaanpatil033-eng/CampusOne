package com.campusone.service;

import com.campusone.dto.response.AnnouncementResponse;
import com.campusone.entity.AnnouncementType;

import java.util.List;
import java.util.Optional;

public interface AnnouncementService {

    /** Fetch all active announcements, optionally filtered by type. */
    List<AnnouncementResponse> getAnnouncements(AnnouncementType type);

    /** Fetch a single announcement by ID. */
    Optional<AnnouncementResponse> getById(Long id);

    /** Count currently active urgent announcements. */
    long countActiveUrgent();
}

package com.campusone.service.impl;

import com.campusone.dto.response.AnnouncementResponse;
import com.campusone.entity.AnnouncementType;
import com.campusone.repository.AnnouncementRepository;
import com.campusone.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository repo;

    @Override
    public List<AnnouncementResponse> getAnnouncements(AnnouncementType type) {
        LocalDateTime now = LocalDateTime.now();
        List<?> results = (type != null)
                ? repo.findActiveByType(type, now)
                : repo.findActive(now);

        log.debug("Fetched {} announcements (type={})", results.size(), type);

        return results.stream()
                .map(a -> AnnouncementResponse.fromEntity((com.campusone.entity.Announcement) a))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AnnouncementResponse> getById(Long id) {
        return repo.findById(id).map(AnnouncementResponse::fromEntity);
    }

    @Override
    public long countActiveUrgent() {
        return repo.countActiveUrgent(LocalDateTime.now());
    }
}

package com.campusone.service.impl;

import com.campusone.dto.request.CreateLostFoundRequest;
import com.campusone.dto.response.LostFoundResponse;
import com.campusone.entity.ItemStatus;
import com.campusone.entity.ItemType;
import com.campusone.entity.LostFoundItem;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.LostFoundRepository;
import com.campusone.service.LostFoundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class LostFoundServiceImpl implements LostFoundService {

    private final LostFoundRepository repo;

    @Override
    public List<LostFoundResponse> getItems(ItemType type, String keyword) {
        List<LostFoundItem> items;
        if (keyword != null && !keyword.isBlank()) {
            items = repo.searchByKeyword(keyword.trim());
            if (type != null) {
                items = items.stream()
                        .filter(i -> i.getType() == type)
                        .collect(Collectors.toList());
            }
        } else if (type != null) {
            items = repo.findByTypeOrderByCreatedAtDesc(type);
        } else {
            items = repo.findAllByOrderByCreatedAtDesc();
        }
        return items.stream().map(LostFoundResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    public Optional<LostFoundResponse> getById(Long id) {
        return repo.findById(id).map(LostFoundResponse::fromEntity);
    }

    @Override
    @Transactional
    public LostFoundResponse report(CreateLostFoundRequest req, String reporterUid, String reporterName) {
        LostFoundItem item = LostFoundItem.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .type(req.getType())
                .imageUrl(req.getImageUrl())
                .location(req.getLocation())
                .category(req.getCategory() != null ? req.getCategory() : com.campusone.entity.ItemCategory.OTHER)
                .reportedByUid(reporterUid)
                .reportedByName(reporterName)
                .reportedByContact(req.getReportedByContact())
                .build();
        LostFoundItem saved = repo.save(item);
        log.info("Lost/Found item reported: id={}, type={}, title={}", saved.getId(), saved.getType(), saved.getTitle());
        return LostFoundResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public LostFoundResponse markAsClaimed(Long id, String claimerUid) {
        LostFoundItem item = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostFoundItem", "id", id));
        if (item.getStatus() == ItemStatus.CLAIMED) {
            throw new IllegalStateException("Item is already marked as claimed");
        }
        item.setStatus(ItemStatus.CLAIMED);
        item.setClaimedByUid(claimerUid);
        LostFoundItem saved = repo.save(item);
        log.info("Item {} marked as claimed by {}", id, claimerUid);
        return LostFoundResponse.fromEntity(saved);
    }
}

package com.campusone.service;

import com.campusone.dto.request.CreateLostFoundRequest;
import com.campusone.dto.response.LostFoundResponse;
import com.campusone.entity.ItemType;

import java.util.List;
import java.util.Optional;

public interface LostFoundService {

    List<LostFoundResponse> getItems(ItemType type, String keyword);

    Optional<LostFoundResponse> getById(Long id);

    LostFoundResponse report(CreateLostFoundRequest request, String reporterUid, String reporterName);

    LostFoundResponse markAsClaimed(Long id, String claimerUid);
}

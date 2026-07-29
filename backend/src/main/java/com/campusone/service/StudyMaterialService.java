package com.campusone.service;

import com.campusone.dto.request.CreateStudyMaterialRequest;
import com.campusone.dto.response.StudyMaterialResponse;

import java.util.List;
import java.util.Optional;

public interface StudyMaterialService {

    List<StudyMaterialResponse> getMaterials(String subject, String department);

    Optional<StudyMaterialResponse> getById(Long id);

    StudyMaterialResponse create(CreateStudyMaterialRequest request, String uploaderUid, String uploaderName);
}
